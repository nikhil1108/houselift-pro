"use client";

import { useCallback } from "react";

/** Height of the sticky header, in px — anchors offset by this. */
const HEADER_OFFSET = 72;

/**
 * Scrolls to an in-page anchor using the platform's native smooth scroll.
 *
 * This replaces the previous Lenis-based smooth-scroll bridge. Lenis
 * (and any scroll-hijacking library) drives scroll position from JS on every
 * frame, which fights the compositor, breaks native anchor behaviour, and is
 * the usual source of the "sticky elements lag behind the viewport" bug.
 * `scrollTo({ behavior: "smooth" })` is handled by the browser off the main
 * thread and automatically respects prefers-reduced-motion.
 */
export function useAnchorScroll(): (href: string) => void {
  return useCallback((href: string): void => {
    if (!href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!(target instanceof HTMLElement)) return;

    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });

    // Keep the URL and focus in sync for keyboard and screen-reader users.
    window.history.replaceState(null, "", href);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, []);
}
