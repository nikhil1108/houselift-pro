"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Expand,
  ExternalLink,
  X,
} from "lucide-react";

import { SITE_PHOTOS, CONTACT_INFO } from "@/components/data/mockData";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FacebookOriginalIcon,
  InstagramOriginalIcon,
  YoutubeOriginalIcon,
} from "@/components/ui/SocialIcons";
import { cn } from "@/lib/utils";
import type { SitePhoto } from "@/types";

type PhotoCategory = "all" | "residential" | "commercial" | "heritage-media" | "jacks-tech";

const CATEGORIES: { label: string; value: PhotoCategory }[] = [
  { label: "All Photographs", value: "all" },
  { label: "Residential Lifts", value: "residential" },
  { label: "Commercial & Piers", value: "commercial" },
  { label: "Heritage & National Media", value: "heritage-media" },
  { label: "Jack Arrays & Columns", value: "jacks-tech" },
];

function getCategory(photo: SitePhoto): PhotoCategory {
  const src = photo.src.toLowerCase();
  const alt = photo.alt.toLowerCase();

  if (src.includes("newspaper") || src.includes("heritage") || alt.includes("minaret") || alt.includes("temple")) {
    return "heritage-media";
  }
  if (src.includes("pillar") || src.includes("jack") || src.includes("control") || alt.includes("jack") || alt.includes("pillar")) {
    return "jacks-tech";
  }
  if (src.includes("commercial") || src.includes("haridwar") || alt.includes("commercial")) {
    return "commercial";
  }
  return "residential";
}

export function SitePhotos(): JSX.Element {
  const [filter, setFilter] = useState<PhotoCategory>("all");
  const [activePhoto, setActivePhoto] = useState<SitePhoto | null>(null);

  const filteredPhotos = useMemo(() => {
    if (filter === "all") return SITE_PHOTOS;
    return SITE_PHOTOS.filter((photo) => getCategory(photo) === filter);
  }, [filter]);

  const activeIndex = activePhoto
    ? filteredPhotos.findIndex((p) => p.id === activePhoto.id)
    : -1;

  const navigatePhoto = useCallback(
    (delta: number) => {
      if (activeIndex < 0 || filteredPhotos.length === 0) return;
      const nextIndex = (activeIndex + delta + filteredPhotos.length) % filteredPhotos.length;
      setActivePhoto(filteredPhotos[nextIndex] ?? null);
    },
    [activeIndex, filteredPhotos],
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePhoto(null);
      if (e.key === "ArrowLeft") navigatePhoto(-1);
      if (e.key === "ArrowRight") navigatePhoto(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activePhoto, navigatePhoto]);

  return (
    <section id="site-photos" className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="Direct Field Photographs"
              title="Site photo archive"
              description="Unedited operational frames directly from our site engineers across India — mechanical jacks under load, reinforced plinths, multi-storey brick piers, and historic structure shifting."
              className="max-w-2xl"
            />
          </Reveal>

          <Reveal delayMs={80}>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-white border border-slate-200/90 rounded-lg px-3 py-2 shadow-sm">
              <Camera className="h-4 w-4 text-amber-600" />
              <span>Showing {filteredPhotos.length} of {SITE_PHOTOS.length} authentic photos</span>
            </div>
          </Reveal>
        </div>

        {/* Category Filters */}
        <Reveal delayMs={100}>
          <div
            role="tablist"
            aria-label="Filter site photos"
            className="no-scrollbar mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1"
          >
            {CATEGORIES.map((cat) => {
              const active = filter === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(cat.value);
                    setActivePhoto(null);
                  }}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200",
                    active
                      ? "border-amber-600 bg-amber-600 text-white shadow-amber"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-ink",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Photo Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredPhotos.map((photo, index) => {
            const isNewspaper = photo.src.includes("newspaper");

            return (
              <Reveal
                key={photo.id}
                delayMs={Math.min(index, 6) * 60}
                className="h-full"
              >
                <div
                  onClick={() => setActivePhoto(photo)}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
                    />

                    {/* Expand icon overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Expand className="h-5 w-5 text-amber-700" />
                      </span>
                    </div>

                    {/* Tag badge for special photos */}
                    {isNewspaper && (
                      <span className="absolute left-3 top-3 rounded bg-red-600/90 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                        National Press Feature
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 group-hover:text-ink transition-colors">
                      {photo.alt}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100 text-[11px] font-mono text-amber-700">
                      <span>Click to view full photo</span>
                      <Expand className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Live Video & Social Channels Banner */}
        <Reveal delayMs={150} className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-ink via-slate-900 to-ink p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-red-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  Live Field Recordings &amp; Reels
                </div>
                <h3 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                  Watch Our Mechanical Lifting Operations Live
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                  See full continuous videos of houses being lifted, rotated, and shifted on mechanical jacks across India. Follow our daily engineering walk-throughs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={CONTACT_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:bg-white/20 hover:scale-105"
                >
                  <YoutubeOriginalIcon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>YouTube Channel</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>

                <a
                  href={CONTACT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                >
                  <InstagramOriginalIcon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>Instagram Reels</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>

                <a
                  href={CONTACT_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                >
                  <FacebookOriginalIcon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>Facebook</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Modal Lightbox for Site Photos */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative flex max-h-[92vh] max-w-5xl flex-col overflow-hidden rounded-2xl bg-ink text-white shadow-2xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Photo {activeIndex + 1} of {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigatePhoto(-1)}
                  aria-label="Previous photo"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigatePhoto(1)}
                  aria-label="Next photo"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  aria-label="Close photo"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 hover:bg-red-600 text-white transition-colors ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative aspect-[16/10] max-h-[68vh] w-full bg-black/50">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />

              {/* Prev/Next overlay click buttons on the sides */}
              <button
                type="button"
                onClick={() => navigatePhoto(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 border border-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => navigatePhoto(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 border border-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Caption bar */}
            <div className="border-t border-white/10 bg-slate-900/90 p-4">
              <p className="text-sm font-medium leading-relaxed text-slate-200">
                {activePhoto.alt}
              </p>
              <p className="mt-1 font-mono text-[11px] text-slate-400">
                Press &larr; / &rarr; keys to browse · Esc to close
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
