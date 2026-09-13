"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Safety Amber — the single highest-intent action on any given view. */
        primary:
          "bg-amber-600 text-white shadow-amber hover:bg-amber-700 hover:shadow-lg active:translate-y-px focus-visible:ring-amber-600",
        /** Charcoal — secondary conversion path (call, WhatsApp). */
        solid:
          "bg-ink text-white hover:bg-slate-800 active:translate-y-px focus-visible:ring-ink",
        /** Hairline outline for tertiary actions on white surfaces. */
        outline:
          "border border-slate-300 bg-white text-ink hover:border-slate-400 hover:bg-slate-50 active:translate-y-px focus-visible:ring-ink",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink focus-visible:ring-slate-500",
        link: "h-auto p-0 text-amber-700 underline-offset-4 hover:underline focus-visible:ring-amber-600",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. an anchor) instead of a button. */
  asChild?: boolean;
  /**
   * Adds an expanding amber ring behind the button to draw the eye. Reserved
   * for the header's "Instant Estimate" — more than one on screen at a time
   * and it stops meaning anything.
   */
  pulse?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, pulse = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    // Slot forwards props onto a single child element, so it can't accept the
    // extra ring span. `asChild` therefore renders the child untouched — the
    // pulse is only available on real <button> elements, which is where it's
    // actually used.
    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {pulse ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-md bg-amber-500 motion-reduce:hidden"
          />
        ) : null}
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";
