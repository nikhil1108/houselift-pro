"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import BuildingScene from "@/components/ui/BuildingScene";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

/** Storyboard captions — kept as data so copy is easy to edit. */
const STAGES = [
  {
    id: "problem",
    label: "The problem",
    title: "Your building does not always need to be demolished.",
    text: "A home can end up below a raised road or a rising flood line. Elevation restores a safe level.",
  },
  {
    id: "inspection",
    label: "Inspection",
    title: "We inspect the structure and engineer the lifting plan.",
    text: "Load paths and foundation points are surveyed before any work begins.",
  },
  {
    id: "preparation",
    label: "Preparation",
    title: "Steel beams and jacks are placed with care.",
    text: "Supports are positioned to distribute the load evenly across the structure.",
  },
  {
    id: "lift",
    label: "Lift",
    title: "Lifted evenly. Millimetre by millimetre.",
    text: "Synchronised jacks raise the building as one rigid unit while the ground stays put.",
  },
  {
    id: "shift",
    label: "Shift",
    title: "Shifted without rebuilding from zero.",
    text: "On temporary rails, the raised structure can travel horizontally to a new position.",
  },
  {
    id: "relevel",
    label: "Relevel",
    title: "Relevelled and secured on its new foundation.",
    text: "A small tilt is corrected and the structure is set true above its new support.",
  },
  {
    id: "result",
    label: "Result",
    title: "Protect the property you have already built.",
    text: "Floodwater now passes safely below the raised structure.",
  },
] as const;

