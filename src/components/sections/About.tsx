import { Award, Gavel, UserRound } from "lucide-react";
import Image from "next/image";

import { CONTACT_INFO, CONTACT_PEOPLE } from "@/components/data/mockData";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Who we are.
 *
 * Two claims here are checkable by a prospect and therefore have to be worded
 * exactly: the 90° rotation record, and the safety agreement. Both are stated
 * as what the company holds rather than dressed up — an inflated version of a
 * real record is worse than the record itself.
 *
 * Note the experience figure is "combined across both founders" everywhere it
 * appears. The firm was established in 2013; conflating the two numbers would
 * be the easiest thing on this page to get caught on.
 *
 * Server component — no state.
 */

const HIGHLIGHTS: ReadonlyArray<{
  id: string;
  icon: typeof Award;
  title: string;
  body: string;
}> = [
    {
      id: "record",
      icon: Award,
      title: "A national first",
      body: "The first company in India to rotate a building through a full 90°, recognised in the India Book of Records and the Indian World Record Book. Rotation is the hardest case in this trade: the structure has to stay rigid while its entire bearing geometry changes.",
    },
    {
      id: "agreement",
      icon: Gavel,
      title: "100% safety agreement",
      body: "Every project is executed against a written safety agreement on court documentation. Lifting a building is irreversible once it starts, so your protection is a legal instrument you can hold us to — not a line in a brochure.",
    },
  ];

export function About(): JSX.Element {
  const tradingYears = 2026 - CONTACT_INFO.foundedYear;

  return (
    <section
      id="about"
      className="border-b border-slate-200 bg-canvas py-12 sm:py-16 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="About us"
                title={`Two engineers, ${tradingYears} years of lifting the houses`}
                description={`${CONTACT_INFO.companyName} was established in ${CONTACT_INFO.foundedYear} by a civil engineer and a mechanical engineer, with over 20 years of combined experience in house lifting and structural engineering between them. That pairing is the whole approach: one discipline reads the building, the other drives the jacks.`}
              />
            </Reveal>

            <Reveal delayMs={80}>
              <div className="mt-8 rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Engineering Commitment
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Every site is personally surveyed, engineered, and supervised by our founding partners. We never subcontract structural lifting or foundation casting.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            {HIGHLIGHTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.id} delayMs={120 + index * 80} className="h-full">
                  <article className="h-full rounded-xl border border-slate-200/80 bg-white p-5 shadow-panel sm:p-8">
                    <Icon className="h-6 w-6 text-amber-600" aria-hidden />
                    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Prominent Founders & Principal Engineers Showcase Banner */}
        <Reveal delayMs={160}>
          <div className="mt-10 sm:mt-14 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/70 p-5 shadow-panel sm:p-8 lg:p-10">
            <div className="mb-6 sm:mb-8 flex flex-col gap-2 border-b border-slate-200/80 pb-5 sm:pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Leadership &amp; Engineering
                </p>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-ink lg:text-3xl">
                  Meet the Founders Behind Every Lift
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-600/30 bg-amber-50 px-3.5 py-1.5 font-mono text-xs font-semibold text-amber-800">
                Civil &amp; Mechanical Engineers On Every Site
              </span>
            </div>

            <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
              {CONTACT_PEOPLE.map((person) => (
                <div
                  key={person.id}
                  className="group relative flex flex-col xs:flex-row items-center xs:items-start gap-4 sm:gap-5 rounded-xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-xl"
                >
                  {person.photo ? (
                    <div className="relative mx-auto xs:mx-0 h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-slate-100 shadow-md ring-4 ring-amber-500/10 transition-transform duration-500 group-hover:scale-105 sm:h-36 sm:w-36">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 640px) 144px, 112px"
                      />
                    </div>
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 sm:h-36 sm:w-36"
                    >
                      <UserRound className="h-10 w-10 sm:h-12 sm:w-12" />
                    </span>
                  )}

                  <div className="flex-1 text-center xs:text-left">
                    <div className="flex flex-wrap items-center justify-center xs:justify-start gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700">
                        {person.role}
                      </span>
                      <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
                      <span className="font-mono text-[11px] font-semibold text-slate-500">
                        Co-Founder
                      </span>
                    </div>

                    <h4 className="mt-1 text-lg font-bold tracking-tight text-ink sm:mt-1.5 sm:text-2xl">
                      {person.name}
                    </h4>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {person.id === "gurdeep"
                        ? "Specializes in pre-lift structural auditing, load-bearing path analysis, and reinforced foundation design across flood-prone residential and commercial structures."
                        : "Kurukshetra University graduate. Calibrates synchronised mechanical screw-jack arrays to ±2 mm tolerance and engineered India's record-holding 90° building rotation."}
                    </p>

                    <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center xs:justify-start gap-1.5 sm:gap-2">
                      {person.id === "gurdeep" ? (
                        <>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            Structural Audits
                          </span>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            Foundation Design
                          </span>
                          <span className="rounded-md border border-amber-200 bg-amber-50/70 px-2.5 py-1 text-[11px] font-medium text-amber-800">
                            Pre-Lift Site Surveys
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            Mechanical Jacks
                          </span>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            90° Rotation Lead
                          </span>
                          <span className="rounded-md border border-amber-200 bg-amber-50/70 px-2.5 py-1 text-[11px] font-medium text-amber-800">
                            Kurukshetra Univ
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
