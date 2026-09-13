"use client";

import { GripVertical, Pause, Play } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { clamp } from "@/lib/utils";

/**
 * Draggable split-view comparison that plays itself.
 *
 * The wipe sweeps automatically on a sine loop, so the section reads as a short
 * looping clip rather than a still that only rewards people who happen to try
 * dragging it. Anyone who touches the handle takes over permanently; hovering
 * only pauses, because pausing on hover is what lets you actually inspect a
 * frame before you commit to dragging.
 *
 * Uses Pointer Events so mouse, touch and pen all travel one code path, and
 * `setPointerCapture` so a drag that leaves the element still tracks — the
 * usual failure mode of these sliders is the handle sticking when the cursor
 * moves faster than the pointer-move events.
 *
 * The reveal is a CSS `clip-path` inset. Clipping doesn't affect layout, so
 * neither the drag nor the auto-sweep triggers reflow, and the two scenes stay
 * perfectly registered because both are absolutely positioned in the same box
 * rather than sized independently.
 */

const HOUSE_W = 800;
const HOUSE_H = 500;

/** One full there-and-back sweep, in ms. Slow enough to read, not to nag. */
const SWEEP_PERIOD_MS = 11000;
/** How far either side of centre the sweep travels, in percent. */
const SWEEP_AMPLITUDE = 42;

/* ------------------------------------------------------------------ */
/* Scene geometry helpers                                              */
/* ------------------------------------------------------------------ */

/** Height of one rain tile. Two copies stack to cover the frame seamlessly. */
const RAIN_TILE = 560;

const RAIN_DROPS: ReadonlyArray<{ x: number; y: number }> = Array.from(
  { length: 34 },
  (_, i) => ({ x: (i * 137) % HOUSE_W, y: (i * 71) % RAIN_TILE }),
);

/** Full wavelength of the flood surface — must match the `water-drift` shift. */
const WAVE_PERIOD = 220;

/**
 * Scalloped water line drawn a wavelength wide on each side of the frame, so
 * the drift never exposes an unpainted edge.
 */
function wavePath(y: number): string {
  const start = -WAVE_PERIOD;
  const end = HOUSE_W + WAVE_PERIOD;
  const arc = WAVE_PERIOD / 2;

  let d = `M${start} ${y}`;
  let index = 0;

  for (let x = start; x < end; x += arc) {
    const control = y + (index % 2 === 0 ? -9 : 9);
    d += ` Q ${x + arc / 2} ${control} ${x + arc} ${y}`;
    index += 1;
  }

  return d;
}

/* ------------------------------------------------------------------ */
/* Scenes — memoised so the 60fps sweep never re-renders the artwork   */
/* ------------------------------------------------------------------ */

