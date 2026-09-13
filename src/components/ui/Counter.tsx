"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn, formatINRCompact, formatNumber } from "@/lib/utils";

interface CounterProps {
  target: number;
  /** Render the raw count or compact INR (₹1.2 Lakh / ₹1.2 Cr). */
  format?: "number" | "inr";
  /** Number of decimal places to animate through. */
  decimals?: number;
  /** Duration of the tween in milliseconds. */
  durationMs?: number;
  className?: string;
}

/**
 * Animated counter that tweens from 0 to `target` when it enters the viewport.
 * Uses a bounded requestAnimationFrame loop inside `useCountUp` — no per-scroll
 * listeners. The tween runs once per pageview and respects `prefers-reduced-motion`.
 */
export function Counter({
  target,
  format = "number",
  decimals = 0,
  durationMs = 1400,
  className,
}: CounterProps): JSX.Element {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const current = useCountUp({
    target,
    active: inView,
    durationMs,
    decimals,
  });

  const formatted =
    format === "inr" ? formatINRCompact(current) : formatNumber(current);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {formatted}
    </span>
  );
}
