"use client";

import { useReveal, type UseRevealOptions } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

interface RevealProps extends UseRevealOptions {
  children: React.ReactNode;
  className?: string;
  /** Stagger the reveal by a fixed delay, in milliseconds. */
  delayMs?: number;
}

/**
 * Fades and lifts its children into place once scrolled into view.
 *
 * The transition itself lives in CSS against `[data-reveal]`; this component
 * only renders the initial attribute so there is no flash of unstyled content
 * before the observer attaches.
 */
export function Reveal({
  children,
  className,
  delayMs,
  ...options
}: RevealProps): JSX.Element {
  const ref = useReveal<HTMLDivElement>(options);

  return (
    <div
      ref={ref}
      data-reveal="out"
      className={cn(className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
