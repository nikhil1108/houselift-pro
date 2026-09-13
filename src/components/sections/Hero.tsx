"use client";

import { ArrowRight, Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { CONTACT_INFO } from "@/components/data/mockData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { useScrollScene } from "@/hooks/useScrollScene";
import { buildWhatsAppLink, telHref } from "@/lib/utils";

const TRUST_BADGES: ReadonlyArray<{ value: number; suffix: string; label: string }> = [
  // "Combined" is load-bearing: it's the two founders' experience added
  // together, not the firm's age. RR AND SONS was established in 2013.
  { value: 20, suffix: "+ Years", label: "Combined Experience" },
  { value: 1500, suffix: "+", label: "Houses Lifted" },
  { value: 0, suffix: " Damage", label: "Zero Damage Record" },
  { value: 10, suffix: "-Year", label: "Structural Warranty with 1 year insurance" },
];

const CREDENTIALS: readonly string[] = [
  "First in India to rotate a building through 90°",
  "India Book of Records / Indian World Record Book",
  "100% safety agreement on court documentation",
  "Civil and mechanical engineers on every lift",
];

export function Hero(): JSX.Element {
  const scrollToAnchor = useAnchorScroll();
  // Bound to this section only: the CSS variable is written on <section>, so the
  // parallax layers inside can read it and nothing outside can.
  const { ref } = useScrollScene<HTMLElement>();

  return (
    <section
      ref={ref}
      id="hero"
      className="relative isolate overflow-hidden border-b border-slate-800 bg-ink"
    >
      {/* Layer 1 — the photograph. Drifts down on scroll and holds a slow Ken
          Burns push, so the frame is never quite static behind the copy. */}
      <div className="parallax-bg pointer-events-none absolute inset-0 -z-10">
        <div className="hero-photo-mask relative h-full w-full">
          <Image
            src="/gallery/02-jack-array.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={85}
            className="hero-kenburns object-cover object-[62%_72%]"
          />
        </div>
      </div>

      {/* Layer 2 — contrast scrim. Heaviest behind the copy column, thinning
          across the frame so the house itself stays readable. */}
      <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0 -z-10" />

      {/* Layer 3 — drafting grid, in white for the dark ground. */}
      <div
        aria-hidden
        className="bg-engineering-grid-inverse pointer-events-none absolute inset-0 -z-10"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-start gap-10 sm:gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* Copy column */}
          <div className="parallax-fg">
            <Reveal>
              <Badge variant="solid" className="gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
                Now surveying across 12 states
              </Badge>
            </Reveal>

            <Reveal delayMs={80}>
              <h1 className="mt-6 text-balance text-[2.1rem] font-bold leading-[1.08] tracking-tight text-white [text-shadow:0_1px_24px_rgba(15,23,42,0.5)] sm:text-5xl lg:text-[3.4rem]">
                Elevate Your Home Above Road Floods &amp; Waterlogging{" "}
                <span className="relative text-amber-400">
                  Without Demolition.
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-[3px] bg-amber-400/40"
                  />
                </span>
              </h1>
            </Reveal>

            <Reveal delayMs={140}>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-slate-200 [text-shadow:0_1px_12px_rgba(15,23,42,0.5)] sm:text-lg">
                Synchronised mechanical jacks raise your entire structure 2 to 10
                feet, held to ±2&nbsp;mm across every jack point, while we cast a
                new RCC foundation beneath it. You keep your house, your walls and
                your finishes — you just gain height.
              </p>
            </Reveal>

            <Reveal delayMs={200}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  pulse
                  onClick={() => scrollToAnchor("#quote")}
                  className="w-full sm:w-auto"
                >
                  Get Instant Estimate
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/20 sm:w-auto"
                >
                  <a
                    href={buildWhatsAppLink(
                      CONTACT_INFO.whatsapp,
                      "Hello RR & Sons — I'd like to book a free site survey for house lifting.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    Book your site survey today.
                  </a>
                </Button>
              </div>
            </Reveal>

            <Reveal delayMs={260}>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2 font-medium text-white">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                  <a
                    href={telHref(CONTACT_INFO.phonePrimary)}
                    className="font-mono transition-colors hover:text-amber-400"
                  >
                    {CONTACT_INFO.phonePrimary}
                  </a>
                  <span className="text-white/40">/</span>
                  <a
                    href={telHref(CONTACT_INFO.phoneSecondary)}
                    className="font-mono transition-colors hover:text-amber-400"
                  >
                    {CONTACT_INFO.phoneSecondary}
                  </a>
                </div>
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  Survey report within 48 hours
                </span>
              </div>
            </Reveal>
          </div>

          {/* Trust badge stack — frosted glass, so the photograph stays visible
              through it rather than being boxed out by a solid card. */}
          <Reveal delayMs={180} className="lg:pt-6">
            <div className="glass-panel rounded-xl border border-white/15 p-4 shadow-2xl sm:p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400">
                Verified track record
              </p>

              <dl className="mt-5 sm:mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/15">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.label} className="bg-ink/55 p-3.5 xs:px-4 xs:py-5">
                    <dd className="font-mono text-xl sm:text-[1.75rem] font-bold tracking-tight text-white">
                      <Counter target={badge.value} />
                      <span className="text-amber-400">{badge.suffix}</span>
                    </dd>
                    <dt className="mt-1 sm:mt-1.5 text-xs leading-snug text-slate-300">
                      {badge.label}
                    </dt>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-6">
                {CREDENTIALS.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm text-slate-200">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
