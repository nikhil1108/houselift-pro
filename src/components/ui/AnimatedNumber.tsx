"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  /** Gate the animation — e.g. only run once scrolled into view. */
  active?: boolean;
  decimals?: number;
  durationSeconds?: number;
  /** Format the tweened value. Defaults to Indian digit grouping. */
  format?: (value: number) => string;
  className?: string;
}

const defaultFormat = (value: number, decimals: number): string =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

/**
 * Tweens a numeric value with Framer Motion's imperative `animate`,
 * re-running whenever the target changes (used by the cost calculator)
 * and gated by `active` (used by the scroll-triggered hero counters).
 */
export function AnimatedNumber({
  value,
  active = true,
  decimals = 0,
  durationSeconds = 1.8,
  format,
  className,
}: AnimatedNumberProps): JSX.Element {
  const [display, setDisplay] = useState<number>(active ? value : 0);
  const previous = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const controls = animate(previous.current, value, {
      duration: durationSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest: number) => setDisplay(latest),
      onComplete: () => {
        previous.current = value;
      },
    });

    return () => controls.stop();
  }, [value, active, durationSeconds]);

  const text = format
    ? format(display)
    : defaultFormat(display, decimals);

  return (
    <span className={cn("tabular-nums", className)}>{text}</span>
  );
}
