"use client";

import {
  ArrowUpFromLine,
  CalendarDays,
  IndianRupee,
  Layers,
  type LucideIcon,
  Ruler,
  Scaling,
} from "lucide-react";
import { useState } from "react";

import { STRUCTURE_OPTIONS } from "@/components/data/mockData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import {
  calculateEstimate,
  cn,
  floorLoadFactor,
  formatINRCompact,
  structureLoadFactor,
} from "@/lib/utils";
import type { CalculatorState, StructureType } from "@/types";

const INITIAL_STATE: CalculatorState = {
  areaSqFt: 2000,
  liftHeightFt: 6,
  floors: 2,
  structureType: "residential",
};

/** Slider bounds, declared once so the tick labels can't drift from the input. */
const AREA = { min: 500, max: 5000, step: 50 } as const;
const LIFT = { min: 2, max: 10, step: 0.5 } as const;
const FLOORS = { min: 1, max: 4, step: 1 } as const;

interface SliderProps {
  id: string;
  label: string;
  icon: LucideIcon;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

/**
 * One labelled range control.
 *
 * The filled portion of the track is painted as a background gradient on the
 * input itself rather than as an extra overlay element, so dragging repaints a
 * single node and never triggers layout.
 */
function Slider({
  id,
  label,
  icon: Icon,
  value,
  display,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  onChange,
}: SliderProps): JSX.Element {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Icon className="h-4 w-4 text-slate-400" aria-hidden />
          {label}
        </span>
        <output htmlFor={id} className="nums font-mono text-sm font-bold text-amber-700">
          {display}
        </output>
      </label>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-track mt-3.5"
        style={{
          backgroundImage: `linear-gradient(to right, var(--amber) ${percent}%, var(--line) ${percent}%)`,
        }}
      />

      <div className="mt-2 flex justify-between font-mono text-[11px] text-slate-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

interface ResultTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  note: string;
}

function ResultTile({
  icon: Icon,
  label,
  value,
  unit,
  note,
}: ResultTileProps): JSX.Element {
  return (
    <div className="bg-ink px-5 py-5">
      <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-3 w-3" aria-hidden />
        {label}
      </dt>
      <dd>
        <p className="nums mt-2 font-mono text-2xl font-bold leading-none text-white">
          {value}
          <span className="ml-1.5 text-xs font-normal text-slate-500">{unit}</span>
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{note}</p>
      </dd>
    </div>
  );
}

export function Calculator(): JSX.Element {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const scrollToAnchor = useAnchorScroll();
  const result = calculateEstimate(state);

  const updateField = <K extends keyof CalculatorState>(
    field: K,
    value: CalculatorState[K],
  ): void => {
    setState((previous) => ({ ...previous, [field]: value }));
  };

  const structureFactor = structureLoadFactor(state.structureType);
  const floorFactor = floorLoadFactor(state.floors);

  return (
    <section
      id="estimator"
      className="relative border-b border-slate-200 bg-canvas py-20 lg:py-28"
    >
      <div aria-hidden className="bg-engineering-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Cost estimator"
            description="Move the three sliders to match your building. Figures update live against our standard rate band of ₹250–350 per sq ft per foot of lift, adjusted for storey load and structure type."
            centered
          />
        </Reveal>

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          {/* Inputs */}
          <Reveal>
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-panel sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight text-ink">
                  Project parameters
                </h3>
                <Badge variant="outline" size="sm">
                  Live
                </Badge>
              </div>

              <fieldset className="mt-7">
                <legend className="mb-3 text-sm font-medium text-slate-700">
                  Structure type
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {STRUCTURE_OPTIONS.map((option) => {
                    const selected = state.structureType === option.value;

                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer flex-col gap-1 rounded-lg border px-4 py-3 transition-colors duration-200",
                          selected
                            ? "border-amber-300 bg-amber-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                        )}
                      >
                        <input
                          type="radio"
                          name="structureType"
                          value={option.value}
                          checked={selected}
                          onChange={(event) =>
                            updateField(
                              "structureType",
                              event.target.value as StructureType,
                            )
                          }
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            selected ? "text-amber-800" : "text-slate-700",
                          )}
                        >
                          {option.label}
                        </span>
                        <span className="text-[11px] leading-snug text-slate-500">
                          {option.hint}
                        </span>
                        <span className="nums mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                          ×{option.multiplier.toFixed(2)} load
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-8 space-y-8 border-t border-slate-100 pt-8">
                <Slider
                  id="est-area"
                  label="Built-up area"
                  icon={Scaling}
                  value={state.areaSqFt}
                  display={`${state.areaSqFt.toLocaleString("en-IN")} sq ft`}
                  min={AREA.min}
                  max={AREA.max}
                  step={AREA.step}
                  minLabel="500"
                  maxLabel="5,000 sq ft"
                  onChange={(value) => updateField("areaSqFt", value)}
                />

                <Slider
                  id="est-lift"
                  label="Lift height"
                  icon={ArrowUpFromLine}
                  value={state.liftHeightFt}
                  display={`${state.liftHeightFt.toFixed(1)} ft`}
                  min={LIFT.min}
                  max={LIFT.max}
                  step={LIFT.step}
                  minLabel="2 ft"
                  maxLabel="10 ft"
                  onChange={(value) => updateField("liftHeightFt", value)}
                />

                <Slider
                  id="est-floors"
                  label="Floor count"
                  icon={Layers}
                  value={state.floors}
                  display={state.floors === 1 ? "1 storey" : `${state.floors} storeys`}
                  min={FLOORS.min}
                  max={FLOORS.max}
                  step={FLOORS.step}
                  minLabel="1"
                  maxLabel="4 storeys"
                  onChange={(value) => updateField("floors", value)}
                />
              </div>

              <p className="mt-8 border-t border-slate-100 pt-5 text-[11px] leading-relaxed text-slate-500">
                Beyond 5,000 sq ft or 10 ft of lift the job moves to bespoke pricing —
                call the helpline and we will scope it against a site survey.
              </p>
            </div>
          </Reveal>

          {/* Outputs */}
          <Reveal delayMs={120}>
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-ink shadow-lg">
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
                    <IndianRupee className="h-3.5 w-3.5" />
                    Estimated cost range
                  </p>
                  <Badge variant="solid" size="sm" className="bg-white/10 text-slate-200">
                    ×{(structureFactor * floorFactor).toFixed(2)} load
                  </Badge>
                </div>

                <p className="nums mt-5 font-mono text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl">
                  {formatINRCompact(result.estimatedCostMin)}
                  <span className="mx-2 font-normal text-slate-600">–</span>
                  {formatINRCompact(result.estimatedCostMax)}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  All-inclusive: laser survey, jacking plant, new RCC foundation, labour,
                  materials.
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
                <ResultTile
                  icon={CalendarDays}
                  label="Days to complete"
                  value={String(result.durationDays)}
                  unit="days"
                  note="Survey to final handover"
                />
                <ResultTile
                  icon={ArrowUpFromLine}
                  label="Mechanical jacks"
                  value={String(result.jacksRequired)}
                  unit="nos"
                  note="One point per ~40 sq ft"
                />
              </dl>

              <div className="border-t border-white/10 p-6 sm:p-7">
                <dl className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Rate band</dt>
                    <dd className="nums text-slate-300">₹250–350 / sq ft / ft</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Structure premium</dt>
                    <dd className="nums text-slate-300">×{structureFactor.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Storey load</dt>
                    <dd className="nums text-slate-300">×{floorFactor.toFixed(2)}</dd>
                  </div>
                </dl>

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={() => scrollToAnchor("#quote")}
                >
                  Lock this estimate with a site visit
                </Button>

                <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  <Ruler className="h-3 w-3" aria-hidden />
                  Indicative only · final quote after site audit
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
