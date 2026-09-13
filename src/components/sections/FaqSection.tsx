"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { FAQ_ITEMS } from "@/components/data/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FaqSection(): JSX.Element {
  return (
    <section id="faq" className="relative bg-slate-950 py-20 lg:py-28">
      <div className="engineering-grid absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything you wanted to ask before lifting"
          description="Straight answers on cost, safety, timelines, and what actually happens to your house during the lift."
        />

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.7 }}
          className="mt-12"
        >
          <Accordion.Root type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <Accordion.Item
                key={item.id}
                value={item.id}
                className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-xl transition-colors data-[state=open]:border-amber-500/40"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-800/30 sm:px-6 sm:py-5">
                    <span className="text-sm font-semibold leading-snug text-white group-data-[state=open]:text-amber-300 sm:text-[15px]">
                      {item.question}
                    </span>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-amber-400" />
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="border-t border-slate-800/60 px-5 py-4 text-sm leading-relaxed text-slate-400 sm:px-6 sm:py-5">
                    {item.answer}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  );
}
