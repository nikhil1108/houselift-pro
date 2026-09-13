"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { PRESENCE_CITIES, TESTIMONIALS } from "@/components/data/mockData";
import { Badge } from "@/components/ui/Badge";
import { PresenceMap } from "@/components/ui/PresenceMap";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const TOTAL_PROJECTS = PRESENCE_CITIES.reduce(
  (sum, city) => sum + city.projects,
  0,
);

export function Testimonials(): JSX.Element {
  const [index, setIndex] = useState(0);

  /** Paging wraps in both directions, so neither control ever dead-ends. */
  const page = useCallback((delta: number): void => {
    setIndex(
      (previous) =>
        (previous + delta + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  }, []);

  return (
    <section id="testimonials" className="border-b border-slate-200 bg-white py-12 sm:py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        

        <div className="mt-8 sm:mt-16 grid items-start gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Carousel */}
          <Reveal>
            <div
              role="group"
              aria-roledescription="carousel"
              aria-label="Client testimonials"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  page(-1);
                } else if (event.key === "ArrowRight") {
                  event.preventDefault();
                  page(1);
                }
              }}
              className="rounded-xl border border-slate-200/80 bg-canvas p-4 sm:p-8 shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
            >
              {/* The track is a flex row, so its height settles on the longest
                  quote once and never changes as slides page. */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {TESTIMONIALS.map((testimonial, slide) => {
                    const current = slide === index;

                    return (
                      <article
                        key={testimonial.id}
                        aria-roledescription="slide"
                        aria-label={`${slide + 1} of ${TESTIMONIALS.length}`}
                        aria-hidden={!current}
                        className={cn(
                          "flex w-full shrink-0 flex-col px-0.5 transition-opacity duration-500",
                          current ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: testimonial.rating }, (_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-400 text-amber-400"
                                aria-hidden
                              />
                            ))}
                            <span className="sr-only">
                              {testimonial.rating} out of 5
                            </span>
                          </div>
                          <Quote
                            className="h-8 w-8 shrink-0 text-slate-200"
                            aria-hidden
                          />
                        </div>

                        <blockquote className="mt-5 flex-1 text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
                          &ldquo;{testimonial.quote}&rdquo;
                        </blockquote>

                        <footer className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                          <div className="flex items-center gap-3.5">
                            {testimonial.avatar ? (
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-sm ring-2 ring-amber-500/20">
                                <Image
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 ring-2 ring-slate-300">
                                {testimonial.name.split(" ").filter(Boolean).pop()?.charAt(0) || "K"}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-ink">
                                {testimonial.name}
                              </p>
                              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
                                {testimonial.city}
                              </p>
                            </div>
                          </div>
                          <Badge variant="default">{testimonial.project}</Badge>
                        </footer>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2">
                  {TESTIMONIALS.map((testimonial, slide) => (
                    <button
                      key={testimonial.id}
                      type="button"
                      onClick={() => setIndex(slide)}
                      aria-label={`Show testimonial ${slide + 1}: ${testimonial.name}`}
                      aria-current={slide === index}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
                        slide === index
                          ? "w-8 bg-amber-500"
                          : "w-4 bg-slate-300 hover:bg-slate-400",
                      )}
                    />
                  ))}
                  <span className="ml-2 font-mono text-[11px] tabular-nums text-slate-500">
                    {String(index + 1).padStart(2, "0")}/
                    {String(TESTIMONIALS.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => page(-1)}
                    aria-label="Previous testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => page(1)}
                    aria-label="Next testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Pan-India presence */}
          <Reveal delayMs={120}>
            <div>
              <SectionHeading
                level={3}
                eyebrow="Pan-India presence"
                title="Pan India"
                description="Crews, plant and spares are staged regionally, so a survey team reaches most sites within 48 hours of enquiry."
              />

              <div className="mt-8">
                <PresenceMap />
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-200/80 bg-slate-200">
                <div className="bg-white p-3 xs:px-4 xs:py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Cities
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-xl font-bold text-ink">
                    {PRESENCE_CITIES.length}
                  </dd>
                </div>
                <div className="bg-white p-3 xs:px-4 xs:py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Projects
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-xl font-bold text-ink">
                    {TOTAL_PROJECTS}
                  </dd>
                </div>
                <div className="bg-white p-3 xs:px-4 xs:py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Response
                  </dt>
                  <dd className="nums mt-1.5 font-mono text-xl font-bold text-ink">
                    48
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      hrs
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
