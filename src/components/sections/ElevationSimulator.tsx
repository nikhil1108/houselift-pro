"use client";

import { ArrowUpFromLine, Gauge, Ruler, Waves } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollScene } from "@/hooks/useScrollScene";

/**
 * Quantisation of the scroll travel. The gauge needs a real number in JS, but a
 * re-render per frame would be indefensible — so progress is rounded into 30
 * steps, giving exactly one decimal place of feet (6.0 / 30 = 0.2) and a
 * bounded 31 renders across the whole section.
 */
const STEPS = 30;
const MAX_LIFT_FT = 6;

/** Drawing datum. The 120px CSS travel and this LIFT value must agree. */
const GROUND = 380;
const LIFT = 120;

const PHASES: ReadonlyArray<{ upTo: number; label: string; detail: string }> = [
  { upTo: 0.08, label: "Standby", detail: "Jacks seated, pressure at zero." },
  {
    upTo: 0.3,
    label: "Load transfer",
    detail: "Structure weight moving onto the steel spreader beams.",
  },
  {
    upTo: 0.82,
    label: "Synchronised lift",
    detail: "Rising in 25 mm passes, all 54 jacks held inside ±2 mm.",
  },
  {
    upTo: 1.01,
    label: "Hold & cast",
    detail: "Height reached. New RCC columns poured into the open void.",
  },
];

function resolvePhase(progress: number): { label: string; detail: string } {
  const match = PHASES.find((entry) => progress < entry.upTo);
  return match ?? { label: "Hold & cast", detail: "Height reached." };
}

const JACK_X: readonly number[] = [172, 268, 452, 548];
const PILLAR_X: readonly number[] = [220, 360, 500];

