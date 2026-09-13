"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { clamp } from "@/lib/utils";

/**
 * A house lift, as a self-playing clip.
 *
 * This replaces the old before/after wipe. A wipe only ever shows two frozen
 * states and leaves the interesting part — the actual lift — to the reader's
 * imagination. Here the whole job plays out in one continuous shot: monsoon
 * water standing against the walls, the survey, pits dug and needle beams
 * threaded through, jacks seated, the structure rising as one rigid unit, the
 * new plinth cast into the gap, temporary works stripped out, dry ground.
 *
 * It is SVG driven by a single GSAP timeline rather than a video file. That
 * buys three things a real clip could not: it stays sharp at any size, it costs
 * a few kilobytes instead of megabytes, and the transport controls can scrub a
 * timeline that is also the source of truth for the captions.
 *
 * GSAP writes to the DOM directly, so scrubbing and playback never re-render
 * React. The only state that crosses back is the caption index and the whole
 * second on the clock — both change at most a handful of times per run.
 */

const VIEW_W = 800;
const VIEW_H = 500;

/** Soil surface. Every vertical measurement below hangs off this. */
const GROUND = 372;
/** How far the structure travels, in user units. ~6 ft at this scale. */
const LIFT = 114;

/** Jack ram: 20 units retracted, and it must cover the full lift extended. */
const ROD_H = 20;
const ROD_SCALE = (ROD_H + LIFT) / ROD_H;

const CLIP_SECONDS = 14;

/** Standing water surface, just below the raised carriageway. */
const WATER_Y = GROUND - 48;

interface Phase {
  /** Timeline position, in seconds. */
  at: number;
  label: string;
  text: string;
}

/**
 * Captions are keyed to timeline seconds rather than to tween callbacks, so
 * scrubbing backwards lands on the right caption too.
 */
const PHASES: readonly Phase[] = [
  {
    at: 0,
    label: "Before",
    text: "Plinth 1.2 ft under the raised road. Monsoon water standing against the walls, every year.",
  },
  {
    at: 1.8,
    label: "Survey",
    text: "Levels taken, load paths traced, lift points set out against the existing foundation.",
  },
  {
    at: 3.4,
    label: "Needle beams",
    text: "Pits opened under the plinth and steel needle beams threaded through the structure.",
  },
  {
    at: 4.9,
    label: "Jacks seated",
    text: "Synchronised mechanical jacks on load-spreading base plates, one bank per beam.",
  },
  {
    at: 6.2,
    label: "Lift",
    text: "The house rises as one rigid unit — 25 mm a stroke, every jack within ±2 mm.",
  },
  {
    at: 9.2,
    label: "New plinth",
    text: "M20 RCC plinth (or as per requirement) cast into the gap and cured before any load comes back onto it.",
  },
  {
    at: 11,
    label: "Strip out",
    text: "Load transferred to the new plinth. Beams withdrawn, jacks recovered, pits backfilled.",
  },
  {
    at: 12,
    label: "After",
    text: "6 ft above the old flood line. Nothing inside the house was opened or rebuilt.",
  },
];

function phaseIndexAt(seconds: number): number {
  let index = 0;
  for (let i = 0; i < PHASES.length; i += 1) {
    if (seconds >= (PHASES[i]?.at ?? 0)) index = i;
  }
  return index;
}

