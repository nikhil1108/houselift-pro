"use client";

import { Car, Clapperboard, Layers, Ruler, ShieldCheck } from "lucide-react";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StiltParkingClip } from "@/components/ui/StiltParkingClip";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

/**
 * Stilt parking conversion.
 *
 * The service is the house lift applied to a different problem: instead of
 * escaping a flood line, the clearance opened underneath becomes covered
 * parking. The clip plays the sequence — house rises, columns grow into the
 * void, jacks retire, cars drive in — because the sequence *is* the
 * explanation. The right-hand readout tracks the clip's own progress, so the
 * numbers and the picture can never disagree.
 */

/** Clearance delivered at full travel. Matches the clip's 8 ft lift. */
const MAX_CLEARANCE_FT = 8;

/**
 * Detail copy keyed to the clip's caption labels. The labels live in the clip
 * component; if they change there, this map needs the same edit — kept beside
 * the readout it feeds so the two stay visibly linked.
 */
const PHASE_DETAILS: Record<string, string> = {
  Before: "Ground floor at grade, car left on the street. No covered parking and no land to buy any.",
  "Setting out": "Levels taken and the stilt column grid marked out against the existing footprint.",
  "Pad footings": "Pits opened at each column position and pad footings cast to bear the new load.",
  "Jacks seated": "Needle beams threaded under the plinth, synchronised jacks on load-spreading plates.",
  Raising: "The house climbs 25 mm a stroke, every jack within ±2 mm. The bay opens underneath.",
  "Stilts cast": "M20 RCC columns (or as per requirement) poured full height on Fe500D cages, then cured before any load returns.",
  "Load transfer": "Load handed to the columns. Beams withdrawn, jacks recovered, pits backfilled.",
  "Screed & access": "Parking floor screeded to fall and the new stair built up to the raised front door.",
  "Two-car bay": "8 ft clear under the slab. Two cars covered, not an inch of plot given up.",
};

const BENEFITS: ReadonlyArray<{
  id: string;
  icon: typeof Car;
  title: string;
  description: string;
}> = [
  {
    id: "space",
    icon: Car,
    title: "Two cars, zero land bought",
    description:
      "A 8–10 ft lift turns your existing footprint into covered parking. No side setback sacrificed, no plot extension, no FSI consumed.",
  },
  {
    id: "flood",
    icon: ShieldCheck,
    title: "Living floor clears the flood line",
    description:
      "The same lift that creates the bay puts your living space above the high-water mark. Water passes through the stilts instead of into your rooms.",
  },
  {
    id: "value",
    icon: Layers,
    title: "Parking that appraises",
    description:
      "Covered off-street parking is a line item in every valuation and rental listing. Retro-fitted stilts read as original construction once finished.",
  },
];

export function StiltParking(): JSX.Element {
  const scrollToAnchor = useAnchorScroll();

  // Mirrors the clip's own timeline. `phaseLabel` comes straight from the clip so
  // the badge can never name a stage the picture isn't showing.
  const [progress, setProgress] = useState<number>(0);
  const [phaseLabel, setPhaseLabel] = useState<string>("Before");

  const handleProgress = useCallback((value: number, label: string): void => {
    setProgress(value);
    setPhaseLabel(label);
  }, []);

  // The lift runs from 6.6s to 10s of a 16s clip; clearance tracks that window.
  const clearance = (
    Math.min(Math.max((progress - 0.41) / 0.21, 0), 1) * MAX_CLEARANCE_FT
  ).toFixed(1);
  const detail = PHASE_DETAILS[phaseLabel] ?? PHASE_DETAILS.Before!;

  return (
    <section
      id="stilt-parking"
      className="relative overflow-hidden border-b border-slate-200 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Stilt parking conversion"
            title="Watch a ground floor become a car park"
            description="The clearance a lift opens up does not have to sit empty. Raise the structure 8 to 10 feet and the ground plane becomes a covered two-car bay on RCC stilts — parking added without buying an inch of land."
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <Reveal>
            <StiltParkingClip onProgress={handleProgress} />
            <p className="mt-4 flex items-center gap-2 font-mono text-xs text-slate-500">
              <Clapperboard className="h-3.5 w-3.5 text-amber-600" />
              16-second loop — scrub the bar to stop on any stage
            </p>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-xl border border-slate-200/80 bg-ink p-6 text-slate-300 shadow-lg sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
                  <Ruler className="h-3.5 w-3.5" />
                  Bay clearance
                </p>
                <Badge variant="solid" size="sm" className="bg-white/10 text-slate-200">
                  {phaseLabel}
                </Badge>
              </div>

              <p className="nums mt-6 font-mono text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl">
                {clearance}
                <span className="ml-2 text-xl font-semibold text-amber-500">ft</span>
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
                Slab underside to finished floor
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-[width] duration-500 ease-engineer"
                  style={{ width: `${(Number(clearance) / MAX_CLEARANCE_FT) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-500">
                <span>0.0 ft</span>
                <span>{MAX_CLEARANCE_FT.toFixed(1)} ft target</span>
              </div>

              <p className="mt-6 min-h-[3rem] text-sm leading-relaxed text-slate-400">
                {detail}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10">
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <Car className="h-3 w-3" />
                    Bay capacity
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-lg font-bold text-white">
                    2 <span className="text-xs font-normal text-slate-500">cars</span>
                  </dd>
                </div>
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <Layers className="h-3 w-3" />
                    Stilt columns
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-lg font-bold text-white">
                    4
                    <span className="ml-1 text-xs font-normal text-slate-500">nos</span>
                  </dd>
                </div>
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <ShieldCheck className="h-3 w-3" />
                    Column grade
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-base font-bold text-white">
                    M20 / As Req.
                  </dd>
                </div>
                <div className="bg-ink px-4 py-4">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    <Ruler className="h-3 w-3" />
                    Programme
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-lg font-bold text-white">
                    22
                    <span className="ml-1 text-xs font-normal text-slate-500">days</span>
                  </dd>
                </div>
              </dl>

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={() => scrollToAnchor("#quote")}
              >
                Ask about a stilt conversion
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Why it is worth doing — three points, no animation of their own. */}
        <dl className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.id} delayMs={index * 80}>
                <div className="border-t border-slate-200 pt-6">
                  <Icon className="h-5 w-5 text-amber-600" aria-hidden />
                  <dt className="mt-4 text-base font-semibold text-ink">
                    {benefit.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-600">
                    {benefit.description}
                  </dd>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
