"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { clamp } from "@/lib/utils";

/**
 * A stilt parking conversion, as a self-playing clip.
 *
 * Same technique as `ElevationClip` — SVG driven by one GSAP timeline, scrubbable,
 * a few kilobytes instead of a video file — pointed at a different outcome. The
 * lift here is not an escape from a flood line; the clearance it opens *is* the
 * product. So the clip holds on the void: house rises, RCC stilts grow into the
 * gap, temporary works retire, the floor is screeded, two cars roll in.
 *
 * GSAP writes to the DOM directly, so playback and scrubbing never re-render
 * React. Only the caption index and the whole second cross back, and `onProgress`
 * rides the same quantised update so a parent readout stays live for free.
 */

const VIEW_W = 800;
const VIEW_H = 500;

/** Soil surface. Every vertical measurement below hangs off this. */
const GROUND = 392;
/** Travel of the structure, in user units. ~8 ft at this scale. */
const LIFT = 132;
/** Finished parking floor, one screed thickness above the sub-base. */
const BAY_FLOOR = GROUND - 8;
/** Underside of the plinth once the lift is complete. */
const SLAB_UNDERSIDE = GROUND - LIFT;

/** Jack ram: 22 units retracted, and it must cover the full lift extended. */
const ROD_H = 22;
const ROD_SCALE = (ROD_H + LIFT) / ROD_H;

const CLIP_SECONDS = 16;
/** Where the white loop-cut starts. The clip is finished by here. */
const VEIL_IN = CLIP_SECONDS - 0.35;
/**
 * The frame reduced-motion readers open on. Held just short of the loop cut —
 * park it any later and the veil is already fading up, so the "finished" still
 * would arrive half washed out.
 */
const STILL_PROGRESS = (VEIL_IN - 0.15) / CLIP_SECONDS;

/** Permanent stilt columns, symmetric about the centre line. */
const COLUMNS: readonly number[] = [226, 342, 458, 574];
/** Temporary jacks, offset from the columns so both stay legible. */
const JACKS: readonly number[] = [284, 400, 516];

/** Plinth depth. The door sill sits this far above the slab underside. */
const PLINTH_T = 24;
/**
 * The stair climbs from the soil to the raised floor level, so its rise is the
 * whole travel plus the plinth it lands on — not the clear height under the slab.
 */
const STAIR_RISE = GROUND - (SLAB_UNDERSIDE - PLINTH_T);
const STAIR_TREADS = 7;

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
    text: "Ground floor at grade, car left on the street. No covered parking and no land to buy any.",
  },
  {
    at: 2,
    label: "Setting out",
    text: "Levels taken and the stilt column grid marked out against the existing footprint.",
  },
  {
    at: 3.6,
    label: "Pad footings",
    text: "Pits opened at each column position and pad footings cast to bear the new load.",
  },
  {
    at: 5,
    label: "Jacks seated",
    text: "Needle beams threaded under the plinth, synchronised jacks on load-spreading plates.",
  },
  {
    at: 6.6,
    label: "Raising",
    text: "The house climbs 25 mm a stroke, every jack within ±2 mm. The bay opens underneath.",
  },
  {
    at: 10,
    label: "Stilts cast",
    text: "M20 RCC columns (or as per requirement) poured full height on Fe500D cages, then cured before any load returns.",
  },
  {
    at: 11.8,
    label: "Load transfer",
    text: "Load handed to the columns. Beams withdrawn, jacks recovered, pits backfilled.",
  },
  {
    at: 13,
    label: "Screed & access",
    text: "Parking floor screeded to fall and the new stair built up to the raised front door.",
  },
  {
    at: 14.2,
    label: "Two-car bay",
    text: "8 ft clear under the slab. Two cars covered, not an inch of plot given up.",
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

/** One car, drawn sitting on `floorY`. Wheels touch the floor exactly. */
function CarBody({
  x,
  floorY,
  body,
  cabin,
}: {
  x: number;
  floorY: number;
  body: string;
  cabin: string;
}): JSX.Element {
  return (
    <>
      <rect x={x} y={floorY - 44} width="136" height="28" rx="9" fill={body} />
      <path
        d={`M${x + 28} ${floorY - 44} q10 -26 34 -26 h30 q22 0 32 26 z`}
        fill={cabin}
      />
      {[x + 32, x + 106].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={floorY - 14} r="14" fill="#0f172a" />
          <circle cx={cx} cy={floorY - 14} r="5.5" fill="#94a3b8" />
        </g>
      ))}
    </>
  );
}

