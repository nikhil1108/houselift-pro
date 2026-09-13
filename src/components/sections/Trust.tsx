"use client";

import type { LucideIcon } from "lucide-react";

import { TRUST_POINTS } from "@/components/data/mockData";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveIcon } from "@/lib/icons";

export function Trust(): JSX.Element {
  return (
    <section id="trust" className="bg-canvas py-12 sm:py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Why us"
              description="Lifting a building is irreversible once it starts, so the guarantees matter more than the sales pitch. Here is what every contract includes."
            />
          </Reveal>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
            {TRUST_POINTS.map((point, index) => {
              const Icon: LucideIcon = resolveIcon(point.iconName);
              return (
                <Reveal key={point.id} delayMs={index * 60} className="bg-white">
                  <div className="h-full p-5 sm:p-6">
                    <Icon className="h-5 w-5 text-amber-600" aria-hidden />
                    <dt className="mt-4 text-base font-semibold text-ink">
                      {point.title}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-slate-600">
                      {point.description}
                    </dd>
                  </div>
                </Reveal>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
