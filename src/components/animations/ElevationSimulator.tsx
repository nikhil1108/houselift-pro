"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUp, Droplets, Gauge, MoveVertical } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Total travel of the house in SVG/px units across the scroll. */
const LIFT_PX = 140;
/** Real-world lift the animation represents. */
const MAX_LIFT_FT = 6.5;

const PHASES = [
  { threshold: 0, label: "Jacks positioned", tone: "text-slate-400" },
  { threshold: 0.15, label: "Positioning mechanical jacks", tone: "text-sky-400" },
  { threshold: 0.45, label: "Structure in elevation", tone: "text-amber-400" },
  { threshold: 0.85, label: "Above flood level — secured", tone: "text-emerald-400" },
] as const;

function phaseFor(progress: number): (typeof PHASES)[number] {
  let current = PHASES[0];
  for (const phase of PHASES) {
    if (progress >= phase.threshold) current = phase;
  }
  return current;
}

export function ElevationSimulator(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [liftFt, setLiftFt] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // The tall container scrolls while the scene stays pinned.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Confine the active animation to the middle of the scroll range so the
  // scene is fully assembled before the lift begins.
  const raw = useTransform(scrollYProgress, [0.18, 0.82], [0, 1], {
    clamp: true,
  });
  const lift = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  const houseY = useTransform(lift, [0, 1], [0, -LIFT_PX]);
  const pillarHeight = useTransform(lift, [0, 1], [0, LIFT_PX]);
  const pillarY = useTransform(lift, [0, 1], [318, 318 - LIFT_PX]);
  // Piston tops out flush against the rising plinth beam.
  const pistonHeight = useTransform(lift, [0, 1], [12, LIFT_PX + 12]);
  const pistonY = useTransform(lift, [0, 1], [0, -LIFT_PX]);
  const dimLineHeight = useTransform(lift, [0, 1], [0, LIFT_PX]);
  const dimLineY = useTransform(lift, [0, 1], [320, 320 - LIFT_PX]);
  const waterOpacity = useTransform(lift, [0, 0.55], [1, 0.12]);
  const gaugeFill = useTransform(lift, [0, 1], ["0%", "100%"]);
  const hintOpacity = useTransform(lift, [0, 0.12], [1, 0]);
  const safeBadgeOpacity = useTransform(lift, [0.82, 0.95], [0, 1]);

  useMotionValueEvent(lift, "change", (latest: number) => {
    setProgress(latest);
    // One decimal only — avoids a render on every sub-pixel frame.
    setLiftFt(Math.round(latest * MAX_LIFT_FT * 10) / 10);
  });

  const phase = phaseFor(progress);

  return (
    <section id="simulator" className="relative bg-slate-950">
      {/* Scroll runway: 260vh gives the pinned scene room to play out. */}
      <div ref={containerRef} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="engineering-grid absolute inset-0 opacity-60" />
          <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-sky-600/10 blur-[120px]" />
          <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:px-8">
            {/* ---------------- Copy + live readouts ---------------- */}
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-amber-400">
                <MoveVertical className="h-3.5 w-3.5" />
                Live Elevation Simulator
              </span>

              <h2 className="mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                Scroll to lift the house
                <span className="block text-gradient-amber">
                  {MAX_LIFT_FT} ft above the flood line.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
                This is exactly how an RR AND SONS elevation works. Synchronised
                mechanical jacks raise the structure in 25&nbsp;mm increments while new
                RCC pillars are cast into the gap beneath it — permanently.
              </p>

              {/* Telemetry panel */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="glass-panel rounded-xl p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Elevation
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-amber-400">
                    {liftFt.toFixed(1)}
                    <span className="ml-0.5 text-sm text-amber-500/70">ft</span>
                  </p>
                </div>

                <div className="glass-panel rounded-xl p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Pressure
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-sky-400">
                    {Math.round(progress * 680)}
                    <span className="ml-0.5 text-sm text-sky-500/70">bar</span>
                  </p>
                </div>

                <div className="glass-panel rounded-xl p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Deviation
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                    ±1
                    <span className="ml-0.5 text-sm text-emerald-500/70">mm</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full bg-current animate-pulse-glow",
                    phase.tone,
                  )}
                />
                <span className={cn("font-mono text-xs uppercase tracking-wider", phase.tone)}>
                  {phase.label}
                </span>
              </div>

              <motion.p
                style={{ opacity: hintOpacity }}
                className="mt-6 flex items-center gap-2 text-xs text-slate-500"
              >
                <ArrowUp className="h-3.5 w-3.5 animate-bounce" />
                Keep scrolling — the structure rises with you
              </motion.p>
            </div>

            {/* ---------------- The scene ---------------- */}
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto w-full max-w-xl">
                <svg
                  viewBox="0 0 460 420"
                  role="img"
                  aria-label={`Cross-section of a house elevated ${liftFt.toFixed(1)} feet on mechanical jacks with new RCC pillars beneath it`}
                  className="w-full"
                >
                  <defs>
                    <linearGradient id="sim-roof" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                    <linearGradient id="sim-wall" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#243449" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    <linearGradient id="sim-pillar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94A3B8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="sim-water" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.15" />
                    </linearGradient>
                    <pattern
                      id="sim-soil"
                      width="12"
                      height="12"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" y2="12" stroke="#1E293B" strokeWidth="6" />
                    </pattern>
                  </defs>

                  {/* Soil mass */}
                  <rect x="0" y="352" width="460" height="68" fill="url(#sim-soil)" />
                  <rect x="0" y="352" width="460" height="68" fill="#020617" opacity="0.45" />
                  <line x1="0" y1="352" x2="460" y2="352" stroke="#334155" strokeWidth="2" />

                  {/* Waterlogging — recedes in significance as the house rises */}
                  <motion.g style={{ opacity: waterOpacity }}>
                    <rect x="0" y="318" width="460" height="34" fill="url(#sim-water)" />
                    <motion.path
                      d="M0 320 Q 38 313 76 320 T 152 320 T 228 320 T 304 320 T 380 320 T 460 320"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      fill="none"
                      animate={{ x: [0, -76, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.g>

                  {/* Road / flood datum */}
                  <g>
                    <line
                      x1="0"
                      y1="318"
                      x2="460"
                      y2="318"
                      stroke="#0EA5E9"
                      strokeWidth="1"
                      strokeDasharray="6 5"
                      opacity="0.7"
                    />
                    <text
                      x="8"
                      y="336"
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                      letterSpacing="1.4"
                    >
                      ROAD / FLOOD DATUM
                    </text>
                  </g>

                  {/* New RCC pillars grow into the void left by the lift */}
                  {[86, 170, 254, 338].map((x) => (
                    <motion.rect
                      key={`pillar-${x}`}
                      x={x}
                      width="26"
                      rx="2"
                      fill="url(#sim-pillar)"
                      style={{ height: pillarHeight, y: pillarY }}
                    />
                  ))}

                  {/* Mechanical jacks */}
                  {[128, 296].map((x) => (
                    <g key={`jack-${x}`}>
                      {/* Piston */}
                      <motion.rect
                        x={x + 7}
                        y={318}
                        width="12"
                        rx="2"
                        fill="#0284C7"
                        style={{ height: pistonHeight, y: pistonY }}
                      />
                      {/* Body */}
                      <rect x={x} y={318} width="26" height="34" rx="3" fill="#334155" />
                      <rect x={x} y={318} width="26" height="4" rx="2" fill="#475569" />
                      <motion.circle
                        cx={x + 13}
                        cy={335}
                        r="3"
                        fill="#F59E0B"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      {/* Base plate */}
                      <rect x={x - 5} y={348} width="36" height="6" rx="2" fill="#1E293B" />
                    </g>
                  ))}

                  {/* ---- The house ---- */}
                  <motion.g style={{ y: houseY }}>
                    {/* Plinth beam */}
                    <rect x="66" y="306" width="328" height="14" rx="2" fill="#475569" />
                    <rect x="66" y="306" width="328" height="4" rx="2" fill="#64748B" />

                    {/* Walls */}
                    <rect x="82" y="212" width="296" height="94" fill="url(#sim-wall)" />

                    {/* Roof */}
                    <path d="M64 214 L230 140 L396 214 Z" fill="url(#sim-roof)" />
                    <path d="M64 214 L230 140 L230 214 Z" fill="#FDE68A" opacity="0.18" />

                    {/* Openings */}
                    <rect x="108" y="234" width="46" height="40" rx="3" fill="#0EA5E9" opacity="0.7" />
                    <rect x="306" y="234" width="46" height="40" rx="3" fill="#0EA5E9" opacity="0.7" />
                    <rect x="208" y="242" width="44" height="64" rx="3" fill="#F59E0B" opacity="0.85" />
                    <line x1="131" y1="234" x2="131" y2="274" stroke="#0F172A" strokeWidth="2" />
                    <line x1="329" y1="234" x2="329" y2="274" stroke="#0F172A" strokeWidth="2" />

                    {/* Chimney */}
                    <rect x="330" y="162" width="22" height="40" rx="2" fill="#475569" />
                  </motion.g>

                  {/* Dimension bar measuring road datum → lifted plinth */}
                  <g opacity="0.95">
                    <motion.rect
                      x="423"
                      width="2"
                      fill="#F59E0B"
                      style={{ height: dimLineHeight, y: dimLineY }}
                    />
                    {/* Fixed tick on the datum */}
                    <line x1="417" y1="320" x2="431" y2="320" stroke="#F59E0B" strokeWidth="2" />
                    {/* Upper tick rides with the structure */}
                    <motion.line
                      x1="417"
                      y1="320"
                      x2="431"
                      y2="320"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      style={{ y: houseY }}
                    />
                  </g>
                </svg>

                {/* Vertical height gauge */}
                <div className="absolute -right-1 top-4 flex h-[62%] flex-col items-center gap-2 sm:right-2">
                  <div className="relative h-full w-2 overflow-hidden rounded-full bg-slate-800/80">
                    <motion.div
                      style={{ height: gaugeFill }}
                      className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300"
                    />
                  </div>
                  <Gauge className="h-4 w-4 text-amber-500" />
                </div>

                {/* Live readout chip */}
                <motion.div
                  className="absolute left-2 top-2 rounded-xl border border-amber-500/40 bg-slate-950/85 px-3.5 py-2 backdrop-blur-md sm:left-4"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
                    Height gauge
                  </p>
                  <p className="font-mono text-xl font-bold text-amber-400">
                    {liftFt.toFixed(1)} ft
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    above road level
                  </p>
                </motion.div>

                {/* Safety confirmation */}
                <motion.div
                  style={{ opacity: safeBadgeOpacity }}
                  className="absolute bottom-16 left-2 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 backdrop-blur-md sm:left-4"
                >
                  <Droplets className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                    Flood risk cleared
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
