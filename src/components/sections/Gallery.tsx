"use client";

import { ArrowUpRight, Expand, MapPin } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  CONTACT_INFO,
  GALLERY_FILTERS,
  GALLERY_PROJECTS,
} from "@/components/data/mockData";
import {
  FacebookOriginalIcon,
  InstagramOriginalIcon,
  YoutubeOriginalIcon,
} from "@/components/ui/SocialIcons";
import { Lightbox } from "@/components/ui/Lightbox";
import { ProjectPlate } from "@/components/ui/ProjectPlate";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { GalleryCategory, GalleryProject } from "@/types";

type FilterValue = GalleryCategory | "all";

/** Human label for the overlay chip, keyed off the project's own category. */
const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
  "hydraulic-tech": "Mechanical Tech",
  "before-after": "Before & After",
};

export function Gallery(): JSX.Element {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo<GalleryProject[]>(
    () =>
      filter === "all"
        ? GALLERY_PROJECTS
        : GALLERY_PROJECTS.filter((project) => project.category === filter),
    [filter],
  );

  const openIndex = openId
    ? visible.findIndex((project) => project.id === openId)
    : -1;
  const openProject = openIndex >= 0 ? visible[openIndex] : undefined;

  /** Paging wraps, so the viewer never dead-ends at either edge. */
  const page = useCallback(
    (delta: number): void => {
      if (openIndex < 0 || visible.length === 0) return;
      const next = (openIndex + delta + visible.length) % visible.length;
      setOpenId(visible[next]?.id ?? null);
    },
    [openIndex, visible],
  );

  /** Switching filters closes the viewer — its paging set no longer exists. */
  const applyFilter = (value: FilterValue): void => {
    setFilter(value);
    setOpenId(null);
  };

  return (
    <section id="gallery" className="border-b border-slate-200 bg-white py-12 sm:py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Live field projects & proof"
            title="Ten sites, documented end to end"
            description="Every job is photographed at each stage and logged against its drawings. These are the plates our site engineers work from — lift heights, jack counts and durations exactly as recorded."
            className="max-w-2xl"
          />
        </Reveal>

        {/* Filter rail. Scrolls horizontally on narrow screens rather than wrapping
            into a ragged block. */}
        <Reveal delayMs={80}>
          <div
            role="tablist"
            aria-label="Filter field projects by category"
            className="no-scrollbar mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1"
          >
            {GALLERY_FILTERS.map((option) => {
              const active = filter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => applyFilter(option.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200",
                    active
                      ? "border-amber-600 bg-amber-600 text-white shadow-amber"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-ink",
                  )}
                >
                  {option.label}
                </button>
              );
            })}

            <span className="ml-auto hidden shrink-0 items-center pl-4 font-mono text-xs text-slate-400 sm:flex">
              {String(visible.length).padStart(2, "0")} / {GALLERY_PROJECTS.length}{" "}
              plates
            </span>
          </div>
        </Reveal>

        {/* Re-keyed on the filter so the surviving cards replay their reveal. */}
        <div
          key={filter}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {visible.map((project, index) => (
            <Reveal key={project.id} delayMs={Math.min(index, 5) * 60} className="h-full">
              <button
                type="button"
                onClick={() => setOpenId(project.id)}
                aria-label={`Open project ${project.index}: ${project.title}, ${project.location}`}
                className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
              >
                <div
                  className={cn(
                    "relative overflow-hidden bg-slate-100",
                    project.ratio === "16:9" ? "aspect-[16/9]" : "aspect-[4/3]",
                  )}
                >
                  <ProjectPlate
                    scene={project.scene}
                    photo={project.photo}
                    alt={`${project.title} — ${project.location}`}
                    className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
                  />

                  {/* Category badge */}
                  <span className="absolute left-3 top-3 rounded-sm bg-ink/85 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    {CATEGORY_LABEL[project.category]}
                  </span>

                  {/* Plate number */}
                  <span className="absolute right-3 top-3 rounded-sm bg-white/90 px-2 py-1 font-mono text-[10px] font-bold text-ink backdrop-blur-sm">
                    {project.index}
                  </span>

                  {/* Expand affordance, revealed on hover/focus */}
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100 group-focus-visible:bg-ink/25 group-focus-visible:opacity-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg">
                      <Expand className="h-4 w-4" aria-hidden />
                    </span>
                  </span>

                  {/* Location tag */}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-white/92 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-slate-700 backdrop-blur-sm">
                    <MapPin className="h-3 w-3 text-amber-600" aria-hidden />
                    {project.location}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-semibold leading-snug tracking-tight text-ink group-hover:text-amber-800">
                    {project.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                    {project.caption}
                  </p>

                  <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-100 pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">
                    {project.specs.slice(0, 2).map((spec) => (
                      <div key={spec.label} className="flex items-baseline gap-1.5">
                        <dt>{spec.label}</dt>
                        <dd className="nums font-semibold text-slate-700">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-xs text-slate-400">
          Click any plate for the full specification sheet
        </p>

        {/* Live Video & Social Channels Banner */}
        <Reveal delayMs={150} className="mt-8 sm:mt-12">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 bg-gradient-to-br from-ink via-slate-900 to-ink p-4 text-white shadow-xl sm:p-8 lg:p-10">
            {/* Engineering grid accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-red-400">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:hidden" />
                    <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500" />
                  </span>
                  Live Field Recordings &amp; Reels
                </div>
                <h3 className="mt-2 sm:mt-3 text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                  Watch Our Mechanical Lifting Operations Live
                </h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 sm:text-base">
                  See full continuous videos of houses being lifted, rotated, and shifted on mechanical jacks. Follow our daily site updates and technical walk-throughs across India.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href={CONTACT_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl border border-white/20 bg-white/10 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:bg-white/20 hover:scale-105"
                >
                  <YoutubeOriginalIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>YouTube Channel</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href={CONTACT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl border border-white/20 bg-white/10 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                >
                  <InstagramOriginalIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>Instagram Reels</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href={CONTACT_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl border border-white/20 bg-white/10 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                >
                  <FacebookOriginalIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>Facebook</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {openProject ? (
        <Lightbox
          project={openProject}
          position={openIndex + 1}
          total={visible.length}
          onClose={() => setOpenId(null)}
          onPrev={() => page(-1)}
          onNext={() => page(1)}
        />
      ) : null}
    </section>
  );
}
