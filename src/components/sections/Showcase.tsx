"use client";

import { Activity, Camera, FileText, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ShowcaseFeature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

const FEATURES: readonly ShowcaseFeature[] = [
  {
    id: "telemetry",
    title: "Live jack telemetry",
    description:
      "Every jack reports pressure and extension on a one-second interval. Deviation beyond 1 mm halts the lift automatically.",
    icon: Activity,
  },
  {
    id: "photolog",
    title: "Daily photo log",
    description:
      "Timestamped site photographs at each stage, so you can review progress without visiting the site.",
    icon: Camera,
  },
  {
    id: "documents",
    title: "Drawings and certificates",
    description:
      "Survey CAD files, load calculations, and the final stability certificate stay downloadable after handover.",
    icon: FileText,
  },
];

export function Showcase(): JSX.Element {
  return (
    <section id="showcase" className="border-y border-slate-200 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Project dashboard"
            title="Watch your lift from your phone"
            description="Every client gets a project dashboard. Jack pressures, elevation readings, and the daily site log are visible in real time — the same data our site engineer sees."
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <DeviceFrame variant="desktop" title="dashboard.rrandsons.in/project/2481">
              <Image
                src="/screenshot-desktop.svg"
                alt="Project dashboard showing jack pressure readings, elevation progress, and the daily site log"
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </DeviceFrame>
          </Reveal>

          <Reveal delayMs={120}>
            <DeviceFrame variant="mobile">
              <Image
                src="/screenshot-mobile.svg"
                alt="Mobile view of the project dashboard with live jack telemetry"
                width={375}
                height={812}
                className="h-auto w-full"
              />
            </DeviceFrame>
          </Reveal>
        </div>

        <dl className="mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.id} delayMs={index * 80}>
                <div className="border-t border-slate-200 pt-6">
                  <Icon className="h-5 w-5 text-amber-600" aria-hidden />
                  <dt className="mt-4 text-base font-semibold text-ink">
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
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
