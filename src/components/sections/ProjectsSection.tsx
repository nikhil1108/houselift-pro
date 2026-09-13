"use client";

import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import { useState } from "react";

import { PROJECT_FILTERS, PROJECTS } from "@/components/data/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, formatNumber } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

export function ProjectsSection(): JSX.Element {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");

  const filtered =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative bg-slate-950 py-20 lg:py-28">
      <div className="engineering-grid absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Project Portfolio"
          title="600+ structures lifted across India"
          description="From compact village homes to multi-storey commercial blocks — every project is documented with before/after laser scans and a structural warranty."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {PROJECT_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                filter === option.value
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-amber"
                  : "border-slate-700/60 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-300",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-xl transition-colors hover:border-sky-500/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-slate-800 to-amber-600/20" />
                <Building2 className="absolute inset-0 m-auto h-16 w-16 text-slate-700" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold leading-snug text-white">
                  {project.title}
                </h3>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3 w-3 text-amber-500" />
                  {project.city}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-800/70 pt-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Area
                    </p>
                    <p className="mt-0.5 flex items-baseline gap-0.5 font-mono text-sm font-semibold text-white">
                      {formatNumber(project.areaSqFt)}
                      <span className="text-[10px] text-slate-500">ft²</span>
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Lift
                    </p>
                    <p className="mt-0.5 flex items-baseline gap-0.5 font-mono text-sm font-semibold text-amber-400">
                      {project.liftHeightFt > 0 ? project.liftHeightFt : "—"}
                      {project.liftHeightFt > 0 ? (
                        <span className="text-[10px] text-amber-500/70">ft</span>
                      ) : null}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Days
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-sky-400">
                      {project.durationDays}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
