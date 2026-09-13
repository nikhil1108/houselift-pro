import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoMarkProps {
  /** Size variant matching the design system 8pt grid. */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Sits the mark on a white chip. The artwork is black-and-orange on an
   * opaque white ground with no alpha channel, so on the charcoal footer it
   * would otherwise read as a bare white rectangle.
   */
  onDark?: boolean;
  /** Set on the header instance only — it is the one above the fold. */
  priority?: boolean;
  className?: string;
}

/**
 * RR and Sons brand mark — the house-and-monogram logo.
 *
 * The source file is a 3:2 lockup, so the size variants are 3:2 boxes and the
 * image is drawn `object-contain` inside them: nothing is cropped, and the
 * artwork keeps its own generous internal margins rather than being
 * letterboxed a second time.
 *
 * Colour is baked into the file, so unlike the SVG mark this replaced, a
 * `text-*` class on it does nothing.
 */
export function LogoMark({
  size = "md",
  onDark = false,
  priority = false,
  className,
}: LogoMarkProps): JSX.Element {
  const dimensions = {
    sm: "h-8 w-12",
    md: "h-11 w-[4.125rem]",
    lg: "h-14 w-[5.25rem]",
    xl: "h-16 w-24",
  };

  const mark = (
    <Image
      src="/RRandSonsLogo.png"
      // Decorative: both current call sites render "RR & Sons" as adjacent
      // text, so a filled alt would be announced twice.
      alt=""
      width={1536}
      height={1024}
      priority={priority}
      className={cn("object-contain", dimensions[size], className)}
    />
  );

  if (!onDark) return mark;

  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded bg-white p-1">
      {mark}
    </span>
  );
}
