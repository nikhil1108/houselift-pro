"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseInViewOnceResult<T extends HTMLElement> {
  ref: RefObject<T>;
  inView: boolean;
}

/**
 * Reports the first time an element enters the viewport, then stops observing.
 *
 * Used to gate work that must run in React (counter tweens, one-shot
 * diagram playback) rather than in CSS. Unlike a scroll handler this fires
 * at most once and does no per-frame work.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "0px 0px -15% 0px",
): UseInViewOnceResult<T> {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
