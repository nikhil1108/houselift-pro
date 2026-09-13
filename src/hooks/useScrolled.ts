"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseScrolledResult {
  /** Attach to a zero-height element at the very top of the document. */
  sentinelRef: RefObject<HTMLDivElement>;
  /** True once the sentinel has scrolled out of view. */
  scrolled: boolean;
}

/**
 * Detects "page has scrolled" without a scroll listener.
 *
 * Uses the sentinel pattern: a zero-height marker sits at the top of the
 * document and is observed. When it leaves the viewport we know the user has
 * scrolled past it. This is O(1) work handled by the browser's compositor
 * rather than a callback firing on every scroll frame, which is what caused
 * the janky header in the previous implementation.
 */
export function useScrolled(): UseScrolledResult {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, scrolled };
}
