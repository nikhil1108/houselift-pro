"use client";

import { motion } from "framer-motion";
import { Calculator, Clock, TrendingUp, Wrench } from "lucide-react";
import { useState } from "react";

import { STRUCTURE_OPTIONS } from "@/components/data/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { calculateEstimate, cn, formatINRCompact, formatNumber } from "@/lib/utils";
import type { CalculatorState } from "@/types";

export function CostCalculator(): JSX.Element {
  const [state, setState] = useState<CalculatorState>({
    areaSqFt: 2000,
    liftHeightFt: 6,
    floors: 2,
    structureType: "residential",
  });

  const result = calculateEstimate(state);

  const updateField = <K extends keyof CalculatorState>(
    key: K,
    value: CalculatorState[K],
  ): void => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section id="calculator" className="relative bg-slate-900 py-20 lg:py-28">
      <div className="engineering-grid-dense absolute inset-0 opacity-40" />
      <div className="absolute left-1/2 top-0 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Instant Cost Estimator"
          title="Calculate your house lifting cost in real-time"
          description="Adjust the sliders below for an accurate project estimate. Our algorithm factors in built-up area, lift height, storey count, and structure complexity."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-panel-bright space-y-8 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <Calculator className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Project Parameters</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Configure your structure details below
                </p>
              </div>
            </div>

            {/* Area slider */}
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <label htmlFor="area" className="text-sm font-medium text-slate-300">
                  Built-up Area
                </label>
                <span className="font-mono text-lg font-bold text-amber-400">
                  {formatNumber(state.areaSqFt)}
                  <span className="ml-1 text-xs text-slate-500">sq ft</span>
                </span>
              </div>
              <input
                id="area"
                type="range"
                min="500"
                max="5000"
                step="100"
                value={state.areaSqFt}
                onChange={(e) => updateField("areaSqFt", Number(e.target.value))}
                className="slider-amber w-full"
              />
              <div className="mt-1.5 flex justify-between text-[10px] font-mono text-slate-500">
                <span>500</span>
                <span>5,000 sq ft</span>
              </div>
            </div>

            {/* Lift height slider */}
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <label htmlFor="lift" className="text-sm font-medium text-slate-300">
                  Desired Lift Height
                </label>
                <span className="font-mono text-lg font-bold text-sky-400">
                  {state.liftHeightFt}
                  <span className="ml-1 text-xs text-slate-500">ft</span>
                </span>
              </div>
              <input
                id="lift"
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={state.liftHeightFt}
                onChange={(e) => updateField("liftHeightFt", Number(e.target.value))}
                className="slider-sky w-full"
              />
              <div className="mt-1.5 flex justify-between text-[10px] font-mono text-slate-500">
                <span>2 ft</span>
                <span>10 ft</span>
              </div>
            </div>

            {/* Floor selector */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Number of Floors
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([1, 2, 3] as const).map((floors) => (
                  <button
                    key={floors}
                    type="button"
                    onClick={() => updateField("floors", floors)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-center font-mono text-sm font-semibold transition-all",
                      state.floors === floors
                        ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-amber"
                        : "border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600",
                    )}
                  >
                    {floors === 3 ? "3+" : floors}
                  </button>
                ))}
              </div>
            </div>

            {/* Structure type */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Structure Type
              </label>
              <div className="space-y-2">
                {STRUCTURE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("structureType", option.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                      state.structureType === option.value
                        ? "border-amber-500/60 bg-amber-500/10 shadow-amber"
                        : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600",
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          state.structureType === option.value
                            ? "text-amber-300"
                            : "text-slate-300",
                        )}
                      >
                        {option.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{option.hint}</p>
                    </div>
                    {state.structureType === option.value ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950">
                        <span className="text-xs font-bold">✓</span>
                      </span>
                    ) : (
                      <span className="h-5 w-5 rounded-full border border-slate-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {/* Estimated cost */}
            <div className="glass-panel-bright rounded-2xl p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Estimated Project Cost
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <AnimatedNumber
                  value={result.estimatedCostMin}
                  format={(v) => formatINRCompact(v)}
                  className="text-3xl font-bold text-white sm:text-4xl"
                />
                <span className="text-lg text-slate-500">–</span>
                <AnimatedNumber
                  value={result.estimatedCostMax}
                  format={(v) => formatINRCompact(v)}
                  className="text-3xl font-bold text-white sm:text-4xl"
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Includes materials, labor, mechanical jack equipment, engineer supervision, and
                10-year warranty. Final price confirmed after site survey.
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel rounded-xl p-5">
                <div className="flex items-center gap-2 text-sky-400">
                  <Wrench className="h-4 w-4" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em]">
                    Jacks Required
                  </p>
                </div>
                <p className="mt-2 font-mono text-2xl font-bold text-white">
                  <AnimatedNumber value={result.jacksRequired} />
                  <span className="ml-1 text-sm text-slate-500">units</span>
                </p>
              </div>

              <div className="glass-panel rounded-xl p-5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Clock className="h-4 w-4" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em]">
                    Duration
                  </p>
                </div>
                <p className="mt-2 font-mono text-2xl font-bold text-white">
                  <AnimatedNumber value={result.durationDays} />
                  <span className="ml-1 text-sm text-slate-500">days</span>
                </p>
              </div>
            </div>

            {/* Rate breakdown */}
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center gap-2 text-amber-400">
                <TrendingUp className="h-4 w-4" />
                <p className="font-mono text-[10px] uppercase tracking-[0.16em]">
                  Rate Breakdown
                </p>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-400">
                <li className="flex items-center justify-between">
                  <span>Base rate per sq ft/ft</span>
                  <span className="font-mono font-semibold text-slate-300">
                    ₹250–₹350
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Structure complexity</span>
                  <span className="font-mono font-semibold text-slate-300">
                    {STRUCTURE_OPTIONS.find((o) => o.value === state.structureType)
                      ?.multiplier.toFixed(2)}
                    x
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Floor load factor</span>
                  <span className="font-mono font-semibold text-slate-300">
                    {(1 + (state.floors - 1) * 0.22).toFixed(2)}x
                  </span>
                </li>
              </ul>
            </div>

            <p className="rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-center text-xs leading-relaxed text-slate-400">
              This is an indicative estimate. Final quote provided after free site survey
              and laser structural audit.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