interface StiltParkingClipProps {
  /**
   * Fires on the clip's own quantised update — whole-second or phase changes
   * only — so a parent readout can track the conversion without adding renders.
   */
  onProgress?: (progress: number, phaseLabel: string) => void;
}

export function StiltParkingClip({ onProgress }: StiltParkingClipProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /** Latest callback, so the timeline effect never re-runs to pick up a new one. */
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

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

    // Dynamic import keeps GSAP out of the initial bundle.
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
          const nextSecond = Math.floor(time);
          const phaseChanged = nextPhase !== lastPhaseRef.current;
          const secondChanged = nextSecond !== lastSecondRef.current;

          if (phaseChanged) {
            lastPhaseRef.current = nextPhase;
            setPhase(nextPhase);
          }
          if (secondChanged) {
            lastSecondRef.current = nextSecond;
            setSeconds(nextSecond);
          }
          if (phaseChanged || secondChanged) {
            onProgressRef.current?.(
              tl.progress(),
              PHASES[nextPhase]?.label ?? PHASES[0]!.label,
            );
          }
        };

        const tl = gsap.timeline({
          paused: true,
          repeat: -1,
          onUpdate: handleUpdate,
        });

        /* ---- Opening state ---- */
        gsap.set(".spc-sky-after", { opacity: 0 });
        gsap.set([".spc-sun", ".spc-clouds"], { opacity: 0 });
        gsap.set([".spc-grid", ".spc-scan", ".spc-marks"], { opacity: 0 });
        gsap.set(".spc-trench", { opacity: 0, scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(".spc-footing", { opacity: 0, scale: 0.55, transformOrigin: "50% 100%" });
        gsap.set(".spc-beams", { opacity: 0, x: -90, y: 0 });
        gsap.set(".spc-jacks", { opacity: 0, y: 30 });
        gsap.set(".spc-rod", { scaleY: 1, transformOrigin: "50% 100%" });
        gsap.set(".spc-house", { y: 0 });
        // Opacity back to 1 here: the markup ships the columns hidden so the very
        // first paint (before GSAP arrives) is a coherent "before" frame, but from
        // here on they are revealed by scaleY alone.
        gsap.set(".spc-columns", { opacity: 1 });
        gsap.set(".spc-column", { scaleY: 0, transformOrigin: "50% 100%" });
        gsap.set(".spc-street-car", { opacity: 1, x: 0 });
        gsap.set(".spc-bay-car", { opacity: 0, x: 330 });
        gsap.set(
          [
            ".spc-dust",
            ".spc-shadow",
            ".spc-screed",
            ".spc-drain",
            ".spc-stair",
            ".spc-dim",
            ".spc-badge",
          ],
          { opacity: 0 },
        );

        /* ---- 2s · setting out: grid, laser scan, column marks ---- */
        tl.to(".spc-grid", { opacity: 0.45, duration: 0.8 }, 2);
        tl.to(".spc-scan", { opacity: 1, duration: 0.4 }, 2.1);
        tl.to(".spc-scan", { opacity: 0, duration: 0.5 }, 4.4);
        tl.to(".spc-marks", { opacity: 1, duration: 0.4 }, 2.4);

        /* ---- 3.6s · pits opened, pad footings cast ---- */
        tl.to(".spc-trench", { opacity: 1, scaleY: 1, duration: 0.9 }, 3.6);
        tl.to(".spc-footing", { opacity: 1, scale: 1, duration: 0.7, stagger: 0.13 }, 4.1);

        /* ---- 5s · needle beams threaded, jacks seated ---- */
        tl.to(".spc-beams", { opacity: 1, x: 0, duration: 1.1 }, 5);
        tl.to(".spc-jacks", { opacity: 1, y: 0, duration: 0.9 }, 5.6);
        tl.to(".spc-scan", { opacity: 0.35, duration: 0.4 }, 5.8);

        /* ---- 6.6s · the lift. Linear, because hydraulics are. ---- */
        tl.to(".spc-house", { y: -LIFT, duration: 3.4, ease: "none" }, 6.6);
        tl.to(".spc-beams", { y: -LIFT, duration: 3.4, ease: "none" }, 6.6);
        tl.to(".spc-rod", { scaleY: ROD_SCALE, duration: 3.4, ease: "none" }, 6.6);
        tl.to(".spc-dust", { opacity: 0.5, duration: 0.6 }, 6.7);
        tl.to(".spc-dust", { opacity: 0, duration: 0.9 }, 8.9);
        tl.to(".spc-grid", { opacity: 0, duration: 0.7 }, 7.4);

        /* ---- 10s · stilts cast into the gap ---- */
        tl.to(".spc-column", { scaleY: 1, duration: 1.5 }, 10);
        tl.to(".spc-shadow", { opacity: 0.22, duration: 1 }, 10.8);

        /* ---- 11.8s · temporary works out ---- */
        tl.to([".spc-jacks", ".spc-beams"], { opacity: 0, duration: 0.8 }, 11.8);
        tl.to(".spc-trench", { opacity: 0, duration: 0.8 }, 12);

        /* ---- 13s · screed, drain, stair, bright weather ---- */
        tl.to(".spc-screed", { opacity: 1, duration: 0.8 }, 13);
        tl.to(".spc-drain", { opacity: 1, duration: 0.7 }, 13.4);
        tl.to(".spc-stair", { opacity: 1, duration: 0.9 }, 13.2);
        tl.to(".spc-sky-after", { opacity: 1, duration: 1.6 }, 13);
        tl.to(".spc-clouds", { opacity: 0.85, duration: 1.6 }, 13);
        tl.to(".spc-sun", { opacity: 1, duration: 1.4 }, 13.2);
        tl.to(".spc-dim", { opacity: 1, duration: 0.7 }, 13.4);

        /* ---- 14.2s · the cars ---- */
        tl.to(".spc-street-car", { opacity: 0, duration: 0.5 }, 14.2);
        tl.to(".spc-bay-car", { opacity: 1, x: 0, duration: 0.9, stagger: 0.24 }, 14.2);
        tl.to(".spc-badge", { opacity: 1, duration: 0.6 }, 14.8);

        // Cut back to the start on a white flash rather than snapping a bay full
        // of cars back into an empty site. `immediateRender: false` matters:
        // without it GSAP would paint the veil opaque the moment the timeline is
        // built, and the section would sit as a white box until scrolled into view.
        tl.fromTo(
          ".spc-veil",
          { opacity: 1 },
          { opacity: 0, duration: 0.4, immediateRender: false },
          0,
        );
        tl.to(".spc-veil", { opacity: 1, duration: 0.35 }, VEIL_IN);


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

  // Reduced motion opens on the finished frame instead of an empty site, so the
  // still that greets those readers is the one that makes the point.
  useEffect(() => {
    const tl = timelineRef.current;
    if (!ready || !tl || !reduced) return;

    setPlaying(false);
    tl.progress(STILL_PROGRESS);
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
          aria-label="Animated sequence of a house raised eight feet onto RCC stilt columns, opening a covered two-car parking bay underneath"
        >
          <defs>
            <linearGradient id="spc-sky-before" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a3aebd" />
              <stop offset="100%" stopColor="#e6eaef" />
            </linearGradient>
            <linearGradient id="spc-sky-after" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <linearGradient id="spc-column-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="42%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="spc-bay-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ---------- Sky ---------- */}
          <rect width={VIEW_W} height={VIEW_H} fill="url(#spc-sky-before)" />
          <rect
            className="spc-sky-after"
            width={VIEW_W}
            height={VIEW_H}
            fill="url(#spc-sky-after)"
            opacity="0"
          />

          <g className="spc-sun" opacity="0">
            <circle cx="708" cy="78" r="50" fill="#fde68a" opacity="0.35" />
            <circle cx="708" cy="78" r="28" fill="#fcd34d" />
          </g>

          <g className="spc-clouds" fill="#ffffff" opacity="0">
            <g className="motion-safe:animate-cloud-drift">
              <ellipse cx="0" cy="96" rx="50" ry="18" />
              <ellipse cx="34" cy="88" rx="36" ry="22" />
              <ellipse cx="-30" cy="102" rx="30" ry="14" />
            </g>
            <g
              className="motion-safe:animate-cloud-drift"
              style={{ animationDelay: "-26s" }}
              opacity="0.7"
            >
              <ellipse cx="0" cy="158" rx="36" ry="13" />
              <ellipse cx="26" cy="152" rx="26" ry="16" />
            </g>
          </g>

          {/* ---------- Blueprint setting-out grid ---------- */}
          <g className="spc-grid" stroke="#0ea5e9" strokeWidth="0.8" opacity="0">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`gv-${i}`} x1={168 + i * 54} y1="112" x2={168 + i * 54} y2={GROUND} />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`gh-${i}`} x1="168" y1={132 + i * 52} x2="654" y2={132 + i * 52} />
            ))}
          </g>

          {/* ---------- Soil ---------- */}
          <rect x="0" y={GROUND} width={VIEW_W} height={VIEW_H - GROUND} fill="#a8a29e" />
          <line x1="0" y1={GROUND} x2={VIEW_W} y2={GROUND} stroke="#78716c" strokeWidth="2" />

          {/* ---------- Street the car is stranded on ---------- */}
          <rect x="0" y={GROUND} width="158" height={VIEW_H - GROUND} fill="#57534e" />
          <rect x="0" y={GROUND} width="158" height="5" fill="#44403c" />
          <rect x="152" y={GROUND - 7} width="9" height="7" fill="#78716c" />
          {[404, 434, 464].map((y) => (
            <line key={y} x1="18" y1={y} x2="52" y2={y} stroke="#d6d3d1" strokeWidth="2.5" />
          ))}

          <g className="spc-street-car">
            <CarBody x={10} floorY={GROUND} body="#475569" cabin="#64748b" />
          </g>

          {/* ---------- Excavated pits ---------- */}
          <g className="spc-trench" opacity="0">
            <rect x="196" y={GROUND} width="408" height="72" fill="#57534e" />
            <rect x="196" y={GROUND} width="408" height="6" fill="#44403c" />
          </g>

          {/* ---------- Pad footings, cast before anything is lifted ---------- */}
          <g>
            {COLUMNS.map((x) => (
              <g key={`footing-${x}`} className="spc-footing" opacity="0">
                <rect x={x - 29} y={GROUND - 8} width="58" height="17" rx="1.5" fill="#94a3b8" />
                <rect x={x - 29} y={GROUND - 8} width="58" height="4" rx="1.5" fill="#cbd5e1" />
              </g>
            ))}
          </g>

          {/* ---------- Screeded parking floor ---------- */}
          <g className="spc-screed" opacity="0">
            <rect x="200" y={BAY_FLOOR} width="400" height="9" fill="#d6d3d1" />
            <rect x="200" y={BAY_FLOOR} width="400" height="3" fill="#e7e5e4" />
          </g>

          {/* ---------- Fall + drainage annotation ---------- */}
          <g className="spc-drain" opacity="0">
            <line
              x1="250"
              y1={GROUND + 22}
              x2="550"
              y2={GROUND + 22}
              stroke="#d6d3d1"
              strokeWidth="1.5"
              strokeDasharray="6 5"
            />
            <path d={`M550 ${GROUND + 22} l-9 -4 v8 z`} fill="#d6d3d1" />
            <text
              x="400"
              y={GROUND + 14}
              textAnchor="middle"
              fontSize="13"
              fontFamily="ui-monospace, monospace"
              fill="#f5f5f4"
            >
              SCREED · FALL 1:80
            </text>
          </g>

          {/* ---------- Shade + shadow the bay throws once it exists ---------- */}
          <g className="spc-shadow" opacity="0">
            <rect
              x="200"
              y={SLAB_UNDERSIDE}
              width="400"
              height="64"
              fill="url(#spc-bay-shade)"
            />
            <ellipse cx="400" cy={BAY_FLOOR + 6} rx="196" ry="8" fill="#0f172a" opacity="0.5" />
          </g>

          {/* The two cars, rolling into the finished bay. Placed symmetrically
              about the centre line and offset from the column grid so no stilt
              lands dead-centre on a wheel hub — the columns still pass in front
              of the bodies, which is what a stilt bay looks like from the street. */}
          <g className="spc-bay-car" opacity="0">
            <CarBody x={216} floorY={BAY_FLOOR} body="#1e293b" cabin="#334155" />
          </g>
          <g className="spc-bay-car" opacity="0">
            <CarBody x={448} floorY={BAY_FLOOR} body="#0369a1" cabin="#0284c7" />
          </g>

          {/* ---------- Permanent RCC stilt columns ---------- */}
          <g className="spc-columns" opacity="0">
            {COLUMNS.map((x) => (
              <g key={`col-${x}`} className="spc-column">
                <rect
                  x={x - 15}
                  y={SLAB_UNDERSIDE}
                  width="30"
                  height={BAY_FLOOR - SLAB_UNDERSIDE}
                  rx="1.5"
                  fill="url(#spc-column-fill)"
                  stroke="#475569"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Rebar cage, read as ties through the pour */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1={x - 9}
                    y1={SLAB_UNDERSIDE + 18 + i * 30}
                    x2={x + 9}
                    y2={SLAB_UNDERSIDE + 18 + i * 30}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            ))}
          </g>

          {/* ---------- Column set-out marks ---------- */}
          <g className="spc-marks" opacity="0" stroke="#d97706" strokeWidth="2">
            {COLUMNS.map((x) => (
              <g key={`mark-${x}`}>
                <line x1={x - 11} y1={GROUND - 11} x2={x + 11} y2={GROUND + 11} />
                <line x1={x + 11} y1={GROUND - 11} x2={x - 11} y2={GROUND + 11} />
              </g>
            ))}
          </g>

          {/* ---------- Jack banks ---------- */}
          <g className="spc-jacks" opacity="0">
            {JACKS.map((x) => (
              <g key={`jack-${x}`}>
                <rect
                  className="spc-rod"
                  x={x - 8}
                  y={GROUND + 14}
                  width="16"
                  height={ROD_H}
                  fill="#0284c7"
                />
                <rect x={x - 17} y={GROUND + 36} width="34" height="26" rx="2" fill="#334155" />
                <rect x={x - 17} y={GROUND + 36} width="34" height="5" rx="2" fill="#475569" />
                <rect x={x - 24} y={GROUND + 62} width="48" height="7" rx="2" fill="#1e293b" />
              </g>
            ))}
          </g>

          {/* ---------- Needle beams (ride with the structure) ---------- */}
          <g className="spc-beams" opacity="0">
            <rect x="198" y={GROUND} width="404" height="14" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="198" y={GROUND} width="404" height="4" fill="#64748b" />
          </g>

          {/* ---------- The house ---------- */}
          <g className="spc-house">
            <rect x="498" y="112" width="22" height="42" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <path
              d="M196 182 L400 120 L604 182 Z"
              fill="#94a3b8"
              stroke="#334155"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <rect x="214" y="182" width="372" height="84" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
            <rect x="214" y="266" width="372" height="102" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
            <rect x="206" y="368" width="388" height="24" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />

            {/* Upper storey windows */}
            {[246, 340, 434, 528].map((x) => (
              <rect
                key={`up-${x}`}
                x={x}
                y="204"
                width="46"
                height="42"
                rx="1"
                fill="#bae6fd"
                stroke="#0369a1"
                strokeWidth="2"
              />
            ))}
            {/* Ground storey windows + the door that will need a stair */}
            {[246, 344, 442].map((x) => (
              <rect
                key={`low-${x}`}
                x={x}
                y="298"
                width="58"
                height="48"
                rx="1"
                fill="#bae6fd"
                stroke="#0369a1"
                strokeWidth="2"
              />
            ))}
            <rect x="508" y="304" width="54" height="64" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          </g>

          {/* ---------- New stair up to the raised front door ---------- */}
          <g className="spc-stair" opacity="0">
            {Array.from({ length: STAIR_TREADS }, (_, i) => {
              const height = STAIR_RISE - (i * STAIR_RISE) / STAIR_TREADS;
              return (
                <rect
                  key={i}
                  x={598 + i * 16}
                  y={GROUND - height}
                  width="16"
                  height={height}
                  fill="#cbd5e1"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
              );
            })}
          </g>

          {/* ---------- Dust kicked up by the lift ---------- */}
          <g className="spc-dust" fill="#d6d3d1" opacity="0">
            {[236, 320, 420, 500, 566].map((x, i) => (
              <circle key={x} cx={x} cy={GROUND - 6 - (i % 2) * 9} r={10 + (i % 3) * 4} />
            ))}
          </g>

          {/* ---------- Clearance dimension ---------- */}
          <g className="spc-dim" opacity="0">
            <g stroke="#d97706" strokeWidth="2.5" fill="none">
              <line x1="178" y1={SLAB_UNDERSIDE} x2="178" y2={BAY_FLOOR} />
              <path d={`M170 ${SLAB_UNDERSIDE + 9} L178 ${SLAB_UNDERSIDE} L186 ${SLAB_UNDERSIDE + 9}`} />
              <path d={`M170 ${BAY_FLOOR - 9} L178 ${BAY_FLOOR} L186 ${BAY_FLOOR - 9}`} />
            </g>
            <text
              x="166"
              y={SLAB_UNDERSIDE + (BAY_FLOOR - SLAB_UNDERSIDE) / 2 + 2}
              textAnchor="end"
              fontSize="18"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
              fill="#b45309"
            >
              8 ft
            </text>
            <text
              x="166"
              y={SLAB_UNDERSIDE + (BAY_FLOOR - SLAB_UNDERSIDE) / 2 + 20}
              textAnchor="end"
              fontSize="12"
              fontFamily="ui-monospace, monospace"
              fill="#78716c"
            >
              clearance
            </text>
          </g>

          {/* ---------- Outcome badge ---------- */}
          <g className="spc-badge" opacity="0">
            <rect x="336" y="36" width="306" height="38" rx="8" fill="#0f172a" opacity="0.88" />
            <text
              x="489"
              y="61"
              textAnchor="middle"
              fontSize="15"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
              fill="#fbbf24"
            >
              TWO-CAR COVERED BAY · 8 FT CLEAR
            </text>
          </g>

          {/* Loop cut */}
          <rect className="spc-veil" width={VIEW_W} height={VIEW_H} fill="#ffffff" />
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