function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `0:${String(whole).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Static geometry                                                     */
/* ------------------------------------------------------------------ */

/** Height of one rain tile; two stacked copies make the loop seamless. */
const RAIN_TILE = 560;

const RAIN_DROPS: ReadonlyArray<{ x: number; y: number }> = Array.from(
  { length: 34 },
  (_, i) => ({ x: (i * 137) % VIEW_W, y: (i * 71) % RAIN_TILE }),
);

/** Full wavelength of the water line — must match the `water-drift` shift. */
const WAVE_PERIOD = 220;

/** Scalloped surface drawn a wavelength proud of each edge, so drift never
 *  exposes an unpainted end. */
function wavePath(y: number): string {
  const arc = WAVE_PERIOD / 2;
  let d = `M${-WAVE_PERIOD} ${y}`;
  let i = 0;

  for (let x = -WAVE_PERIOD; x < VIEW_W + WAVE_PERIOD; x += arc) {
    d += ` Q ${x + arc / 2} ${y + (i % 2 === 0 ? -9 : 9)} ${x + arc} ${y}`;
    i += 1;
  }

  return d;
}

/** Two jack banks, centred under the two needle beams. */
const JACK_X: readonly number[] = [300, 468];

/* ------------------------------------------------------------------ */

export function ElevationClip(): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /** Last values pushed to React, so onUpdate can skip redundant renders. */
  const lastPhaseRef = useRef<number>(-1);
  const lastSecondRef = useRef<number>(-1);

  const [phase, setPhase] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);
  const [inView, setInView] = useState<boolean>(false);
  const [reduced, setReduced] = useState<boolean>(false);
  const [scrubbing, setScrubbing] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = (): void => setReduced(mq.matches);

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Nothing plays while it's off screen — the same courtesy a real autoplaying
  // video owes you.
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;
    let ctx: { revert: () => void } | undefined;

    // Dynamic import keeps GSAP out of the initial bundle, matching the
    // pinned storyboard's approach.
    (async () => {
      const gsapMod = await import("gsap");
      if (!mounted) return;
      const gsap = gsapMod.default;

      ctx = gsap.context(() => {
        const handleUpdate = (): void => {
          const tl = timelineRef.current;
          if (!tl) return;

          const time = tl.time();

          if (barRef.current) {
            barRef.current.style.width = `${tl.progress() * 100}%`;
          }

          const nextPhase = phaseIndexAt(time);
          if (nextPhase !== lastPhaseRef.current) {
            lastPhaseRef.current = nextPhase;
            setPhase(nextPhase);
          }

          const nextSecond = Math.floor(time);
          if (nextSecond !== lastSecondRef.current) {
            lastSecondRef.current = nextSecond;
            setSeconds(nextSecond);
          }
        };

        const tl = gsap.timeline({
          paused: true,
          repeat: -1,
          onUpdate: handleUpdate,
        });

        // ---- Opening state ----
        gsap.set(".lc-sky-after", { opacity: 0 });
        gsap.set([".lc-sun", ".lc-clouds"], { opacity: 0 });
        gsap.set(".lc-rain", { opacity: 0.45 });
        gsap.set(".lc-water", { opacity: 1, y: 0 });
        gsap.set(".lc-survey", { opacity: 0 });
        gsap.set(".lc-trench", { opacity: 0, scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(".lc-beams", { opacity: 0, x: -70, y: 0 });
        gsap.set(".lc-jacks", { opacity: 0, y: 26 });
        gsap.set(".lc-rod", { scaleY: 1, transformOrigin: "50% 100%" });
        gsap.set(".lc-house", { y: 0 });
        // Opacity back to 1 here: the markup ships it hidden so the very first
        // paint (before GSAP arrives) is a coherent "before" frame, but from
        // here on the plinth is revealed by scaleY alone.
        gsap.set(".lc-plinth", { opacity: 1, scaleY: 0, transformOrigin: "50% 100%" });
        gsap.set([".lc-steps", ".lc-dust", ".lc-dim", ".lc-floodline", ".lc-finish"], {
          opacity: 0,
        });
        gsap.set(".lc-damp", { opacity: 0.32 });

        // ---- 1.8s · the monsoon passes ----
        tl.to(".lc-rain", { opacity: 0, duration: 1.1 }, 1.8);
        tl.to(".lc-water", { opacity: 0, y: 30, duration: 1.5 }, 2);

        // ---- 2.2s · survey ----
        tl.to(".lc-survey", { opacity: 1, duration: 0.5 }, 2.2);
        tl.to(".lc-survey", { opacity: 0, duration: 0.5 }, 4.5);

        // ---- 3.4s · pits opened, needle beams threaded ----
        tl.to(".lc-trench", { opacity: 1, scaleY: 1, duration: 0.9 }, 3.4);
        tl.to(".lc-beams", { opacity: 1, x: 0, duration: 1.1 }, 4);

        // ---- 4.9s · jacks seated ----
        tl.to(".lc-jacks", { opacity: 1, y: 0, duration: 1 }, 4.9);

        // ---- 6.2s · the lift. Linear, because hydraulics are. ----
        tl.to(".lc-house", { y: -LIFT, duration: 3, ease: "none" }, 6.2);
        tl.to(".lc-beams", { y: -LIFT, duration: 3, ease: "none" }, 6.2);
        tl.to(".lc-rod", { scaleY: ROD_SCALE, duration: 3, ease: "none" }, 6.2);
        tl.to(".lc-dust", { opacity: 0.5, duration: 0.6 }, 6.3);
        tl.to(".lc-dust", { opacity: 0, duration: 0.9 }, 8.5);

        // ---- 9.2s · new plinth cast into the gap ----
        tl.to(".lc-plinth", { scaleY: 1, duration: 1.6 }, 9.2);
        tl.to(".lc-steps", { opacity: 1, duration: 0.8 }, 10.3);

        // ---- 11s · temporary works out ----
        tl.to([".lc-jacks", ".lc-beams"], { opacity: 0, duration: 0.9 }, 11);
        tl.to(".lc-trench", { opacity: 0, duration: 0.9 }, 11.3);

        // ---- 11.9s · dry ground ----
        tl.to(".lc-sky-after", { opacity: 1, duration: 1.6 }, 11.9);
        tl.to(".lc-clouds", { opacity: 0.85, duration: 1.6 }, 11.9);
        tl.to(".lc-sun", { opacity: 1, duration: 1.4 }, 12.1);
        tl.to(".lc-damp", { opacity: 0, duration: 1.2 }, 12);
        tl.to(".lc-finish", { opacity: 1, duration: 1.2 }, 12.1);
        tl.to(".lc-floodline", { opacity: 1, duration: 0.9 }, 12.4);
        tl.to(".lc-dim", { opacity: 1, duration: 0.7 }, 12.8);

        // Cut back to the start on a white flash rather than snapping a raised
        // house back into the mud. `immediateRender: false` matters: without it
        // GSAP would paint the veil opaque the moment the timeline is built,
        // and the section would sit as a white box until it scrolled into view.
        tl.fromTo(
          ".lc-veil",
          { opacity: 1 },
          { opacity: 0, duration: 0.4, immediateRender: false },
          0,
        );
        tl.to(".lc-veil", { opacity: 1, duration: 0.35 }, CLIP_SECONDS - 0.35);

        timelineRef.current = tl;
        handleUpdate();
        setReady(true);
      }, rootRef);
    })();

    return () => {
      mounted = false;
      timelineRef.current = null;
      ctx?.revert();
    };
  }, []);

  // Single source of playback truth: user intent AND on screen AND not
  // mid-scrub AND motion is welcome. `ready` is in the deps so this re-runs
  // once the timeline actually exists.
  useEffect(() => {
    const tl = timelineRef.current;
    if (!ready || !tl) return;

    if (playing && inView && !reduced && !scrubbing) {
      tl.play();
    } else {
      tl.pause();
    }
  }, [playing, inView, reduced, scrubbing, ready]);

  // Reduced motion opens on the finished frame instead of an empty one, so the
  // still that greets those readers is the one that makes the point.
  useEffect(() => {
    const tl = timelineRef.current;
    if (!ready || !tl || !reduced) return;

    setPlaying(false);
    tl.progress(0.99);
  }, [reduced, ready]);

  const seekFromClientX = useCallback((clientX: number): void => {
    const track = trackRef.current;
    const tl = timelineRef.current;
    if (!track || !tl) return;

    const rect = track.getBoundingClientRect();
    if (rect.width === 0) return;

    tl.progress(clamp((clientX - rect.left) / rect.width, 0, 1));
  }, []);

  const handleScrubDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setScrubbing(true);
      seekFromClientX(event.clientX);
    },
    [seekFromClientX],
  );

  const handleScrubMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      if (!scrubbing) return;
      seekFromClientX(event.clientX);
    },
    [scrubbing, seekFromClientX],
  );

  const handleScrubUp = useCallback((): void => setScrubbing(false), []);

  const handleScrubKey = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>): void => {
      const tl = timelineRef.current;
      if (!tl) return;

      const step = event.shiftKey ? 0.1 : 0.02;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        tl.progress(clamp(tl.progress() - step, 0, 1));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        tl.progress(clamp(tl.progress() + step, 0, 1));
      } else if (event.key === "Home") {
        event.preventDefault();
        tl.progress(0);
      } else if (event.key === "End") {
        event.preventDefault();
        tl.progress(0.999);
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setPlaying((current) => !current);
      }
    },
    [],
  );

  const restart = useCallback((): void => {
    timelineRef.current?.progress(0);
    setPlaying(true);
  }, []);

  const current = PHASES[phase] ?? PHASES[0]!;
  const isPlaying = playing && !reduced;

  return (
    <figure className="m-0">
      <div
        ref={rootRef}
        className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-lg"
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-full w-full"
          role="img"
          aria-label="Animated sequence of a house being raised six feet above its flood line on mechanical jacks"
        >
          <defs>
            <linearGradient id="lc-sky-before" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="lc-sky-after" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <linearGradient id="lc-plinth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* ---------- Sky ---------- */}
          <rect width={VIEW_W} height={VIEW_H} fill="url(#lc-sky-before)" />
          <rect
            className="lc-sky-after"
            width={VIEW_W}
            height={VIEW_H}
            fill="url(#lc-sky-after)"
            opacity="0"
          />

          <g className="lc-sun" opacity="0">
            <circle cx="688" cy="92" r="52" fill="#fde68a" opacity="0.35" />
            <circle cx="688" cy="92" r="30" fill="#fcd34d" />
          </g>

          <g className="lc-clouds" fill="#ffffff" opacity="0">
            <g className="motion-safe:animate-cloud-drift">
              <ellipse cx="0" cy="86" rx="52" ry="19" />
              <ellipse cx="36" cy="78" rx="38" ry="23" />
              <ellipse cx="-32" cy="92" rx="32" ry="15" />
            </g>
            <g
              className="motion-safe:animate-cloud-drift"
              style={{ animationDelay: "-23s" }}
              opacity="0.7"
            >
              <ellipse cx="0" cy="150" rx="38" ry="14" />
              <ellipse cx="28" cy="144" rx="27" ry="17" />
            </g>
          </g>

          {/* ---------- Rain ---------- */}
          <g
            className="lc-rain motion-safe:animate-rain-fall"
            stroke="#7dd3fc"
            strokeWidth="2"
            opacity="0.45"
          >
            {[-RAIN_TILE, 0].map((offset) =>
              RAIN_DROPS.map((drop, i) => (
                <line
                  key={`${offset}-${i}`}
                  x1={drop.x}
                  y1={drop.y + offset}
                  x2={drop.x - 9}
                  y2={drop.y + offset + 24}
                />
              )),
            )}
          </g>

          {/* ---------- Raised carriageway the plot sits below ---------- */}
          <rect x="0" y={GROUND - 56} width="150" height="56" fill="#78716c" />
          <rect x="0" y={GROUND - 62} width="150" height="8" fill="#57534e" />
          <text x="14" y={GROUND - 74} fontSize="15" fontFamily="ui-monospace, monospace" fill="#44403c">
            ROAD LEVEL
          </text>

          {/* ---------- Soil ---------- */}
          <rect x="0" y={GROUND} width={VIEW_W} height={VIEW_H - GROUND} fill="#a8a29e" />
          <line x1="0" y1={GROUND} x2={VIEW_W} y2={GROUND} stroke="#78716c" strokeWidth="2" />

          {/* ---------- Excavated pits ---------- */}
          <g className="lc-trench" opacity="0">
            <rect x="200" y={GROUND} width="395" height="64" fill="#57534e" />
            <rect x="200" y={GROUND} width="395" height="6" fill="#44403c" />
          </g>

          {/* ---------- New RCC plinth, cast into the gap ---------- */}
          <g className="lc-plinth" opacity="0">
            <rect
              x="230"
              y={GROUND - LIFT}
              width="330"
              height={LIFT}
              fill="url(#lc-plinth-fill)"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={244 + i * 55}
                y1={GROUND - 4}
                x2={244 + i * 55}
                y2={GROUND - LIFT + 4}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* ---------- Steps up to the new level ---------- */}
          <g className="lc-steps" opacity="0">
            {[0, 1, 2, 3].map((i) => {
              const height = LIFT - i * 28;
              return (
                <rect
                  key={i}
                  x={562 + i * 20}
                  y={GROUND - height}
                  width="20"
                  height={height}
                  fill="#cbd5e1"
                  stroke="#475569"
                  strokeWidth="2"
                />
              );
            })}
          </g>

          {/* ---------- The house ---------- */}
          <g className="lc-house">
            <rect x="468" y="182" width="24" height="42" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
            <path d="M214 250 L395 176 L576 250 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
            <rect x="230" y="246" width="330" height="126" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
            <rect x="230" y="352" width="330" height="20" fill="#e2e8f0" stroke="#334155" strokeWidth="2.5" />

            <rect x="266" y="286" width="66" height="54" fill="#94a3b8" stroke="#0369a1" strokeWidth="2" />
            <rect x="458" y="286" width="66" height="54" fill="#94a3b8" stroke="#0369a1" strokeWidth="2" />
            <rect x="366" y="296" width="58" height="76" fill="#78350f" opacity="0.7" />

            {/* Damp rising up the walls — the reason any of this is happening */}
            <rect
              className="lc-damp"
              x="230"
              y="310"
              width="330"
              height="62"
              fill="#78716c"
              opacity="0.32"
            />

            {/* Re-finished surfaces, faded in once the house is down on the
                new plinth. Same shapes, brighter fills. */}
            <g className="lc-finish" opacity="0">
              <path d="M214 250 L395 176 L576 250 Z" fill="#e2e8f0" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
              <rect x="230" y="246" width="330" height="126" fill="#ffffff" stroke="#334155" strokeWidth="3" />
              <rect x="230" y="352" width="330" height="20" fill="#f1f5f9" stroke="#334155" strokeWidth="2.5" />
              <rect x="266" y="286" width="66" height="54" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
              <rect x="458" y="286" width="66" height="54" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
              <rect x="366" y="296" width="58" height="76" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            </g>
          </g>

          {/* ---------- Needle beams (ride with the structure) ---------- */}
          <g className="lc-beams" opacity="0">
            <rect x="205" y={GROUND} width="385" height="12" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="205" y={GROUND} width="385" height="4" fill="#64748b" />
          </g>

          {/* ---------- Jack banks ---------- */}
          <g className="lc-jacks" opacity="0">
            {JACK_X.map((x) => (
              <g key={x}>
                <rect
                  className="lc-rod"
                  x={x + 8}
                  y={GROUND + 12}
                  width="14"
                  height={ROD_H}
                  fill="#0284c7"
                />
                <rect x={x} y={GROUND + 32} width="30" height="24" rx="2" fill="#334155" />
                <rect x={x} y={GROUND + 32} width="30" height="5" rx="2" fill="#475569" />
                <rect x={x - 6} y={GROUND + 56} width="42" height="6" rx="2" fill="#1e293b" />
              </g>
            ))}
          </g>

          {/* ---------- Dust kicked up by the lift ---------- */}
          <g className="lc-dust" fill="#d6d3d1" opacity="0">
            {[248, 336, 452, 540].map((x, i) => (
              <circle key={x} cx={x} cy={GROUND - 6 - (i % 2) * 8} r={10 + (i % 3) * 4} />
            ))}
          </g>

          {/* ---------- Standing water ---------- */}
          <g className="lc-water">
            <rect x="0" y={WATER_Y} width={VIEW_W} height="58" fill="#38bdf8" opacity="0.5" />
            <g className="motion-safe:animate-water-drift">
              <path d={wavePath(WATER_Y)} fill="none" stroke="#0284c7" strokeWidth="3" />
            </g>
            <text x="596" y={WATER_Y - 14} fontSize="15" fontFamily="ui-monospace, monospace" fontWeight="600" fill="#0369a1">
              +1.4 m WATER
            </text>
          </g>

          {/* ---------- Old flood line, once it is safely below ---------- */}
          <g className="lc-floodline" opacity="0">
            <line
              x1="0"
              y1={WATER_Y}
              x2={VIEW_W}
              y2={WATER_Y}
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeDasharray="11 7"
            />
            <text x="596" y={WATER_Y - 10} fontSize="14" fontFamily="ui-monospace, monospace" fill="#0369a1">
              OLD FLOOD LINE
            </text>
          </g>

          {/* ---------- Survey ---------- */}
          <g className="lc-survey" opacity="0">
            <circle cx="96" cy="250" r="13" fill="#0284c7" opacity="0.25" />
            <circle cx="96" cy="250" r="5" fill="#0ea5e9" />
            <line x1="96" y1="255" x2="96" y2={GROUND} stroke="#0ea5e9" strokeWidth="1.5" />
            {[250, 320, 366].map((y) => (
              <line
                key={y}
                x1="100"
                y1="252"
                x2="228"
                y2={y}
                stroke="#0ea5e9"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
            ))}
            <text x="70" y="234" fontSize="13" fontFamily="ui-monospace, monospace" fill="#0369a1">
              LEVELS
            </text>
          </g>

          {/* ---------- Lift dimension ---------- */}
          <g className="lc-dim" opacity="0">
            <g stroke="#0284c7" strokeWidth="2.5" fill="none">
              <line x1="178" y1={GROUND - LIFT} x2="178" y2={GROUND} />
              <path d={`M170 ${GROUND - LIFT + 9} L178 ${GROUND - LIFT} L186 ${GROUND - LIFT + 9}`} />
              <path d={`M170 ${GROUND - 9} L178 ${GROUND} L186 ${GROUND - 9}`} />
            </g>
            <text
              x="166"
              y={GROUND - LIFT / 2 + 6}
              textAnchor="end"
              fontSize="18"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
              fill="#0369a1"
            >
              6 ft
            </text>
          </g>

          {/* Loop cut */}
          <rect className="lc-veil" width={VIEW_W} height={VIEW_H} fill="#ffffff" />
        </svg>

        {/* ---------- Caption ---------- */}
        <div className="pointer-events-none absolute left-3 top-3 sm:left-4 sm:top-4 max-w-[calc(100%-1.5rem)] sm:max-w-[19rem]">
          <span className="inline-flex rounded bg-slate-950/85 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-sm">
            {current.label}
          </span>
          <p className="mt-1.5 sm:mt-2 rounded bg-white/80 px-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] leading-snug text-ink shadow-sm backdrop-blur-sm">
            {current.text}
          </p>
        </div>

        {/* ---------- Transport ---------- */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-transparent px-3 sm:px-4 pb-3 sm:pb-4 pt-10 sm:pt-12">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={isPlaying ? "Pause the sequence" : "Play the sequence"}
              className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white shadow-md transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={restart}
              aria-label="Restart the sequence"
              className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <div
              ref={trackRef}
              role="slider"
              tabIndex={0}
              aria-label="Sequence position"
              aria-valuemin={0}
              aria-valuemax={CLIP_SECONDS}
              aria-valuenow={seconds}
              aria-valuetext={`${current.label} — ${formatClock(seconds)} of ${formatClock(CLIP_SECONDS)}`}
              onPointerDown={handleScrubDown}
              onPointerMove={handleScrubMove}
              onPointerUp={handleScrubUp}
              onPointerCancel={handleScrubUp}
              onKeyDown={handleScrubKey}
              className="group relative h-8 sm:h-6 flex-1 cursor-pointer touch-none focus-visible:outline-none"
            >
              <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25 ring-white/70 group-focus-visible:ring-2">
                <div ref={barRef} className="h-full rounded-full bg-amber-500" style={{ width: "0%" }} />
              </div>
              {/* Phase ticks, so the shape of the job is legible from the bar */}
              {PHASES.map((item) => (
                <span
                  key={item.at}
                  aria-hidden
                  className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-white/45"
                  style={{ left: `${(item.at / CLIP_SECONDS) * 100}%` }}
                />
              ))}
            </div>

            <span className="nums shrink-0 font-mono text-[11px] font-semibold text-white/85">
              {formatClock(seconds)} / {formatClock(CLIP_SECONDS)}
            </span>
          </div>
        </div>
      </div>

      <figcaption className="sr-only">
        {PHASES.map((item) => `${item.label}: ${item.text}`).join(" ")}
      </figcaption>
    </figure>
  );
}
