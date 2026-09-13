import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm font-mono font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700",
        /** Hydraulic Blue — technical measurements and phase labels. */
        technical: "bg-hydraulic-50 text-hydraulic-700",
        /** Safety Amber — active state, highlights. */
        accent: "bg-amber-50 text-amber-700",
        outline: "border border-slate-200 bg-white text-slate-600",
        /** Charcoal — for use over imagery, where contrast must win. */
        solid: "bg-ink/85 text-white backdrop-blur-sm",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/** Small inline badge for tags, status labels, and technical metrics. */
export function Badge({ className, variant, size, ...props }: BadgeProps): JSX.Element {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
