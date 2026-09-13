"use client";

import BuildingScene from "@/components/ui/BuildingScene";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/utils";

interface Stage {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly metric: string;
}

/** Seven poses. The scene holds one per stage; scroll advances the index. */
const STAGES: readonly Stage[] = [
  {
    id: "survey",
    label: "Survey & structural audit",
    detail:
      "Laser levels map every corner of the slab. Load paths, wall thickness and soil bearing capacity are recorded before anything is touched.",
    metric: "Day 1–2",
  },
  {
    id: "beams",
    label: "Steel needle beams",
    detail:
      "Pockets are cut through the plinth and rolled steel joists threaded beneath the structure, transferring the entire load onto a temporary steel grid.",
    metric: "Day 3–6",
  },
  {
    id: "jacks",
    label: "Mechanical jack placement",
    detail:
      "Mechanical jacks are seated on load-spread pads at calculated intervals beneath the plinth beams so every jack carries its calculated share.",
    metric: "Day 7–9",
  },
  {
    id: "lift",
    label: "Synchronised lift",
    detail:
      "All mechanical jacks advance together in synchronized movement. Deviation beyond 1 mm across the grid halts the lift immediately.",
    metric: "5 mm per stroke",
  },
  {
    id: "shift",
    label: "Rail shift (if relocating)",
    detail:
      "Where the building has to move as well as rise, it travels on greased rails over rollers — the same rigid body, simply repositioned.",
    metric: "Optional stage",
  },
  {
    id: "place",
    label: "New foundation & seating",
    detail:
      "RCC pillars and a fresh grade beam are cast beneath the raised structure, then the load is handed back from steel to concrete.",
    metric: "Day 10–24",
  },
  {
    id: "done",
    label: "Relevel, cure & handover",
    detail:
      "Final levels are checked corner to corner, the grid is struck, and the house sits above the flood line on permanent columns.",
    metric: "6.0 ft clear",
  },
];

const LAST = STAGES.length - 1;

export function ScrollBuildingStory(): JSX.Element {
  // Quantised: at most seven renders across the section's whole travel.
  const { ref, step } = useScrollScene<HTMLElement>({
    steps: LAST,
    start: 0.12,
    end: 0.88,
  });

  const stage = step > LAST ? LAST : step;

  return (
    <section
      ref={ref}
      id="story"
      className="relative border-b border-slate-200 bg-canvas"
    >
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <Reveal>
          <SectionHeading
            eyebrow="How a lift actually happens"
            title="One building, seven stages, zero demolition"
            description="The same structure the whole way through. Scroll to walk the sequence our site engineers follow, from the first laser reading to the day the grid comes out."
            className="max-w-2xl"
          />
        </Reveal>
      </div>

      {/* Runway: the sticky scene stays put while the stage list advances. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-8 lg:pb-28">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div
            className="bs-scene overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-panel"
            data-stage={stage}
            data-beams={stage >= 1 ? "in" : undefined}
            data-jacks={stage >= 2 ? "in" : undefined}
            data-lifted={stage >= 3 ? "in" : undefined}
            data-shifted={stage >= 4 ? "in" : undefined}
            data-placed={stage >= 5 ? "in" : undefined}
            data-done={stage >= LAST ? "in" : undefined}
          >
            <BuildingScene className="block h-auto w-full" />
          </div>

          {/* Readout */}
          <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Stage{" "}
              <span className="nums font-bold text-ink">
                {String(stage + 1).padStart(2, "0")}
              </span>
              <span aria-hidden> / {String(STAGES.length).padStart(2, "0")}</span>
            </p>
            <div
              className="flex items-center gap-1.5"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={STAGES.length}
              aria-valuenow={stage + 1}
              aria-label="Lift sequence progress"
            >
              {STAGES.map((entry, index) => (
                <span
                  key={entry.id}
                  aria-hidden
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    index === stage
                      ? "w-7 bg-amber-500"
                      : index < stage
                        ? "w-3 bg-amber-300"
                        : "w-3 bg-slate-200",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stage list. Every stage stays readable, so the copy is complete even
            when motion is off. */}
        <ol className="flex flex-col gap-px overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200">
          {STAGES.map((entry, index) => {
            const active = index === stage;
            return (
              <li
                key={entry.id}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "relative bg-white p-5 transition-colors duration-500 sm:p-6",
                  active ? "bg-amber-50/60" : "bg-white",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-0.5 transition-colors duration-500",
                    active ? "bg-amber-600" : "bg-transparent",
                  )}
                />
                <div className="flex items-baseline justify-between gap-4">
                  <p
                    className={cn(
                      "text-sm font-semibold transition-colors duration-500",
                      active ? "text-ink" : "text-slate-500",
                    )}
                  >
                    <span className="nums mr-2 font-mono text-[11px] text-amber-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {entry.label}
                  </p>
                  <span className="nums shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    {entry.metric}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed transition-colors duration-500",
                    active ? "text-slate-600" : "text-slate-400",
                  )}
                >
                  {entry.detail}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
