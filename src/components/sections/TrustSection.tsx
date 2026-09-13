"use client";

import { motion } from "framer-motion";

import { TRUST_POINTS } from "@/components/data/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveIcon } from "@/lib/icons";

export function TrustSection(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
      <div className="engineering-grid absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why RR AND SONS"
          title="Lifting a house is a one-shot operation. There is no undo."
          description="That is exactly why we over-engineer every safeguard — certified engineers, insured projects, and instrumentation on every jack."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {TRUST_POINTS.map((point, index) => {
            const Icon = resolveIcon(point.iconName);

            return (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/45 p-6 backdrop-blur-xl transition-colors hover:border-sky-500/40"
              >
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/25 bg-sky-500/10 text-sky-400">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-5 text-base font-bold leading-snug tracking-tight text-white">
                  {point.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
