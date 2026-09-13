import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small mono eyebrow label above the title. */
  eyebrow?: string;
  /** Optional — omit to run eyebrow straight into the description. */
  title?: string;
  description?: string;
  centered?: boolean;
  /** Semantic heading level (renders h2 or h3). */
  level?: 2 | 3;
  /** Inverts colours for use on the charcoal band. */
  onDark?: boolean;
  className?: string;
}

/**
 * Section heading: eyebrow + title + description.
 *
 * Carries no animation of its own — wrap it in `<Reveal>` where an entry
 * transition is wanted, so the heading stays usable in contexts that shouldn't
 * animate at all.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  level = 2,
  onDark = false,
  className,
}: SectionHeadingProps): JSX.Element {
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <div className={cn(centered && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em]",
            centered && "justify-center",
            onDark ? "text-amber-400" : "text-amber-700",
          )}
        >
          {/* Short rule reads as a drafting tick rather than decoration. */}
          <span
            aria-hidden
            className={cn("h-px w-6", onDark ? "bg-amber-400/60" : "bg-amber-600/50")}
          />
          {eyebrow}
        </p>
      ) : null}

      {title ? (
        <Heading
          className={cn(
            "text-balance text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </Heading>
      ) : null}

      {description ? (
        <p
          className={cn(
            // Without a title the description carries the section, so it loses
            // the top margin that would otherwise separate it from the heading.
            "text-pretty text-base leading-relaxed sm:text-lg",
            title && "mt-4",
            onDark ? "text-slate-300" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
