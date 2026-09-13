"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

import { TESTIMONIALS } from "@/components/data/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TestimonialsSection(): JSX.Element {
  return (
    <section id="testimonials" className="relative bg-slate-900 py-20 lg:py-28">
      <div className="engineering-grid-dense absolute inset-0 opacity-40" />
      <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-amber-500/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client Testimonials"
          title="What our customers say after the lift"
          description="Real feedback from homeowners and business owners across India who trusted us to lift their structures."
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/60 p-6 backdrop-blur-xl transition-colors hover:border-amber-500/30 sm:p-7"
            >
              <Quote className="absolute -right-4 -top-4 h-24 w-24 text-amber-500/10" />

              <div className="relative flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              <blockquote className="relative mt-5 text-sm leading-relaxed text-slate-300">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="relative mt-6 border-t border-slate-800/70 pt-5">
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-700">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-300">
                      {testimonial.name.split(" ").filter(Boolean).pop()?.charAt(0) || "K"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{testimonial.city}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-slate-800/50 bg-slate-900/50 px-3 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    Project
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-amber-400">
                    {testimonial.project}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
