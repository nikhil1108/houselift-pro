"use client";

import { CheckCircle2, ChevronLeft, ChevronRight, Ruler } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PROCESS_STEPS } from "@/components/data/mockData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** Blueprint datum. LIFT is in user units, which map 1:1 to CSS px here. */
const GROUND = 330;
const LIFT = 104;

/** Short technical caption drawn into the blueprint's title block. */
const PLATE_META: ReadonlyArray<{ code: string; note: string }> = [
  { code: "SURVEY", note: "Total station · settlement map" },
  { code: "TRENCH", note: "Jack layout per FEA · spreader beams" },
  { code: "LIFT", note: "25 mm passes · ±2 mm tolerance" },
  { code: "CAST", note: "M20 RCC columns (or as per requirement) · corrosion-resistant rebar" },
  { code: "HANDOVER", note: "Backfill · stability certificate" },
];

interface BlueprintProps {
  activeIndex: number;
}

/**
 * Architectural blueprint that redraws itself for the active phase.
 *
 * Rather than five separate drawings, this is one section whose parts appear,
 * extend, and grow as the phase advances — so the reader sees a single building
 * progressing rather than a slideshow. The house group is translated with a CSS
 * transform (not an SVG attribute) so the change between phases interpolates on
 * the compositor.
 */
