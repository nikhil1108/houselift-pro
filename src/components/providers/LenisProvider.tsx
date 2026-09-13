"use client";

import Lenis from "@studio-freight/lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface LenisContextValue {
  /** Smoothly scrolls to a CSS selector (e.g. "#services"). */
  scrollTo: (target: string) => void;
}

const LenisContext = createContext<LenisContextValue | null>(null);

/**
 * Provides Lenis inertial smooth scrolling for the whole document and
 * exposes a `scrollTo` helper so in-page anchors animate through Lenis
 * instead of fighting it with native `scroll-behavior`.
 *
 * Respects `prefers-reduced-motion` by skipping Lenis entirely.
 */
export function LenisProvider({ children }: { children: ReactNode }): JSX.Element {
  const lenisRef = useRef<Lenis | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const onChange = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Exponential ease-out — heavy, machined feel that suits the brand.
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number): void => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = useCallback((target: string): void => {
    const element = document.querySelector(target);
    if (!(element instanceof HTMLElement)) return;

    // Offset clears the fixed header stack.
    const offset = -96;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset, duration: 1.4 });
      return;
    }

    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY + offset,
      behavior: "smooth",
    });
  }, []);

  return (
    <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>
  );
}

/** Access the smooth-scroll helper. Falls back to native scrolling. */
export function useSmoothScroll(): LenisContextValue {
  const context = useContext(LenisContext);

  const fallback = useCallback((target: string): void => {
    const element = document.querySelector(target);
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return context ?? { scrollTo: fallback };
}
