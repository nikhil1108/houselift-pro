"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target: number;
  /** Gate the tween — typically an IntersectionObserver result. */
  active: boolean;
  durationMs?: number;
  decimals?: number;
}

/** easeOutQuint — decelerates hard so the final digits settle visibly. */
const easeOut = (t: number): number => 1 - Math.pow(1 - t, 5);

/**
 * Counts from 0 to `target` on a requestAnimationFrame loop.
 *
 * rAF rather than a CSS transition because the tweened value is text
 * content, not a style. The loop is bounded by `durationMs` and cancels on
 * unmount, so it can't leak frames. Honours prefers-reduced-motion by
 * snapping straight to the target.
 */
export function useCountUp({
  target,
  active,
  durationMs = 1400,
  decimals = 0,
}: UseCountUpOptions): number {
  const [value, setValue] = useState<number>(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!active) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || durationMs <= 0) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const factor = 10 ** decimals;

    const tick = (now: number): void => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const next = target * easeOut(progress);

      // Quantise to the displayed precision so we don't re-render per sub-pixel.
      setValue(Math.round(next * factor) / factor);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [target, active, durationMs, decimals]);

  return value;
}
