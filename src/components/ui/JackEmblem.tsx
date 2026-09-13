"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface JackEmblemProps {
  className?: string;
  /** Continuously animate the piston stroke (used in the header logo). */
  animated?: boolean;
}

/**
 * Brand emblem: a mechanical jack whose stroke moves upward,
 * lifting a slab. Drawn as inline SVG so it scales and recolors freely.
 */
export function JackEmblem({
  className,
  animated = true,
}: JackEmblemProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="RR AND SONS mechanical jack emblem"
      className={cn("h-full w-full", className)}
    >
      {/* Slab being lifted */}
      <motion.g
        animate={animated ? { y: [0, -3.5, 0] } : undefined}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="6" y="6" width="28" height="5" rx="1.5" fill="#F59E0B" />
        <rect x="6" y="6" width="28" height="1.6" rx="0.8" fill="#FCD34D" />
      </motion.g>

      {/* Piston rod — extends in sync with the slab */}
      <motion.rect
        x="18"
        width="4"
        rx="1"
        fill="#0284C7"
        animate={animated ? { y: [15, 11.5, 15], height: [10, 13.5, 10] } : undefined}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        y={15}
        height={10}
      />

      {/* Jack body */}
      <rect x="12" y="24" width="16" height="9" rx="2" fill="#334155" />
      <rect x="12" y="24" width="16" height="2" rx="1" fill="#475569" />

      {/* Base plate */}
      <rect x="8" y="33" width="24" height="4" rx="1.5" fill="#1E293B" />

      {/* Pressure indicator */}
      <motion.circle
        cx="20"
        cy="28.5"
        r="1.8"
        fill="#F59E0B"
        animate={animated ? { opacity: [0.45, 1, 0.45] } : undefined}
        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