function LiftDiagram(): JSX.Element {
  return (
    <svg
      viewBox="0 0 720 520"
      className="h-auto w-full"
      role="img"
      aria-label="Cross-section of a two-storey house raised six feet on mechanical jacks while new concrete pillars are cast beneath it"
    >
      <defs>
        <linearGradient id="sim-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <pattern
          id="sim-hatch"
          width="8"
          height="8"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="2" />
        </pattern>
      </defs>

      <rect width="720" height="520" fill="url(#sim-sky)" />

      {/* Drafting datum lines behind the section. */}
      <g stroke="#e2e8f0" strokeWidth="1">
        {[60, 120, 180, 240, 300, 440, 500].map((y) => (
          <line key={y} x1="0" y1={y} x2="720" y2={y} />
        ))}
      </g>

      {/* Standing floodwater at the old grade, fading out as the lift proceeds. */}
      <g className="sim-out">
        <rect x="0" y={GROUND - 34} width="720" height="34" fill="#38bdf8" opacity="0.28" />
        <line
          x1="0"
          y1={GROUND - 34}
          x2="720"
          y2={GROUND - 34}
          stroke="#0284c7"
          strokeWidth="2"
          strokeDasharray="10 8"
        />
        <text
          x="18"
          y={GROUND - 44}
          fontSize="14"
          fontFamily="ui-monospace, monospace"
          fill="#0369a1"
        >
          2018 flood level
        </text>
      </g>

      {/* New RCC pillars, growing into the void the lift opens. */}
      {PILLAR_X.map((x) => (
        <g key={`pillar-${x}`}>
          <rect
            x={x - 17}
            y={GROUND - LIFT}
            width="34"
            height={LIFT}
            className="sim-grow"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <rect
            x={x - 17}
            y={GROUND - LIFT}
            width="34"
            height={LIFT}
            className="sim-grow"
            fill="url(#sim-hatch)"
            opacity="0.7"
          />
        </g>
      ))}

      {/* Jacks: cylinder bedded at grade, rod extending under the plinth. */}
      {JACK_X.map((x) => (
        <g key={`jack-${x}`}>
          <rect
            x={x - 9}
            y={GROUND - LIFT}
            width="18"
            height={LIFT}
            className="sim-rod"
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="2"
          />
          <rect x={x - 18} y={GROUND - 30} width="36" height="30" fill="#475569" rx="3" />
          <rect x={x - 24} y={GROUND - 8} width="48" height="8" fill="#334155" rx="2" />
          {/* Feed line — amber reads as live plant. */}
          <path
            d={`M${x + 18} ${GROUND - 18} q 26 0 26 18`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* The structure. One group, one transform. */}
      <g className="sim-lift">
        <rect
          x="140"
          y={GROUND - 22}
          width="440"
          height="22"
          fill="#94a3b8"
          stroke="#475569"
          strokeWidth="2"
        />

        <rect
          x="156"
          y={GROUND - 194}
          width="408"
          height="172"
          fill="#ffffff"
          stroke="#475569"
          strokeWidth="2.5"
        />
        <line
          x1="156"
          y1={GROUND - 108}
          x2="564"
          y2={GROUND - 108}
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {[0, 1, 2].map((i) => (
          <g key={`win-${i}`}>
            <rect
              x={190 + i * 128}
              y={GROUND - 176}
              width="72"
              height="50"
              fill="#e0f2fe"
              stroke="#bae6fd"
              strokeWidth="2"
            />
            <rect
              x={190 + i * 128}
              y={GROUND - 90}
              width="72"
              height="50"
              fill="#e0f2fe"
              stroke="#bae6fd"
              strokeWidth="2"
            />
          </g>
        ))}

        <rect
          x="336"
          y={GROUND - 70}
          width="48"
          height="48"
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="2"
        />

        <path
          d={`M140 ${GROUND - 194} L360 ${GROUND - 250} L580 ${GROUND - 194} Z`}
          fill="#f1f5f9"
          stroke="#475569"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Grade, drawn over the pillar feet so the datum stays legible. */}
      <rect x="0" y={GROUND} width="720" height={520 - GROUND} fill="#e2e8f0" />
      <line x1="0" y1={GROUND} x2="720" y2={GROUND} stroke="#475569" strokeWidth="3" />
      <text
        x="18"
        y={GROUND + 26}
        fontSize="14"
        fontFamily="ui-monospace, monospace"
        fill="#64748b"
      >
        ROAD LEVEL · DATUM 0.00
      </text>

      {/* Dimension tick: dashed target, solid amber once achieved. */}
      <line
        x1="632"
        y1={GROUND}
        x2="632"
        y2={GROUND - LIFT}
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      <g className="sim-in" stroke="#d97706" strokeWidth="3">
        <line x1="632" y1={GROUND} x2="632" y2={GROUND - LIFT} />
        <line x1="622" y1={GROUND} x2="642" y2={GROUND} />
        <line x1="622" y1={GROUND - LIFT} x2="642" y2={GROUND - LIFT} />
      </g>
    </svg>
  );
}

export function ElevationSimulator(): JSX.Element {
  // Mapped into the middle half of the section's travel, so the pose completes
  // while the section is comfortably in view rather than as it leaves.
  const { ref, step } = useScrollScene<HTMLElement>({
    steps: STEPS,
    start: 0.25,
    end: 0.75,
  });

  const progress = step / STEPS;
  const feet = (progress * MAX_LIFT_FT).toFixed(1);
  const phase = resolvePhase(progress);
  const pressureBar = Math.round(progress * 640);
  const jacksEngaged = progress > 0.05 ? 54 : 0;

  return (
    <section
      ref={ref}
      id="simulator"
      className="relative overflow-hidden border-b border-slate-200 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Scroll-linked simulator"
            description="Scroll through this section to drive the lift. The jacks extend, the new pillars are cast into the void that opens beneath, and the readout tracks height above road level as it happens."
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-canvas p-3 shadow-panel sm:p-5">
              <LiftDiagram />
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-xl border border-slate-200/80 bg-ink p-6 text-slate-300 shadow-lg sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
                  <Gauge className="h-3.5 w-3.5" />
                  Live elevation
                </p>
                <Badge variant="solid" size="sm" className="bg-white/10 text-slate-200">
                  {phase.label}
                </Badge>
              </div>

              <p className="nums mt-6 font-mono text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl">
                {feet}
                <span className="ml-2 text-xl font-semibold text-amber-500">ft</span>
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
                Above road level
              </p>

              {/* Gauge track — scaled on the compositor, never re-laid-out. */}
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="sim-gauge h-full w-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400" />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-500">
                <span>0.0 ft</span>
                <span>{MAX_LIFT_FT.toFixed(1)} ft target</span>
              </div>

              <p className="mt-6 min-h-[3rem] text-sm leading-relaxed text-slate-400">
                {phase.detail}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10">
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <ArrowUpFromLine className="h-3 w-3" />
                    Jacks engaged
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-lg font-bold text-white">
                    {jacksEngaged}
                  </dd>
                </div>
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <Gauge className="h-3 w-3" />
                    Line pressure
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-lg font-bold text-white">
                    {pressureBar}
                    <span className="ml-1 text-xs font-normal text-slate-500">bar</span>
                  </dd>
                </div>
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <Ruler className="h-3 w-3" />
                    Deviation
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-lg font-bold text-white">
                    ±2<span className="ml-1 text-xs font-normal text-slate-500">mm</span>
                  </dd>
                </div>
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <Waves className="h-3 w-3" />
                    Flood clearance
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-lg font-bold text-white">
                    {progress > 0.55 ? "Clear" : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
