"use client";

import { Clapperboard, Ruler, TrendingUp } from "lucide-react";

import { ElevationClip } from "@/components/ui/ElevationClip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const OUTCOMES: ReadonlyArray<{ label: string; before: string; after: string }> = [
  { label: "Plinth vs. road level", before: "−1.2 ft below", after: "+4.8 ft above" },
  { label: "Monsoon water ingress", before: "Annual, 300 mm", after: "None recorded" },
  { label: "Foundation", before: "1980s rubble", after: "M20 RCC raft (or as per requirement)" },
  { label: "Insurable flood risk", before: "High", after: "Negligible" },
];

export function Comparison(): JSX.Element {
  return (
    <section
      id="comparison"
      className="border-b border-slate-200 bg-white py-12 sm:py-16 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Same house, new datum"
            title="Watch what six feet changes"
            description="The whole job in fourteen seconds — survey, needle beams, jacks, the lift itself, then the new plinth. The structure is never opened and the finishes are never touched. Only the level below it changes."
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-8 sm:mt-14 grid items-start gap-8 sm:gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <Reveal>
            <ElevationClip />
            <p className="mt-4 flex items-center gap-2 font-mono text-xs text-slate-500">
              <Clapperboard className="h-3.5 w-3.5 text-amber-600" />
              14-second loop — scrub the bar to stop on any stage
            </p>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-xl border border-slate-200/80 bg-canvas p-6 shadow-panel sm:p-7">
              <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <Ruler className="h-3.5 w-3.5 text-hydraulic-600" />
                Measured outcome
              </p>

              <dl className="mt-6 space-y-5">
                {OUTCOMES.map((row) => (
                  <div key={row.label} className="border-b border-slate-200 pb-5 last:border-0 last:pb-0">
                    <dt className="text-xs uppercase tracking-wider text-slate-500">
                      {row.label}
                    </dt>
                    <dd className="mt-2 flex items-center gap-2.5 text-sm">
                      <span className="font-mono text-slate-400 line-through decoration-slate-300">
                        {row.before}
                      </span>
                      <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                      <span className="font-mono font-semibold text-ink">{row.after}</span>
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-7 rounded-lg bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-100">
                No walls were opened, no roof was removed and the family stayed in
                the house for 22 of the 25 working days.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
