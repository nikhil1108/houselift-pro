"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Container-bounded scroll animation.
 *
 * The requirement is motion that tracks scroll position without the layout
 * jumps and jank that global `window.onscroll` handlers cause. Four things get
 * us there:
 *
 *  1. **IntersectionObserver gating.** The scroll listener is attached only
 *     while the section is on screen and detached the moment it leaves, so
 *     off-screen sections cost exactly nothing.
 *  2. **rAF coalescing.** Scroll events fire far more often than the display
 *     refreshes. Handlers collapse into at most one measurement per frame, and
 *     the measurement happens inside the frame callback — a single read
 *     followed by a single write, so no forced synchronous layout.
 *  3. **CSS custom properties instead of React state.** Progress is written to
 *     `--scroll-progress` on the section element. The transforms that consume
 *     it are declared in CSS, so the browser animates them on the compositor
 *     and React never re-renders during scroll. This is also what bounds the
 *     animation: the property lives on the section, so only descendants can
 *     read it, and motion cannot structurally escape its container.
 *  4. **Quantised state for values that need JS.** A numeric readout has to
 *     reach React. `steps` rounds progress to whole increments, so a section
 *     re-renders a bounded number of times across its whole travel rather than
 *     once per scroll event.
 *
 * Everything no-ops under `prefers-reduced-motion`.
 */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export interface UseScrollSceneOptions {
  /**
   * Quantise progress into this many integer steps and expose it as `step`.
   * Omit when the animation is CSS-only — that skips React entirely.
   */
  steps?: number;
  /** Raw viewport progress mapped to an output of 0. */
  start?: number;
  /** Raw viewport progress mapped to an output of 1. */
  end?: number;
  /** Set false to detach — used when a user control takes over the value. */
  enabled?: boolean;
}

export interface UseScrollSceneResult<T extends HTMLElement> {
  /** Attach to the section that both bounds and drives the animation. */
  ref: RefObject<T>;
  /** Integer in [0, steps]. Always 0 when `steps` is omitted. */
  step: number;
}

export function useScrollScene<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollSceneOptions = {},
): UseScrollSceneResult<T> {
  const { steps, start = 0, end = 1, enabled = true } = options;

  const ref = useRef<T>(null);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!enabled || prefersReducedMotion()) {
      // Park at the resting value so a disabled scene isn't stuck mid-pose.
      element.style.setProperty("--scroll-progress", "0");
      return;
    }

    let frame = 0;
    let listening = false;

    const write = (): void => {
      frame = 0;

      const rect = element.getBoundingClientRect();
      // Total distance the element travels from "top edge entering at the
      // bottom" to "bottom edge exiting at the top".
      const travel = rect.height + window.innerHeight;
      if (travel <= 0) return;

      const raw = clamp01((window.innerHeight - rect.top) / travel);
      // Rescale so the caller's [start, end] window fills the full 0–1 output.
      const progress = end > start ? clamp01((raw - start) / (end - start)) : raw;

      element.style.setProperty("--scroll-progress", progress.toFixed(4));

      if (steps !== undefined) {
        // setState bails out on an identical value, so this is a no-op for
        // the large majority of frames.
        setStep(Math.round(progress * steps));
      }
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
          // Settle on whichever edge we left through, so a section scrolled
          // past quickly doesn't freeze half-animated.
          write();
        }
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [steps, start, end, enabled]);

  return { ref, step };
}
