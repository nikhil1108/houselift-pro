"use client";

import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";

import { CONTACT_INFO } from "@/components/data/mockData";
import { useSmoothScroll } from "@/components/providers/LenisProvider";
import { Button } from "@/components/ui/Button";

export function CtaBand(): JSX.Element {
  const { scrollTo } = useSmoothScroll();

  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 lg:py-20">
      <div className="engineering-grid-dense absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-72 w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          Every monsoon costs you more than the lift does.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Book a free laser structural audit. Our engineer visits your site, measures
          settlement, and hands you a fixed-price proposal in 48 hours.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => scrollTo("#quote")} className="w-full sm:w-auto">
            Get My Free Estimate
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <a href={`tel:${CONTACT_INFO.phonePrimary.replace(/\s/g, "")}`}>
              <PhoneCall className="h-4 w-4" />
              {CONTACT_INFO.phonePrimary}
            </a>
          </Button>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          Free survey · No obligation · Fixed-price quote
        </p>
      </motion.div>
    </section>
  );
}
