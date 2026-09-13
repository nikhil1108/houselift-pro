"use client";

import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { ProjectPlate } from "@/components/ui/ProjectPlate";
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
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
        className="relative z-10 flex max-h-[90vh] w-full max-w-6xl animate-lightbox-in flex-col overflow-hidden rounded-xl bg-white shadow-2xl lg:flex-row"
      >
        {/* Plate. The aspect lives on the wrapper, not the plate — a photo
            renders with `fill` and so contributes no intrinsic height. */}
        <div className="relative aspect-[16/10] shrink-0 bg-slate-100 lg:w-[62%]">
          <ProjectPlate
            scene={project.scene}
            photo={project.photo}
            alt={`${project.title} — ${project.location}`}
            className="h-full w-full object-cover"
          />

          <span className="absolute left-4 top-4 rounded bg-ink/85 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {project.index}
          </span>

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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 sm:p-8">
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
              className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="mt-4 text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {project.caption}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
            {project.specs.map((spec) => (
              <div key={spec.label} className="bg-white px-4 py-3">
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  {spec.label}
                </dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-ink">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-auto pt-6 font-mono text-xs text-slate-400">
            {position} / {total} · Use ← → to browse
          </p>
        </div>
      </div>
    </div>
  );
}
