"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BuildingScene from "./BuildingScene";

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

export default function ScrollBuildingStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

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
          tl.to(".bs-rails", { opacity: 1, duration: 3 }, 62);
          tl.to([".bs-structure", ".bs-beams"], { x: SHIFT, duration: 12 }, 64);
          tl.to(".bs-jacks", { opacity: 0, duration: 3 }, 64);
          tl.to(".bs-jack-rod", { opacity: 0, duration: 3 }, 64);
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
          tl.to(".bs-stilt", { opacity: 1, duration: 5 }, 90);
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
      <section className="container-x py-20" aria-labelledby="story-heading">
        <h2 id="story-heading" className="sr-only">
          How a building is raised, moved and protected
        </h2>
        <div className="mx-auto max-w-3xl">
          <BuildingScene className="w-full" />
        </div>
        <ol className="mx-auto mt-10 grid max-w-3xl gap-6">
          {STAGES.map((s) => (
            <li key={s.id} className="border-l-2 border-accent pl-4">
              <p className="section-label">{s.label}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-1 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      aria-label="Raise, move and protect — how a building is elevated"
      className="relative"
      style={{ height: "min(500vh, 5000px)" }}
    >
      <div ref={pinRef} className="relative h-screen overflow-hidden">
        {/* Stage / progress label */}
        <div className="container-x pointer-events-none absolute inset-x-0 top-6 z-10 flex items-center justify-between">
          <span className="eyebrow">Raise. Move. Protect.</span>
          <span className="section-label tabular-nums" aria-hidden>
            {String(active + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Building scene */}
        <div className="absolute inset-0 grid place-items-center px-4">
          <BuildingScene ref={sceneRef} className="h-auto w-full max-w-[900px]" />
        </div>

        {/* Captions — cross-faded; only the active one is shown to AT */}
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-10 z-10">
          <div className="relative min-h-[132px] max-w-xl">
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
                <p className="section-label text-accent">{s.label}</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-md text-muted">{s.text}</p>
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
            <Link href="/contact#estimate" className="btn-primary">
              Request a Site Inspection
            </Link>
            <Link href="/projects" className="btn-secondary">
              See Completed Projects
            </Link>
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