/** Sunk below road level, monsoon water standing against the walls. */
const FloodedScene = memo(function FloodedScene(): JSX.Element {
  const ground = 372;

  return (
    <svg
      viewBox={`0 0 ${HOUSE_W} ${HOUSE_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="ba-sky-before" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect width={HOUSE_W} height={HOUSE_H} fill="url(#ba-sky-before)" />

      {/* Falling rain */}
      <g
        stroke="#7dd3fc"
        strokeWidth="2"
        opacity="0.45"
        className="motion-safe:animate-rain-fall"
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

      {/* Raised carriageway the plot now sits below */}
      <rect x="0" y={ground - 56} width="150" height="56" fill="#78716c" />
      <rect x="0" y={ground - 62} width="150" height="8" fill="#57534e" />
      <text x="16" y={ground - 74} fontSize="15" fontFamily="ui-monospace, monospace" fill="#44403c">
        ROAD LEVEL
      </text>

      <rect x="0" y={ground} width={HOUSE_W} height={HOUSE_H - ground} fill="#a8a29e" />

      {/* House, plinth submerged */}
      <rect x="230" y={ground - 176} width="330" height="176" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
      <path d="M214 296 L395 216 L576 296 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
      <rect x="266" y={ground - 140} width="66" height="54" fill="#94a3b8" stroke="#0369a1" strokeWidth="2" />
      <rect x="458" y={ground - 140} width="66" height="54" fill="#94a3b8" stroke="#0369a1" strokeWidth="2" />
      <rect x="366" y={ground - 76} width="58" height="76" fill="#78350f" opacity="0.7" />

      {/* Damp staining up the walls */}
      <rect x="230" y={ground - 62} width="330" height="62" fill="#78716c" opacity="0.32" />

      {/* Standing water. The body is drawn 10 units deeper than the visible
          line so the swell never lifts it clear of the ground. */}
      <g className="motion-safe:animate-water-swell">
        <rect x="0" y={ground - 48} width={HOUSE_W} height="58" fill="#38bdf8" opacity="0.5" />
        <g className="motion-safe:animate-water-drift">
          <path d={wavePath(ground - 48)} fill="none" stroke="#0284c7" strokeWidth="3" />
        </g>
      </g>

      <text x="600" y={ground - 62} fontSize="15" fontFamily="ui-monospace, monospace" fontWeight="600" fill="#0369a1">
        +1.4 m WATER
      </text>
    </svg>
  );
});

/** Raised clear of the carriageway, re-plinthed and finished. */
const RaisedScene = memo(function RaisedScene(): JSX.Element {
  const ground = 372;
  const lift = 96;

  return (
    <svg
      viewBox={`0 0 ${HOUSE_W} ${HOUSE_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="ba-sky-after" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
      <rect width={HOUSE_W} height={HOUSE_H} fill="url(#ba-sky-after)" />

      {/* Drifting cloud bank — the only motion in the "after" scene, because
          the whole point of this half is that nothing is happening any more. */}
      <g fill="#ffffff" opacity="0.85">
        <g className="motion-safe:animate-cloud-drift">
          <ellipse cx="0" cy="84" rx="52" ry="19" />
          <ellipse cx="36" cy="76" rx="38" ry="23" />
          <ellipse cx="-32" cy="90" rx="32" ry="15" />
        </g>
        <g
          className="motion-safe:animate-cloud-drift"
          style={{ animationDelay: "-23s" }}
          opacity="0.7"
        >
          <ellipse cx="0" cy="146" rx="38" ry="14" />
          <ellipse cx="28" cy="140" rx="27" ry="17" />
        </g>
      </g>

      <rect x="0" y={ground - 56} width="150" height="56" fill="#78716c" />
      <rect x="0" y={ground - 62} width="150" height="8" fill="#57534e" />
      <text x="16" y={ground - 74} fontSize="15" fontFamily="ui-monospace, monospace" fill="#44403c">
        ROAD LEVEL
      </text>

      <rect x="0" y={ground} width={HOUSE_W} height={HOUSE_H - ground} fill="#a8a29e" />

      {/* New plinth, above the old flood line */}
      <rect x="230" y={ground - lift} width="330" height={lift} fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={i}
          x1={230 + i * 48}
          y1={ground}
          x2={230 + i * 48 + 32}
          y2={ground - lift}
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
      ))}
      <rect x="214" y={ground - lift - 18} width="362" height="18" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />

      {/* Steps up to the new level */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={572 + i * 22}
          y={ground - 26 - i * 26}
          width="26"
          height={26 + i * 26}
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="2"
        />
      ))}

      <g transform={`translate(0 ${-lift - 18})`}>
        <rect x="230" y={ground - 176} width="330" height="176" fill="#ffffff" stroke="#334155" strokeWidth="3" />
        <path d="M214 296 L395 216 L576 296 Z" fill="#e2e8f0" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
        <rect x="266" y={ground - 140} width="66" height="54" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
        <rect x="458" y={ground - 140} width="66" height="54" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
        <rect x="366" y={ground - 76} width="58" height="76" fill="#d97706" stroke="#78350f" strokeWidth="2" />
      </g>

      {/* Old flood line, now safely below the plinth */}
      <line x1="0" y1={ground - 48} x2={HOUSE_W} y2={ground - 48} stroke="#0284c7" strokeWidth="2.5" strokeDasharray="11 7" />
      <text x="600" y={ground - 58} fontSize="14" fontFamily="ui-monospace, monospace" fill="#0369a1">
        OLD FLOOD LINE
      </text>

      {/* Lift dimension */}
      <g stroke="#0284c7" strokeWidth="2.5" fill="none">
        <line x1="180" y1={ground - lift - 18} x2="180" y2={ground} />
        <path d={`M172 ${ground - lift - 9} L180 ${ground - lift - 18} L188 ${ground - lift - 9}`} />
        <path d={`M172 ${ground - 9} L180 ${ground} L188 ${ground - 9}`} />
      </g>
      <text
        x="168"
        y={ground - lift / 2}
        textAnchor="end"
        fontSize="17"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        fill="#0369a1"
      >
        6 ft
      </text>
    </svg>
  );
});

/* ------------------------------------------------------------------ */
/* Slider                                                              */
/* ------------------------------------------------------------------ */

