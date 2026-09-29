"use client";

import { Camera, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProjectPlate } from "@/components/ui/ProjectPlate";
import { cn } from "@/lib/utils";
import type { GalleryProject } from "@/types";

interface LightboxProps {
  project: GalleryProject;
  /** Position within the filtered set, for the "3 / 10" counter. */
  position: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Expansive project viewer.
 *
 * Implemented by hand rather than pulled from a dialog library because the
 * behaviour needed here is narrow and the accessibility contract is short:
 * trap focus, restore it on close, close on Escape, page with the arrow keys,
 * and lock the background from scrolling while open.
 */
export function Lightbox({
  project,
  position,
  total,
  onClose,
  onPrev,
  onNext,
}: LightboxProps): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Element that had focus before opening, so it can be restored on close. */
  const restoreRef = useRef<HTMLElement | null>(null);

  const [photoIndex, setPhotoIndex] = useState(0);

  // Reset to the first photo whenever switching to a different project
  useEffect(() => {
    setPhotoIndex(0);
  }, [project.id]);

  const photos =
    project.photos && project.photos.length > 0
      ? project.photos
      : project.photo
      ? [project.photo]
      : [];
  const currentPhoto = photos[photoIndex] ?? project.photo;

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    return () => {
      restoreRef.current?.focus();
    };
  }, []);

  // Lock background scroll, restoring whatever the previous value was rather
  // than blindly clearing it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key !== "Tab") return;

      // Focus trap: cycle within the panel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Project ${project.index}: ${project.title}`}
    >
      {/* Veil. Charcoal rather than pure black — consistent with the ink. */}
      <button
        type="button"
        aria-label="Close project viewer"
        onClick={onClose}
        className="absolute inset-0 animate-veil-in cursor-default bg-ink/80 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="relative z-10 flex max-h-[92dvh] sm:max-h-[90vh] w-full max-w-6xl animate-lightbox-in flex-col overflow-hidden rounded-xl bg-white shadow-2xl lg:flex-row"
      >
        {/* Plate. The aspect lives on the wrapper, not the plate — a photo
            renders with `fill` and so contributes no intrinsic height. */}
        <div className="relative aspect-[16/10] shrink-0 bg-slate-100 lg:w-[62%]">
          <ProjectPlate
            scene={project.scene}
            photo={currentPhoto}
            alt={`${project.title} — ${project.location}`}
            className="h-full w-full object-cover"
          />

          <span className="absolute left-4 top-4 rounded bg-ink/85 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {project.index}
          </span>

          {photos.length > 1 && (
            <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded bg-ink/85 px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-white backdrop-blur-sm">
              <Camera className="h-3.5 w-3.5 text-amber-400" />
              Photo {photoIndex + 1} / {photos.length}
            </span>
          )}

          {/* Photo indicator dots when multiple photos exist */}
          {photos.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
              {photos.map((p, idx) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhotoIndex(idx)}
                  aria-label={`View photo ${idx + 1} of ${photos.length}`}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    idx === photoIndex
                      ? "w-8 bg-amber-500 shadow-sm"
                      : "w-2.5 bg-white/70 shadow-sm hover:bg-white",
                  )}
                />
              ))}
            </div>
          )}

          {/* Paging controls, overlaid on the plate */}
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous project"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next project"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-hydraulic-50 px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider text-hydraulic-700">
              <MapPin className="h-3.5 w-3.5" />
              {project.location}
            </span>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project viewer"
              className="-mr-1 -mt-1 flex h-11 w-11 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="mt-3 sm:mt-4 text-lg sm:text-2xl font-bold leading-snug tracking-tight text-ink">
            {project.title}
          </h3>

          <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-ink-muted">
            {project.caption}
          </p>

          <dl className="mt-4 sm:mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
            {project.specs.map((spec) => (
              <div key={spec.label} className="bg-white px-3 py-2 sm:px-4 sm:py-3">
                <dt className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">
                  {spec.label}
                </dt>
                <dd className="mt-1 font-mono text-xs sm:text-sm font-semibold text-ink">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Multi-photo thumbnail selector */}
          {photos.length > 1 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h4 className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Camera className="h-3.5 w-3.5 text-amber-600" />
                Site Photos ({photos.length})
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {photos.map((p, idx) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPhotoIndex(idx)}
                    aria-label={`Switch to photo ${idx + 1}`}
                    className={cn(
                      "relative h-16 w-20 overflow-hidden rounded-lg border-2 transition-all duration-200 sm:h-20 sm:w-24",
                      idx === photoIndex
                        ? "scale-105 border-amber-600 shadow-md ring-2 ring-amber-600/30"
                        : "border-slate-200 opacity-60 hover:border-slate-400 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={p}
                      alt={`${project.title} photo ${idx + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-ink/80 px-1 py-0.5 font-mono text-[9px] font-bold leading-none text-white">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-auto pt-6 font-mono text-xs text-slate-400">
            {position} / {total} · Use ← → to browse
          </p>
        </div>
      </div>
    </div>
  );
}
