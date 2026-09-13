"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface UseRevealOptions {
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Shrinks the viewport so the reveal fires slightly before the edge. */
  rootMargin?: string;
  /** Re-hide when scrolled back out. Off by default — reveals are one-shot. */
  repeat?: boolean;
}

/**
 * Reveals an element once it scrolls into view.
 *
 * Deliberately uses IntersectionObserver rather than a scroll listener: the
 * browser computes intersections off the main thread, so there is no
 * per-frame JS work and no layout thrash while scrolling. The transition
 * itself is defined in CSS against [data-reveal] — this hook only flips the
 * attribute, which keeps animation off the React render path entirely.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
): RefObject<T> {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", repeat = false } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Reduced motion: show immediately, never observe.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      element.setAttribute("data-reveal", "in");
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      element.setAttribute("data-reveal", "in");
      return;
    }

    let settleTimer: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");

            // Release the will-change hint after the transition finishes.
            settleTimer = window.setTimeout(() => {
              entry.target.setAttribute("data-reveal-settled", "true");
            }, 600);

            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            entry.target.setAttribute("data-reveal", "out");
            entry.target.removeAttribute("data-reveal-settled");
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      if (settleTimer !== undefined) window.clearTimeout(settleTimer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, repeat]);

  return ref;
}