export default function ScrolableAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const scrollToAnchor = useAnchorScroll();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    let ctx: { revert: () => void } | undefined;
    let mounted = true;

    // Dynamically import GSAP so it stays out of the initial bundle.
    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (!mounted) return;
      const gsap = gsapMod.default;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        const build = (isMobile: boolean) => {
          const LIFT = -150;
          const SHIFT = 60;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rootRef.current!,
              start: "top top",
              end: "bottom bottom",
              scrub: isMobile ? 0.5 : true,
              pin: pinRef.current!,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const idx = Math.min(
                  STAGES.length - 1,
                  Math.floor(self.progress * STAGES.length),
                );
                setActive(idx);
              },
            },
          });

          // Timeline spans 0..100 units matching storyboard percentages.
          // Stage 1 — problem (0-15): calm push-in + flood/road hint
          tl.fromTo(".bs-structure", { scale: 1 }, { scale: 1.02, duration: 15 }, 0);
          tl.fromTo(".bs-flood", { opacity: 0 }, { opacity: 1, duration: 12 }, 3);
          if (!isMobile) {
            tl.fromTo(".bs-scenery", { y: 0 }, { y: -14, duration: 100 }, 0);
          }

          // Stage 2 — inspection (15-28): scan + measurements
          tl.to(".bs-inspect", { opacity: 1, duration: 3 }, 15);
          tl.fromTo(
            ".bs-scanline",
            { attr: { y: 330 } },
            { attr: { y: 500 }, duration: 8 },
            16,
          );
          tl.to(".bs-inspect", { opacity: 0, duration: 3 }, 26);

          // Stage 3 — preparation (28-42): beams slide, jacks rise
          tl.fromTo(".bs-beams", { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 6 }, 28);
          tl.fromTo(".bs-jacks", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 6 }, 32);

          // Stage 4 — lift (42-62): rigid vertical rise, jacks extend, dust
          tl.to(".bs-structure", { y: LIFT, scale: 1, duration: 20 }, 42);
          tl.to(".bs-beams", { y: LIFT, duration: 20 }, 42);
          tl.to(".bs-jack-rod", { scaleY: 6.4, transformOrigin: "50% 100%", duration: 20 }, 42);
          tl.fromTo(".bs-dust", { opacity: 0 }, { opacity: 0.8, duration: 4, yoyo: true, repeat: 1 }, 46);
          tl.fromTo(".bs-dust-p", { y: 0 }, { y: -18, duration: 8, stagger: 0.4 }, 46);

          // Stage 5 — shift (62-78): rails appear, building travels + dimension
          // The jacks travel WITH the structure. Removing them here would leave
          // the raised house visibly unsupported until the stilts arrive at 90.
          tl.to(".bs-rails", { opacity: 1, duration: 3 }, 62);
          tl.to([".bs-structure", ".bs-beams", ".bs-jacks"], { x: SHIFT, duration: 12 }, 64);
          tl.fromTo(
            ".bs-shiftdim",
            { opacity: 0 },
            { opacity: 1, duration: 3 },
            64,
          );
          tl.fromTo(
            ".bs-shiftdim-line",
            { attr: { x1: 650, x2: 650 } },
            { attr: { x1: 650, x2: 650 + SHIFT }, duration: 10 },
            64,
          );

          // Stage 6 — relevel & placement (78-90)
          tl.to(".bs-rails", { opacity: 0, duration: 3 }, 78);
          tl.to(".bs-shiftdim", { opacity: 0, duration: 3 }, 78);
          tl.fromTo(".bs-newfoundation", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 6 }, 79);
          tl.fromTo(".bs-structure", { rotation: 1.2, transformOrigin: "50% 100%" }, { rotation: 0, duration: 8 }, 80);
          tl.fromTo(".bs-level", { opacity: 0 }, { opacity: 1, duration: 3, yoyo: true, repeat: 1 }, 82);

          // Stage 7 — result (90-100): stilt visible, warm light, calm
          // Permanent stilts come up first, then the temporary jacks retire.
          // The overlap means the house is never shown without support.
          tl.to(".bs-stilt", { opacity: 1, duration: 5 }, 86);
          tl.to(".bs-jacks", { opacity: 0, duration: 4 }, 91);
          tl.to(".bs-warm", { opacity: 0.5, duration: 8 }, 90);
          tl.to(".bs-flood", { opacity: 0.7, duration: 6 }, 90);
        };

        mm.add("(min-width: 768px)", () => build(false));
        mm.add("(max-width: 767px)", () => build(true));
      }, rootRef);

      ScrollTrigger.refresh();
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, []);

  // ---- Reduced-motion fallback: static final scene + stacked captions ----
  if (reduced) {
    return (
      <section
        id="simulator"
        className="py-20 lg:py-28"
        aria-label="Raise, move and protect — how a building is elevated"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Raise. Move. Protect."
            title="How a building is raised, moved and protected"
            description="The same seven stages the scroll-through storyboard walks through, laid out as a list."
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <BuildingScene className="w-full" />
          </div>

          <ol className="mx-auto mt-10 grid max-w-3xl gap-7">
            {STAGES.map((s) => (
              <li key={s.id} className="border-l-2 border-amber-600/50 pl-5">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  {s.label}
                </p>
                <h3 className="mt-1.5 text-balance text-xl font-bold leading-snug tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-pretty leading-relaxed text-ink-muted">
                  {s.text}
                </p>
              </li>
            ))}
          </ol>

          {/* Reduced-motion users never reach the final stage, so the CTAs that
              fade in there would otherwise be unreachable. */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-3">
            <Button asChild>
              <a
                href="#quote"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToAnchor("#quote");
                }}
              >
                Request a Site Inspection
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="#gallery"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToAnchor("#gallery");
                }}
              >
                See Completed Projects
              </a>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      id="simulator"
      aria-label="Raise, move and protect — how a building is elevated"
      className="relative w-full max-w-full overflow-hidden"
      style={{ height: "min(500vh, 5000px)" }}
    >
      <div ref={pinRef} className="relative h-screen w-full max-w-full overflow-hidden">
        {/* Stage / progress label */}
        <div className="pointer-events-none absolute inset-x-0 top-6 z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            {/* Same drafting tick every other section heading carries. */}
            <span aria-hidden className="h-px w-6 bg-amber-600/50" />
            Raise. Move. Protect.
          </p>
          <span
            className="nums font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
            aria-hidden
          >
            {String(active + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Building scene */}
        <div className="absolute inset-0 grid place-items-center px-4 overflow-hidden w-full max-w-full min-w-0">
          <BuildingScene ref={sceneRef} className="h-auto w-full max-w-[900px] min-w-0" />
        </div>

        {/* Captions — cross-faded; only the active one is shown to AT */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[132px] w-full max-w-xl">
            {STAGES.map((s, i) => (
              <div
                key={s.id}
                aria-hidden={i !== active}
                className="absolute inset-0 transition-all duration-500 ease-engineer"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(12px)",
                }}
              >
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  {s.label}
                </p>
                <h3 className="mt-2 text-balance text-2xl font-bold leading-[1.15] tracking-tight text-ink sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-md text-pretty text-base leading-relaxed text-ink-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>

          {/* Result-stage CTAs */}
          <div
            className="mt-4 flex flex-wrap gap-3 transition-opacity duration-500"
            style={{
              opacity: active === STAGES.length - 1 ? 1 : 0,
              pointerEvents: active === STAGES.length - 1 ? "auto" : "none",
            }}
          >
            <Button asChild>
              <a
                href="#quote"
                tabIndex={active === STAGES.length - 1 ? undefined : -1}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToAnchor("#quote");
                }}
              >
                Request a Site Inspection
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="#gallery"
                tabIndex={active === STAGES.length - 1 ? undefined : -1}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToAnchor("#gallery");
                }}
              >
                See Completed Projects
              </a>
            </Button>
          </div>
        </div>

        {/* Live region for screen readers */}
        <p className="sr-only" aria-live="polite">
          {STAGES[active]?.label}: {STAGES[active]?.title}
        </p>
      </div>
    </section>
  );
}