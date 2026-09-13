"use client";

import { useMemo, useState } from "react";

import { PROJECTS, PROJECT_FILTERS } from "@/components/data/mockData";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/types";

type FilterValue = ProjectCategory | "all";

export function Projects(): JSX.Element {
  const [filter, setFilter] = useState<FilterValue>("all");

  const visible = useMemo<Project[]>(
    () =>
      filter === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === filter),
    [filter],
  );

  return (
    <section id="projects" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent projects"
            description="A sample of completed lifts and relocations across residential, commercial, and heritage structures."
          />
        </Reveal>

        {/* Filter tabs */}
        <Reveal>
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="mt-10 flex flex-wrap gap-2"
          >
            {PROJECT_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "rounded border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                  filter === option.value
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Project table on desktop, cards on mobile */}
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="hidden w-full text-left sm:table">
            <caption className="sr-only">
              Completed house lifting and relocation projects
            </caption>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Project
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Area
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Lift
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-medium text-ink"
                  >
                    {project.title}
                  </th>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {project.city}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-700">
                    {project.areaSqFt.toLocaleString("en-IN")} sq ft
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-700">
                    {project.liftHeightFt === 0
                      ? "Horizontal"
                      : `${project.liftHeightFt} ft`}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-700">
                    {project.durationDays} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile card list */}
          <ul className="divide-y divide-slate-100 sm:hidden">
            {visible.map((project) => (
              <li key={project.id} className="p-5">
                <p className="text-sm font-semibold text-ink">{project.title}</p>
                <p className="mt-1 text-xs text-slate-600">{project.city}</p>
                <dl className="mt-3 grid grid-cols-3 gap-3 font-mono text-xs">
                  <div>
                    <dt className="text-slate-500">Area</dt>
                    <dd className="mt-0.5 text-slate-800">
                      {project.areaSqFt.toLocaleString("en-IN")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Lift</dt>
                    <dd className="mt-0.5 text-slate-800">
                      {project.liftHeightFt === 0
                        ? "Horiz."
                        : `${project.liftHeightFt} ft`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Days</dt>
                    <dd className="mt-0.5 text-slate-800">
                      {project.durationDays}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
