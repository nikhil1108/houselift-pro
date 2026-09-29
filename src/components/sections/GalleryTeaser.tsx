"use client";

import { ArrowRight, Camera, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { GALLERY_PROJECTS } from "@/components/data/mockData";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GalleryTeaser(): JSX.Element {
  // Display 3 featured sites as preview cards
  const featured = GALLERY_PROJECTS.slice(0, 3);

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50/70 py-16 sm:py-20 lg:py-24">
      {/* Background blueprint pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="Field operations & verified proof"
              title="Ten project sites, documented end-to-end"
              description="Real structural lifts photographed at every phase — synchronized jacks under load, foundation strengthening, and complete specifications."
              className="max-w-2xl"
            />
          </Reveal>

          <Reveal delayMs={80}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 hover:shadow-md"
              >
                <span>Explore Full 10-Site Gallery</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* 3 Featured Preview Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.id} delayMs={index * 80}>
              <Link
                href="/gallery"
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {project.photo ? (
                    <Image
                      src={project.photo}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 font-mono text-xs text-slate-500">
                      Technical Plate {project.index}
                    </div>
                  )}

                  {/* Plate label */}
                  <span className="absolute left-3 top-3 rounded bg-ink/85 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                    Site {project.index}
                  </span>

                  {/* Photo count indicator */}
                  {project.photos && project.photos.length > 1 && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded bg-ink/85 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-sm">
                      <Camera className="h-3 w-3 text-amber-400" />
                      {project.photos.length} Photos
                    </span>
                  )}

                  {/* Location tag */}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-white/92 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-slate-700 backdrop-blur-sm">
                    <MapPin className="h-3 w-3 text-amber-600" />
                    {project.location}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-amber-800 sm:text-base">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {project.caption}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-amber-700">
                    <span>View full specs &amp; photos</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Bottom Banner linking to /gallery */}
        <Reveal delayMs={160} className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  Looking for detailed drawings, filters, and high-res lightbox?
                </p>
                <p className="text-xs text-slate-600">
                  Browse our standalone gallery with all 10 documented sites, technical sheets, and live operation recordings.
                </p>
              </div>
            </div>

            <Link
              href="/gallery"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-700"
            >
              <span>Open Gallery Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
