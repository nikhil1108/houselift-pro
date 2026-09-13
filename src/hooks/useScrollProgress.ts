"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Scroll-linked animation primitives.
 *
 * The naive version of this — `window.onscroll` writing React state — repaints
 * the whole subtree on every scroll event and drops frames badly. Three things
 * keep these hooks smooth:
 *
 *  1. **IntersectionObserver gating.** The scroll listener only exists while the
 *     target is on screen. Off-screen sections cost nothing.
 *  2. **rAF coalescing.** Scroll fires faster than the display refreshes, so
 *     handlers are collapsed into at most one measurement per frame, and that
 *     measurement happens inside the frame callback — one read, one write, no
 *     interleaving, so no forced synchronous layout.
 *  3. **CSS custom properties, not React state.** `useScrollProgress` writes a
 *     number to a CSS variable. The transform that consumes it is declared in
 *     CSS, so the browser animates it on the compositor and React never
 *     re-renders. `useScrollStep` is the escape hatch for values that genuinely
 *     need to reach JS, and it quantises so re-renders are bounded.
 *
 * Both hooks no-op under `prefers-reduced-motion`.
 */

function reducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Raw progress of an element through the viewport.
 *
 * 0 when the element's top edge is at the bottom of the viewport (about to
 * enter), 1 when its bottom edge reaches the top (fully passed).
 */
function measure(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const travel = rect.height + window.innerHeight;
  if (travel <= 0) return 0;
  return clamp01((window.innerHeight - rect.top) / travel);
}

/** Rescale `raw` so that [start, end] maps onto [0, 1]. */
function remap(raw: number, start: number, end: number): number {
  if (end <= start) return raw;
  return clamp01((raw - start) / (end - start));
}

/**
 * Attaches a scroll listener while `element` is visible and calls `onFrame`
 * with the element's remapped progress, at most once per animation frame.
 * Returns a teardown function.
 */
function trackProgress(
  element: HTMLElement,
  start: number,
  end: number,
  onFrame: (progress: number) => void,
): () => void {
  let frame = 0;
  let listening = false;

  const write = (): void => {
    frame = 0;
    onFrame(remap(measure(element), start, end));
  };

  const schedule = (): void => {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(write);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting === listening) continue;
      listening = entry.isIntersecting;

      if (listening) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        write();
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        // Settle on the edge we left through, so a section scrolled past
        // quickly doesn't freeze mid-animation.
        write();
      }
    }
  });

  observer.observe(element);

  return (): void => {
    observer.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame !== 0) window.cancelAnimationFrame(frame);
  };
}

export interface UseScrollProgressOptions {
  /** Custom property to write on the element. Children inherit it. */
  property?: string;
  /** Raw progress at which the mapped output should read 0. */
  start?: number;
  /** Raw progress at which the mapped output should read 1. */
  end?: number;
}

/**
 * Writes the element's scroll progress (0–1) into a CSS custom property.
 *
 * Consume it from CSS on the element or any descendant, e.g.
 * `transform: translate3d(0, calc(var(--scroll-progress) * 60px), 0)`.
 * No React state is involved, so nothing re-renders while scrolling.
 */
export function useScrollProgress<T extends HTMLElement>(
  options: UseScrollProgressOptions = {},
): RefObject<T> {
  const { property = "--scroll-progress", start = 0, end = 1 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reducedMotion()) {
      element.style.setProperty(property, "0");
      return;
    }

    return trackProgress(element, start, end, (progress) => {
      element.style.setProperty(property, progress.toFixed(4));
    });
  }, [property, start, end]);

  return ref;
}

export interface UseScrollStepOptions extends Omit<UseScrollProgressOptions, "property"> {
  /** Set false to hand control to the user and detach the listener. */
  enabled?: boolean;
}

interface UseScrollStepResult<T extends HTMLElement> {
  ref: RefObject<T>;
  /** Integer in [0, steps]. */
  step: number;
}

/**
 * Scroll progress quantised to whole steps, for values that must reach JS
 * (numeric readouts, `aria-label` text).
 *
 * Quantising is what makes this cheap: a 20-step scroll re-renders 20 times
 * across the section rather than once per scroll event. Pair it with a short
 * CSS transition on the consuming element and the motion still reads as
 * continuous.
 */
export function useScrollStep<T extends HTMLElement>(
  steps: number,
  options: UseScrollStepOptions = {},
): UseScrollStepResult<T> {
  const { enabled = true, start = 0, end = 1 } = options;
  const ref = useRef<T>(null);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || reducedMotion()) return;

    return trackProgress(element, start, end, (progress) => {
      const next = Math.round(progress * steps);
      // setState bails out on an identical value, so this is a no-op for the
      // vast majority of frames.
      setStep(next);
    });
  }, [steps, enabled, start, end]);

  return { ref, step };
}
