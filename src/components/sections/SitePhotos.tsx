import Image from "next/image";

import { SITE_PHOTOS } from "@/components/data/mockData";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Site photographs, shown as-is.
 *
 * Complements the documented plates in `Gallery`: that section pairs a photo
 * with lift heights, jack counts and durations, so it only carries frames whose
 * figures are confirmed. This one carries every photograph in the set with
 * nothing asserted beyond what is visible, which is why the copy stays
 * descriptive and there is no spec table or filter rail.
 *
 * Deliberately a server component — no lightbox, no filtering, no state.
 */
export function SitePhotos(): JSX.Element {
  return (
    <section
      id="site-photos"
      className="border-b border-slate-200 bg-slate-50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="From our sites"
            title="Site photographs"
            description="Unedited frames from live lifts — jacks under load, plinths part-built, structures travelling on track. Straight from the crews, no staging."
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SITE_PHOTOS.map((photo, index) => (
            <Reveal
              key={photo.id}
              delayMs={Math.min(index, 5) * 60}
              className="h-full"
            >
              <figure className="group relative h-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                {/* Aspect lives on the wrapper — a `fill` image has no
                    intrinsic height to contribute. */}
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
                  />
                </div>

                <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-500">
                  {photo.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-xs text-slate-400">
          {SITE_PHOTOS.length} photographs · more added as jobs complete
        </p>
      </div>
    </section>
  );
}