function Blueprint({ activeIndex }: BlueprintProps): JSX.Element {
  const showLaser = activeIndex === 0;
  const showTrench = activeIndex >= 1;
  const showJacks = activeIndex >= 1 && activeIndex <= 3;
  const showPillars = activeIndex >= 3;
  const showBackfill = activeIndex === 4;
  const isLifted = activeIndex >= 2;
  // Phase 5 lowers the structure the last few mm onto the finished columns.
  const lift = activeIndex >= 4 ? LIFT - 8 : isLifted ? LIFT : 0;
  const meta = PLATE_META[activeIndex] ?? PLATE_META[0];

  const jackX: readonly number[] = [148, 236, 356, 444];
  const pillarX: readonly number[] = [186, 296, 406];

  return (
    <svg
      viewBox="0 0 560 460"
      className="h-auto w-full"
      role="img"
      aria-label={`Blueprint for stage ${activeIndex + 1} of 5: ${
        PROCESS_STEPS[activeIndex]?.title ?? "survey"
      }`}
    >
      <defs>
        <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#dbeafe" strokeWidth="1" />
        </pattern>
        <pattern
          id="bp-hatch"
          width="7"
          height="7"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke="#7dd3fc" strokeWidth="1.6" />
        </pattern>
        <pattern
          id="bp-soil"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="3" r="1" fill="#94a3b8" />
          <circle cx="8" cy="7" r="1" fill="#cbd5e1" />
        </pattern>
      </defs>

      <rect width="560" height="460" fill="#f8fbff" />
      <rect width="560" height="460" fill="url(#bp-grid)" />

      {/* Drawing frame + title block, so the plate reads as a real sheet. */}
      <rect
        x="12"
        y="12"
        width="536"
        height="436"
        fill="none"
        stroke="#bae6fd"
        strokeWidth="2"
      />
      <g fontFamily="ui-monospace, monospace" fill="#0369a1">
        <text x="26" y="38" fontSize="13" letterSpacing="1.4">
          RR &amp; SONS · STRUCTURAL ELEVATION
        </text>
        <text x="26" y="56" fontSize="11" fill="#7dd3fc" letterSpacing="1.2">
          SHEET {String(activeIndex + 1).padStart(2, "0")}/05 · SCALE 1:100
        </text>
      </g>

      {/* Soil body below grade. */}
      <rect x="12" y={GROUND} width="536" height={448 - GROUND} fill="#eef6fd" />
      <rect
        x="12"
        y={GROUND}
        width="536"
        height={448 - GROUND}
        fill="url(#bp-soil)"
        opacity="0.5"
      />
      <line x1="12" y1={GROUND} x2="548" y2={GROUND} stroke="#0284c7" strokeWidth="2.5" />

      {/* Excavated trench under the plinth. */}
      {showTrench ? (
        <g>
          <rect
            x="118"
            y={GROUND}
            width="356"
            height="76"
            fill={showBackfill ? "url(#bp-soil)" : "#e0f2fe"}
            stroke="#38bdf8"
            strokeWidth="1.6"
            strokeDasharray={showBackfill ? "5 5" : undefined}
          />
          {!showBackfill ? (
            <text
              x="128"
              y={GROUND + 66}
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              fill="#0284c7"
            >
              TRENCH −1.8 m
            </text>
          ) : null}
        </g>
      ) : null}

      {/* New RCC columns, cast into the void the lift opened. */}
      {showPillars
        ? pillarX.map((x) => (
            <g key={`col-${x}`}>
              <rect
                x={x - 16}
                y={GROUND - LIFT}
                width="32"
                height={LIFT + 48}
                fill="#e0f2fe"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <rect
                x={x - 16}
                y={GROUND - LIFT}
                width="32"
                height={LIFT + 48}
                fill="url(#bp-hatch)"
                opacity="0.55"
              />
              {/* Rebar cage, only while it is still being cast. */}
              {activeIndex === 3
                ? [-8, 0, 8].map((offset) => (
                    <line
                      key={offset}
                      x1={x + offset}
                      y1={GROUND - LIFT + 6}
                      x2={x + offset}
                      y2={GROUND + 40}
                      stroke="#f59e0b"
                      strokeWidth="1.6"
                    />
                  ))
                : null}
            </g>
          ))
        : null}

      {/* Mechanical jacks. Removed at handover. */}
      {showJacks
        ? jackX.map((x) => (
            <g key={`jack-${x}`}>
              <rect
                x={x - 7}
                y={GROUND - (isLifted ? LIFT : 14)}
                width="14"
                height={isLifted ? LIFT : 14}
                fill="#bae6fd"
                stroke="#0369a1"
                strokeWidth="1.8"
                style={{
                  transition: "height 700ms cubic-bezier(0.22, 1, 0.36, 1), y 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
              <rect x={x - 15} y={GROUND} width="30" height="26" fill="#0369a1" rx="2" />
              <path
                d={`M${x + 15} ${GROUND + 8} q 20 0 20 18`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          ))
        : null}

      {/* The structure. One group, one transform — this is what moves. */}
      <g
        style={{
          transform: `translateY(${-lift}px)`,
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <rect
          x="118"
          y={GROUND - 18}
          width="356"
          height="18"
          fill="#e0f2fe"
          stroke="#0369a1"
          strokeWidth="2"
        />
        <rect
          x="132"
          y={GROUND - 158}
          width="328"
          height="140"
          fill="#ffffff"
          stroke="#0369a1"
          strokeWidth="2.4"
        />
        <line
          x1="132"
          y1={GROUND - 88}
          x2="460"
          y2={GROUND - 88}
          stroke="#7dd3fc"
          strokeWidth="1.8"
        />
        {[0, 1, 2].map((i) => (
          <g key={`w-${i}`} fill="none" stroke="#7dd3fc" strokeWidth="1.8">
            <rect x={162 + i * 104} y={GROUND - 142} width="60" height="40" />
            <rect x={162 + i * 104} y={GROUND - 72} width="60" height="40" />
          </g>
        ))}
        <path
          d={`M118 ${GROUND - 158} L296 ${GROUND - 202} L474 ${GROUND - 158} Z`}
          fill="#f0f9ff"
          stroke="#0369a1"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </g>

      {/* Phase 1 — total station and laser sight lines. */}
      {showLaser ? (
        <g>
          <path
            d={`M64 ${GROUND} L52 ${GROUND - 46} L76 ${GROUND - 46} Z`}
            fill="none"
            stroke="#475569"
            strokeWidth="2"
          />
          <rect x="52" y={GROUND - 66} width="24" height="20" fill="#475569" rx="2" />
          <g stroke="#d97706" strokeWidth="1.6" strokeDasharray="6 5">
            <line x1="78" y1={GROUND - 58} x2="132" y2={GROUND - 158} />
            <line x1="78" y1={GROUND - 58} x2="296" y2={GROUND - 202} />
            <line x1="78" y1={GROUND - 58} x2="474" y2={GROUND - 18} />
          </g>
          <text
            x="30"
            y={GROUND + 24}
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            fill="#475569"
          >
            SCAN
          </text>
        </g>
      ) : null}

      {/* Lift dimension: shown from the moment the structure leaves grade. */}
      {isLifted ? (
        <g
          stroke="#d97706"
          strokeWidth="2.2"
          fontFamily="ui-monospace, monospace"
          fill="#b45309"
        >
          <line x1="502" y1={GROUND} x2="502" y2={GROUND - lift} />
          <line x1="494" y1={GROUND} x2="510" y2={GROUND} />
          <line x1="494" y1={GROUND - lift} x2="510" y2={GROUND - lift} />
          <text x="466" y={GROUND - lift - 10} fontSize="11" stroke="none">
            +5.5 ft
          </text>
        </g>
      ) : null}

      {/* Phase 3 — synchronised movement arrows at each jack point. */}
      {activeIndex === 2
        ? jackX.map((x) => (
            <g key={`arrow-${x}`} stroke="#d97706" strokeWidth="2.2" fill="none">
              <line x1={x} y1={GROUND - LIFT - 22} x2={x} y2={GROUND - LIFT - 52} />
              <path
                d={`M${x - 6} ${GROUND - LIFT - 44} L${x} ${GROUND - LIFT - 54} L${x + 6} ${GROUND - LIFT - 44}`}
                strokeLinejoin="round"
              />
            </g>
          ))
        : null}

      {/* Title block. */}
      <g>
        <rect
          x="12"
          y="404"
          width="536"
          height="44"
          fill="#e0f2fe"
          stroke="#bae6fd"
          strokeWidth="2"
        />
        <text
          x="26"
          y="424"
          fontSize="12"
          fontFamily="ui-monospace, monospace"
          fill="#0c4a6e"
          letterSpacing="1.6"
        >
          {meta?.code}
        </text>
        <text
          x="26"
          y="440"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          fill="#0284c7"
        >
          {meta?.note}
        </text>
      </g>
    </svg>
  );
}

export function ProcessTimeline(): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const jumpToStep = (targetIndex: number): void => {
    const clamped = Math.max(0, Math.min(PROCESS_STEPS.length - 1, targetIndex));
    setActiveIndex(clamped);

    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const start = scrollY + rect.top;
    const totalDistance = rect.height - window.innerHeight;
    if (totalDistance > 0) {
      const targetScroll =
        start + ((clamped + 0.3) / PROCESS_STEPS.length) * totalDistance;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let mounted = true;

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
          ScrollTrigger.create({
            trigger: rootRef.current!,
            start: "top top",
            end: "bottom bottom",
            pin: pinRef.current!,
            scrub: isMobile ? 0.3 : 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                PROCESS_STEPS.length - 1,
                Math.floor(self.progress * PROCESS_STEPS.length),
              );
              setActiveIndex(idx);
            },
          });
        };

        mm.add("(max-width: 767px)", () => build(true));
        mm.add("(min-width: 768px)", () => build(false));
      });
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="process"
      aria-label="Five-stage engineering sequence"
      className="relative w-full max-w-full overflow-hidden border-b border-slate-200 bg-canvas"
      style={{ height: "350vh" }}
    >
      <div
        ref={pinRef}
        className="relative flex h-screen w-full max-w-full flex-col justify-center overflow-hidden py-2 sm:py-6 lg:py-8"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our process"
            title="Five-stage engineering sequence"
            description="Scroll to advance through each stage — the blueprint and engineering cards update in lockstep as each phase progresses."
            centered
            className="[&_h2]:text-xl sm:[&_h2]:text-4xl [&_p.mt-4]:hidden sm:[&_p.mt-4]:block [&_p.mb-3]:mb-1 sm:[&_p.mb-3]:mb-3"
          />

          <div className="mt-3 grid items-center gap-3 xs:gap-4 sm:mt-8 sm:gap-8 lg:mt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            {/* Left: Live Blueprint */}
            <div className="flex flex-col">
              <div className="mx-auto w-full max-w-lg overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-panel lg:max-w-none">
                <div className="mb-1.5 sm:mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5 sm:pb-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                    </span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Live Sequence: Phase {activeIndex + 1} of 5
                    </span>
                  </div>
                  <span className="rounded bg-amber-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-700">
                    {PROCESS_STEPS[activeIndex]?.badge ?? "ENGINEERED"}
                  </span>
                </div>
                <Blueprint activeIndex={activeIndex} />
              </div>

              {/* Interactive Stage scrubber pills */}
              <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                {PROCESS_STEPS.map((step, index) => (
                  <button
                    key={`pill-${step.id}`}
                    type="button"
                    onClick={() => jumpToStep(index)}
                    aria-label={`Jump to stage ${index + 1}: ${step.title}`}
                    className={cn(
                      "rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition-all duration-200 sm:px-3 sm:py-1.5 sm:text-xs",
                      activeIndex === index
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105"
                        : "border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {index + 1}. {step.title.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: ONLY ONE STEP CARD COMES AT ONCE! */}
            <div className="relative flex flex-col justify-center">
              {/* Animated Card Viewport */}
              <div className="relative h-[295px] xs:h-[310px] sm:h-[360px] md:h-[380px] w-full max-w-xl mx-auto lg:max-w-none">
                {PROCESS_STEPS.map((step, index) => {
                  const isActive = activeIndex === index;
                  const isPast = activeIndex > index;

                  return (
                    <article
                      key={step.id}
                      id={`step-${step.id}`}
                      aria-hidden={!isActive}
                      className={cn(
                        "absolute inset-0 flex flex-col justify-between rounded-xl sm:rounded-2xl border bg-white p-3.5 xs:p-4 sm:p-7 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive
                          ? "z-10 opacity-100 translate-y-0 scale-100 border-amber-500/90 ring-4 ring-amber-500/10 pointer-events-auto"
                          : isPast
                            ? "pointer-events-none z-0 opacity-0 -translate-y-8 scale-95 border-slate-200"
                            : "pointer-events-none z-0 opacity-0 translate-y-8 scale-95 border-slate-200",
                      )}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                          <div className="flex items-start gap-2.5 sm:gap-3.5">
                            <span className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 font-mono text-xs sm:text-base font-bold text-white shadow-md shadow-amber-500/30">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <div>
                              <h3 className="text-sm font-bold leading-tight tracking-tight text-ink sm:text-xl md:text-2xl">
                                {step.title}
                              </h3>
                              <p className="mt-0.5 sm:mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-700 sm:text-xs">
                                {step.subtitle}
                              </p>
                            </div>
                          </div>

                          <Badge variant="accent" className="shrink-0 text-[10px] sm:text-xs">
                            {step.badge}
                          </Badge>
                        </div>

                        <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-slate-700 line-clamp-3 sm:line-clamp-none">
                          {step.description}
                        </p>

                        <div className="mt-2 sm:mt-4 rounded-lg sm:rounded-xl border border-amber-500/20 bg-amber-50/50 p-2 sm:p-3.5">
                          <p className="flex items-start gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs leading-relaxed text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-emerald-600" />
                            <span>{step.technicalDetail}</span>
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Step dots and Prev/Next navigation */}
                      <div className="mt-2 sm:mt-4 flex items-center justify-between border-t border-slate-100 pt-2 sm:pt-4">
                        <div className="flex items-center gap-1.5">
                          {PROCESS_STEPS.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => jumpToStep(dotIdx)}
                              aria-label={`Go to stage ${dotIdx + 1}`}
                              className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                dotIdx === activeIndex
                                  ? "w-6 bg-amber-500 shadow-sm"
                                  : "w-2 bg-slate-200 hover:bg-slate-300",
                              )}
                            />
                          ))}
                          <span className="ml-2 font-mono text-[10px] font-semibold text-slate-500 sm:text-xs">
                            {activeIndex + 1} / {PROCESS_STEPS.length}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={activeIndex === 0}
                            onClick={() => jumpToStep(activeIndex - 1)}
                            className="h-7 sm:h-8 px-2 text-xs"
                          >
                            <ChevronLeft className="h-4 w-4 mr-0.5" />
                            Prev
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={activeIndex === PROCESS_STEPS.length - 1}
                            onClick={() => jumpToStep(activeIndex + 1)}
                            className="h-7 sm:h-8 px-2.5 text-xs font-medium border-amber-500/40 text-amber-900 hover:bg-amber-50"
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <p className="mt-2 sm:mt-4 hidden xs:flex items-center justify-center gap-2 font-mono text-xs text-slate-500 sm:justify-start">
                <Ruler className="h-3.5 w-3.5 text-hydraulic-600" />
                Typical 30-day programme · longer for multi-storey commercial
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
