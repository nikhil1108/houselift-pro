"use client";

import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { SERVICES } from "@/components/data/mockData";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { resolveIcon } from "@/lib/icons";

/** Load rating shown on each card, so the grid carries data and not just copy. */
const CAPABILITY: Record<string, { metric: string; unit: string }> = {
  "hydraulic-lifting": { metric: "2–10", unit: "ft lift range" },
  "building-relocation": { metric: "18", unit: "m max shift" },
  "foundation-repair": { metric: "±2", unit: "mm tolerance" },
  "commercial-elevation": { metric: "15,000", unit: "T capacity" },
};

export function Services(): JSX.Element {
  const scrollToAnchor = useAnchorScroll();

  return (
    <section
      id="services"
      className="relative border-b border-slate-200 bg-canvas py-12 sm:py-16 lg:py-28"
    >
      <div aria-hidden className="bg-engineering-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Core capabilities"
            title="Four disciplines, one structural team"
            description="We lift structures clear of flood zones and rising road grades, move them horizontally to new plots, and repair foundations that have settled or cracked."
            centered
          />
        </Reveal>

        {/* `perspective` on the wrapper is what makes the per-card rotate read as
            depth rather than as a skew. */}
        <div
          className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          style={{ perspective: "1200px" }}
        >
          {SERVICES.map((service, index) => {
            const Icon: LucideIcon = resolveIcon(service.iconName);
            const capability = CAPABILITY[service.id];

            return (
              <Reveal key={service.id} delayMs={index * 70} className="h-full">
                <article className="card-3d group flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-amber-50 ring-1 ring-inset ring-amber-100 transition-colors duration-300 group-hover:bg-amber-600 group-hover:ring-amber-600">
                      <Icon
                        className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 transition-colors duration-300 group-hover:text-white"
                        aria-hidden
                      />
                    </span>
                    <span className="font-mono text-xs text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-semibold leading-snug tracking-tight text-ink">
                    {service.title}
                  </h3>

                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-ink-muted">
                    {service.description}
                  </p>

                  <ul className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2 border-t border-slate-100 pt-4 sm:pt-5">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"
                      >
                        <span
                          aria-hidden
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-500"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-end justify-between gap-2 sm:gap-3 pt-4 sm:pt-6">
                    {capability ? (
                      <p className="leading-none">
                        <span className="font-mono text-xl font-bold text-hydraulic-700">
                          {capability.metric}
                        </span>
                        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                          {capability.unit}
                        </span>
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => scrollToAnchor("#quote")}
                      className="inline-flex items-center gap-1 rounded text-xs font-semibold text-slate-500 transition-colors hover:text-amber-700 group-hover:text-amber-700 py-2 sm:py-0 touch-manipulation"
                    >
                      Enquire
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