export function BeforeAfterSlider(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<number>(50);
  const [dragging, setDragging] = useState<boolean>(false);

  /** User-facing play state. Cleared for good the moment someone drags. */
  const [playing, setPlaying] = useState<boolean>(true);
  const [hovered, setHovered] = useState<boolean>(false);
  const [inView, setInView] = useState<boolean>(false);
  const [reduced, setReduced] = useState<boolean>(false);

  /** Elapsed ms within the sweep cycle, preserved across pauses. */
  const phaseRef = useRef<number>(0);
  /** Mirrors `position` so callbacks can read it without re-subscribing. */
  const positionRef = useRef<number>(50);

  const applyPosition = useCallback((next: number): void => {
    positionRef.current = next;
    setPosition(next);
  }, []);

  const updateFromClientX = useCallback(
    (clientX: number): void => {
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      if (rect.width === 0) return;

      applyPosition(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
    },
    [applyPosition],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      // Capture so the drag keeps tracking even if the pointer outruns the
      // element bounds.
      event.currentTarget.setPointerCapture(event.pointerId);
      setPlaying(false);
      setDragging(true);
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (!dragging) return;
      updateFromClientX(event.clientX);
    },
    [dragging, updateFromClientX],
  );

  const stopDragging = useCallback((): void => setDragging(false), []);

  // Keyboard control on the handle, so the comparison isn't mouse-only.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      const step = event.shiftKey ? 10 : 2;
      const nudge = (delta: number): void => {
        event.preventDefault();
        setPlaying(false);
        applyPosition(clamp(positionRef.current + delta, 0, 100));
      };

      if (event.key === "ArrowLeft") {
        nudge(-step);
      } else if (event.key === "ArrowRight") {
        nudge(step);
      } else if (event.key === "Home") {
        event.preventDefault();
        setPlaying(false);
        applyPosition(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setPlaying(false);
        applyPosition(100);
      }
    },
    [applyPosition],
  );

  const togglePlaying = useCallback((): void => {
    setPlaying((current) => {
      if (current) return false;

      // Re-seed the cycle from wherever the handle was left, so pressing play
      // resumes from this frame instead of snapping the scene sideways.
      const ratio = clamp((50 - positionRef.current) / SWEEP_AMPLITUDE, -1, 1);
      const seeded = (Math.asin(ratio) / (Math.PI * 2)) * SWEEP_PERIOD_MS;
      phaseRef.current = ((seeded % SWEEP_PERIOD_MS) + SWEEP_PERIOD_MS) % SWEEP_PERIOD_MS;

      return true;
    });
  }, []);

  // Release the drag if the pointer is lifted anywhere on the page.
  useEffect(() => {
    if (!dragging) return;

    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [dragging, stopDragging]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = (): void => setReduced(mq.matches);

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Only sweep while the thing is actually on screen.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The sweep itself. A sine ease means the reversal at each end is smooth
  // rather than a hard bounce.
  useEffect(() => {
    if (!playing || !inView || reduced || dragging || hovered) return;

    let frame = 0;
    let last: number | null = null;

    const tick = (timestamp: number): void => {
      if (last !== null) {
        phaseRef.current = (phaseRef.current + (timestamp - last)) % SWEEP_PERIOD_MS;
      }
      last = timestamp;

      const angle = (phaseRef.current / SWEEP_PERIOD_MS) * Math.PI * 2;
      applyPosition(50 - SWEEP_AMPLITUDE * Math.sin(angle));

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, inView, reduced, dragging, hovered, applyPosition]);

  const sweeping = playing && !reduced;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-lg"
      style={{ cursor: dragging ? "grabbing" : "ew-resize" }}
    >
      {/* After — the base layer, fully painted */}
      <div className="absolute inset-0">
        <RaisedScene />
      </div>

      {/* Before — clipped to the handle position. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <FloodedScene />
      </div>

      {/* Corner labels */}
      <span className="pointer-events-none absolute left-4 top-4 rounded bg-red-600/95 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-md">
        Before · Flooded
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded bg-emerald-600/95 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-md">
        After · Raised 6 ft
      </span>

      {/* Transport control. Stops the pointer here from starting a drag. */}
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={togglePlaying}
        aria-label={sweeping ? "Pause the comparison" : "Play the comparison"}
        className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-slate-950/80 py-1.5 pl-2.5 pr-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white shadow-md backdrop-blur-sm transition-colors hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      >
        {sweeping ? (
          <Pause className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Play className="h-3.5 w-3.5 fill-current" />
        )}
        {sweeping ? "Pause" : "Play"}
      </button>

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Reveal the before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% showing the flooded original`}
        onKeyDown={handleKeyDown}
        className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.15)] focus-visible:outline-none"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-amber-600 text-white shadow-xl transition-transform hover:scale-105">
          <GripVertical className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
