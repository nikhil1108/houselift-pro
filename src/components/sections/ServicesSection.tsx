"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { SERVICES } from "@/components/data/mockData";
import { useSmoothScroll } from "@/components/providers/LenisProvider";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveIcon } from "@/lib/icons";

export function ServicesSection(): JSX.Element {
  const { scrollTo } = useSmoothScroll();

  return (
    <section id="services" className="relative bg-slate-900 py-20 lg:py-28">
      <div className="engineering-grid absolute inset-0 opacity-40" />
      <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-sky-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Heavy structural engineering, handled end to end"
          description="From a single-storey village home to an 18,000 sq ft commercial block — we lift, shift, and re-found structures without taking them apart."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20">
          {SERVICES.map((service, index) => {
            const Icon = resolveIcon(service.iconName);

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/50 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-amber-500/40 sm:p-8"
              >
                {/* Hover sheen */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-400 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>

                  <div>
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-white sm:text-xl">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                      {service.description}
                    </p>
                  </div>
                </div>

                <ul className="relative mt-6 space-y-2.5 border-t border-slate-800/70 pt-5">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-300"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/60 p-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <p className="text-base font-semibold text-white">
              Not sure which service you need?
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Free site survey and laser structural audit — no obligation, no charges.
            </p>
          </div>
          <Button onClick={() => scrollTo("#quote")} className="shrink-0">
            Book Free Survey
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
