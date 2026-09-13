"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, Cog } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { PROCESS_STEPS } from "@/components/data/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { ProcessStep } from "@/types";

/* ------------------------------------------------------------------ */
/* Blueprint — assembles itself phase by phase as steps scroll past    */
/* ------------------------------------------------------------------ */

const PHASE_LABELS: Record<number, string> = {
  1: "PHASE 01 · LASER AUDIT",
  2: "PHASE 02 · TRENCHING",
  3: "PHASE 03 · JACK SYNC",
  4: "PHASE 04 · ELEVATION",
  5: "PHASE 05 · RCC CASTING",
};

function Blueprint({ activeStep }: { activeStep: number }): JSX.Element {
  /** Full opacity while a phase is active, dim once it's behind us. */
  const layer = (step: number): number => {
    if (activeStep === step) return 1;
    return activeStep > step ? 0.4 : 0.12;
  };

  const lifted = activeStep >= 4;
  const cast = activeStep >= 5;

  return (
    <div className="glass-panel-bright relative aspect-square overflow-hidden rounded-2xl p-5 sm:p-7">
      <div className="engineering-grid-dense absolute inset-0 opacity-70" />

      {/* Active phase readout */}
      <div className="relative mb-3 flex items-center justify-between">
        <motion.span
          key={activeStep}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400"
        >
          {PHASE_LABELS[activeStep] ?? PHASE_LABELS[1]}
        </motion.span>
        <span className="font-mono text-[10px] text-slate-500">
          {activeStep}/5
        </span>
      </div>

      <svg
        viewBox="0 0 340 300"
        role="img"
        aria-label={`Technical blueprint, phase ${activeStep} of 5`}
        className="relative w-full"
      >
        <defs>
          <linearGradient id="bp-pillar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="bp-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Datum */}
        <line x1="0" y1="228" x2="340" y2="228" stroke="#475569" strokeWidth="1.5" />
        <text x="4" y="242" fill="#475569" fontSize="8" fontFamily="monospace">
          GROUND DATUM
        </text>

        {/* ---- Phase 1: laser audit ---- */}
        <motion.g animate={{ opacity: layer(1) }} transition={{ duration: 0.45 }}>
          <circle cx="42" cy="86" r="14" fill="#0284C7" opacity="0.2" />
          <circle cx="42" cy="86" r="5" fill="#0EA5E9" />
          <line x1="42" y1="91" x2="42" y2="224" stroke="#0EA5E9" strokeWidth="1" />
          {[110, 170, 230].map((x) => (
            <line
              key={`beam-${x}`}
              x1="46"
              y1="88"
              x2={x}
              y2="150"
              stroke="#0EA5E9"
              strokeWidth="0.8"
              strokeDasharray="3 4"
            />
          ))}
          <text x="60" y="80" fill="#38BDF8" fontSize="8" fontFamily="monospace">
            TOTAL STATION
          </text>
        </motion.g>

        {/* ---- Phase 2: trenching ---- */}
        <motion.g animate={{ opacity: layer(2) }} transition={{ duration: 0.45 }}>
          {[92, 148, 204, 260].map((x) => (
            <g key={`trench-${x}`}>
              <rect
                x={x - 11}
                y="228"
                width="22"
                height="26"
                fill="#020617"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
            </g>
          ))}
          <text x="264" y="250" fill="#F59E0B" fontSize="8" fontFamily="monospace">
            EXCAVATE
          </text>
        </motion.g>

        {/* ---- Phase 3: jack synchronisation ---- */}
        <motion.g animate={{ opacity: layer(3) }} transition={{ duration: 0.45 }}>
          {[120, 232].map((x) => (
            <g key={`jack-${x}`}>
              <rect x={x - 12} y="206" width="24" height="22" rx="2" fill="#334155" />
              <rect x={x - 5} y="196" width="10" height="12" rx="1" fill="#0284C7" />
              <rect x={x - 17} y="226" width="34" height="5" rx="1.5" fill="#1E293B" />
              <motion.circle
                cx={x}
                cy="217"
                r="2.6"
                fill="#F59E0B"
                animate={
                  activeStep === 3 ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.6 }
                }
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            </g>
          ))}
          {/* Sync bus line */}
          <line
            x1="120"
            y1="238"
            x2="232"
            y2="238"
            stroke="#F59E0B"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <text x="126" y="252" fill="#F59E0B" fontSize="8" fontFamily="monospace">
            ±2mm SYNC BUS
          </text>
        </motion.g>

        {/* ---- Phase 5 (drawn under the house): new RCC pillars ---- */}
        <motion.g animate={{ opacity: cast ? 1 : 0 }} transition={{ duration: 0.5 }}>
          {[92, 148, 204, 260].map((x) => (
            <motion.rect
              key={`pillar-${x}`}
              x={x - 9}
              width="18"
              rx="1.5"
              fill="url(#bp-pillar)"
              animate={{ height: cast ? 46 : 0, y: cast ? 182 : 228 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </motion.g>

        {/* ---- Phase 4: the structure lifts ---- */}
        <motion.g
          animate={{ y: lifted ? -46 : 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="74" y="216" width="196" height="12" rx="2" fill="#475569" />
          <rect x="86" y="152" width="172" height="64" fill="#1E293B" />
          <path d="M68 154 L172 104 L276 154 Z" fill="url(#bp-roof)" />
          <rect x="108" y="170" width="30" height="26" rx="2" fill="#0EA5E9" opacity="0.6" />
          <rect x="206" y="170" width="30" height="26" rx="2" fill="#0EA5E9" opacity="0.6" />
          <rect x="158" y="176" width="26" height="40" rx="2" fill="#F59E0B" opacity="0.8" />
        </motion.g>

        {/* Lift dimension callout */}
        <motion.g animate={{ opacity: lifted ? 1 : 0 }} transition={{ duration: 0.5 }}>
          <line
            x1="296"
            y1="228"
            x2="296"
            y2="182"
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <path d="M296 228 l-3 -5 h6 z" fill="#F59E0B" />
          <path d="M296 182 l-3 5 h6 z" fill="#F59E0B" />
          <text x="302" y="208" fill="#F59E0B" fontSize="8" fontFamily="monospace">
            LIFT
          </text>
        </motion.g>
      </svg>

      {/* Phase pips */}
      <div className="relative mt-3 flex items-center gap-1.5">
        {PROCESS_STEPS.map((step) => (
          <span
            key={step.id}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-500",
              activeStep >= step.id ? "bg-amber-500" : "bg-slate-800",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step card — reports itself active when centred in the viewport      */
/* ------------------------------------------------------------------ */

interface StepCardProps {
  step: ProcessStep;
  isActive: boolean;
  onActivate: (id: number) => void;
}

function StepCard({ step, isActive, onActivate }: StepCardProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActivate(step.id);
  }, [inView, onActivate, step.id]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Timeline node */}
      <span
        className={cn(
          "absolute -left-[3.1rem] top-7 hidden h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 lg:block",
          isActive
            ? "scale-125 border-amber-400 bg-amber-500 shadow-amber"
            : "border-slate-700 bg-slate-950",
        )}
      />

      <div
        className={cn(
          "rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500 sm:p-7",
          isActive
            ? "border-amber-500/45 bg-slate-900/80 shadow-panel"
            : "border-slate-800/60 bg-slate-900/45",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors",
                isActive
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                  : "border-slate-700/70 bg-slate-800/50 text-slate-400",
              )}
            >
              {step.badge}
            </span>
            <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight text-white sm:text-[1.4rem]">
              {step.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-sky-400">
              {step.subtitle}
            </p>
          </div>

          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition-colors",
              isActive
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-800 text-slate-400",
            )}
          >
            {step.id}
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
          {step.description}
        </p>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-slate-700/50 bg-slate-950/60 p-4">
          <Cog className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400" />
          <p className="font-mono text-[11px] leading-relaxed text-slate-400">
            {step.technicalDetail}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */

export function ProcessTimeline(): JSX.Element {
  const streamRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const { scrollYProgress } = useScroll({
    target: streamRef,
    offset: ["start center", "end center"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.3,
  });
  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const handleActivate = useCallback((id: number): void => {
    setActiveStep(id);
  }, []);

  return (
    <section id="process" className="relative bg-slate-950 py-20 lg:py-28">
      <div className="engineering-grid absolute inset-0 opacity-50" />
      <div className="absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Engineering Workflow"
          title="Five phases from laser audit to final handover"
          description="Every RR AND SONS project follows this sequence. Scroll through the phases — the blueprint on the left builds itself as you go."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Sticky pinned visual */}
          <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
            <Blueprint activeStep={activeStep} />
          </div>

          {/* Scroll stream */}
          <div ref={streamRef} className="relative">
            {/* Glowing amber progress rail */}
            <div className="absolute left-0 top-6 hidden h-[calc(100%-3rem)] w-px bg-slate-800 lg:block">
              <motion.div
                style={{ height: progressHeight }}
                className="w-full rounded-full bg-gradient-to-b from-amber-500 via-amber-400 to-sky-500 shadow-amber"
              />
            </div>

            <div className="space-y-6 lg:pl-14">
              {PROCESS_STEPS.map((step) => (
                <StepCard
                  key={step.id}
                  step={step}
                  isActive={activeStep === step.id}
                  onActivate={handleActivate}
                />
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-300 sm:text-[13px]">
                  Handover complete
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
