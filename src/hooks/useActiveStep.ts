"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseActiveStepResult {
  activeIndex: number;
  /** Register a step element by index. Pass null to unregister. */
  registerStep: (index: number, element: HTMLElement | null) => void;
  /** Manually select a step (used by the clickable step headers). */
  setActiveIndex: (index: number) => void;
}

/**
 * Tracks which of a set of steps is currently in the reader's viewport focus.
 * Uses high-performance rAF scroll evaluation against the reader's natural focus line.
 */
export function useActiveStep(count: number): UseActiveStepResult {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const elementsRef = useRef<Map<number, HTMLElement>>(new Map());
  const lockRef = useRef<number | undefined>(undefined);
  const rafRef = useRef<number | null>(null);

  const registerStep = useCallback((index: number, element: HTMLElement | null): void => {
    const map = elementsRef.current;
    if (element) {
      map.set(index, element);
    } else {
      map.delete(index);
    }
  }, []);

  const evaluateActiveStep = useCallback((): void => {
    if (lockRef.current !== undefined) return;
    if (elementsRef.current.size === 0) return;

    // The reader's natural reading focus is around 40%–45% from the viewport top
    const focusY = window.innerHeight * 0.42;

    let closestIndex = 0;
    let minDistance = Infinity;

    const sortedEntries = Array.from(elementsRef.current.entries()).sort(
      ([a], [b]) => a - b,
    );

    for (const [index, element] of sortedEntries) {
      const rect = element.getBoundingClientRect();

      // If the focus point is within this card, this card is active
      if (rect.top <= focusY && rect.bottom >= focusY) {
        setActiveIndex(index);
        return;
      }

      const cardCenter = rect.top + rect.height * 0.5;
      const distance = Math.abs(cardCenter - focusY);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    }

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const onScrollOrResize = (): void => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        evaluateActiveStep();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // Initial check on mount
    evaluateActiveStep();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [evaluateActiveStep, count]);

  const selectStep = useCallback((index: number): void => {
    setActiveIndex(index);

    if (lockRef.current !== undefined) window.clearTimeout(lockRef.current);
    lockRef.current = window.setTimeout(() => {
      lockRef.current = undefined;
    }, 750);
  }, []);

  useEffect(() => {
    return () => {
      if (lockRef.current !== undefined) window.clearTimeout(lockRef.current);
    };
  }, []);

  return { activeIndex, registerStep, setActiveIndex: selectStep };
}
