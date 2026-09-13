import {
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
  UserRound,
  Video,
} from "lucide-react";
import Image from "next/image";

import {
  CONTACT_INFO,
  CONTACT_PEOPLE,
  HEAD_OFFICE,
} from "@/components/data/mockData";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FacebookOriginalIcon,
  InstagramOriginalIcon,
  YoutubeOriginalIcon,
} from "@/components/ui/SocialIcons";
import { telHref } from "@/lib/utils";

/**
 * Where to find us.
 *
 * The embedded map is OpenStreetMap's own `export/embed.html` frame — free,
 * keyless, and fully interactive (pan and zoom) without shipping a mapping
 * library. Google Maps' equivalent embed needs an API key and a billing
 * account, so OSM is the default; see PresenceMap for the same reasoning
 * applied to the coverage map.
 *
 * The directions links deliberately query the *written address* rather than
 * the coordinate pair. If the pin in `HEAD_OFFICE` is a few hundred metres
 * out, a text search still lands the driver at the right place.
 *
 * Server component — nothing here needs state.
 */

const { lat, lng, spanDeg } = HEAD_OFFICE;

/** OSM's embed frame is bounded by a box, not a zoom level. */
const BBOX = [lng - spanDeg, lat - spanDeg, lng + spanDeg, lat + spanDeg]
  .map((value) => value.toFixed(4))
  .join(",");

const EMBED_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${lat},${lng}`;

const ADDRESS_QUERY = encodeURIComponent(
  `${CONTACT_INFO.companyName}, ${HEAD_OFFICE.addressLine}`,
);
const GOOGLE_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS_QUERY}`;
const OSM_LARGER_MAP = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;

/** Already split in the data layer, so the address reads as a postal block. */
const ADDRESS_LINES: readonly string[] = CONTACT_INFO.addressLines;

export function OfficeLocation(): JSX.Element {
  return (
    <section
      id="office"
      className="border-b border-slate-200 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Visit us"
            title="Our office & equipment yard"
            description="Jacks, gantries and the survey team all work out of one base in Nilokheri, Karnal district. Walk in during working hours, or call ahead and we will have an engineer free to talk through your building."
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Map */}
          <Reveal className="lg:col-span-3">
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 shadow-panel">
              <iframe
                src={EMBED_SRC}
                title={`Map showing ${HEAD_OFFICE.label} at ${HEAD_OFFICE.addressLine}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full flex-1 border-0 bg-slate-100 sm:h-[420px] lg:min-h-[460px]"
              />
              <p className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
                <span>
                  Map data ©{" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline hover:text-ink"
                  >
                    OpenStreetMap
                  </a>{" "}
                  contributors
                </span>
                <a
                  href={OSM_LARGER_MAP}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-medium hover:text-ink"
                >
                  View larger map
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </p>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delayMs={100} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-canvas p-6 shadow-panel sm:p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600">
                {HEAD_OFFICE.label}
              </p>

              <address className="mt-5 flex gap-3 not-italic">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="text-sm leading-relaxed text-slate-700">
                  {ADDRESS_LINES.map((line, index) => (
                    /* Index key is correct here: the list is a fixed, ordered
                       constant and segments could legitimately repeat. */
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </address>

              <dl className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                <div className="flex gap-3">
                  <dt className="sr-only">Phone</dt>
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <dd className="flex flex-col gap-1 text-sm">
                    {CONTACT_INFO.phones.map((phone, index) => (
                      <a
                        key={phone}
                        href={telHref(phone)}
                        className={
                          index === 0
                            ? "font-mono font-medium text-ink transition-colors hover:text-amber-700"
                            : "font-mono text-slate-500 transition-colors hover:text-amber-700"
                        }
                      >
                        {phone}
                      </a>
                    ))}
                  </dd>
                </div>

                <div className="flex gap-3">
                  <dt className="sr-only">Email</dt>
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <dd className="text-sm">
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="break-all text-slate-700 transition-colors hover:text-amber-700"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </dd>
                </div>

                <div className="flex gap-3">
                  <dt className="sr-only">Ask for</dt>
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <dd className="space-y-2.5 text-sm">
                    {CONTACT_PEOPLE.map((person) => (
                      <div key={person.id} className="flex items-center gap-2.5">
                        {person.photo ? (
                          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-200 ring-1 ring-amber-500/20">
                            <Image
                              src={person.photo}
                              alt={person.name}
                              fill
                              className="object-cover"
                              sizes="28px"
                            />
                          </div>
                        ) : null}
                        <div>
                          <span className="font-semibold text-ink">{person.name}</span>
                          <span className="block font-mono text-[11px] text-slate-500">
                            {person.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </dd>
                </div>

                <div className="flex gap-3">
                  <dt className="sr-only">Opening hours</dt>
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <dd className="text-sm text-slate-700">
                    {CONTACT_INFO.hours}
                    <span className="mt-1 block font-mono text-xs text-emerald-600">
                      Emergency line open 24/7
                    </span>
                  </dd>
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-3">
                  <dt className="sr-only">Official Channels</dt>
                  <Video className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <dd className="text-xs text-slate-600">
                    <span className="font-medium text-ink">Live Site Footage:</span>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <a
                        href={CONTACT_INFO.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-ink"
                      >
                        <YoutubeOriginalIcon className="h-3.5 w-3.5" /> YouTube
                      </a>
                      <a
                        href={CONTACT_INFO.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-ink"
                      >
                        <InstagramOriginalIcon className="h-3.5 w-3.5" /> Instagram
                      </a>
                      <a
                        href={CONTACT_INFO.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-ink"
                      >
                        <FacebookOriginalIcon className="h-3.5 w-3.5" /> Facebook
                      </a>
                    </div>
                  </dd>
                </div>
              </dl>

              {/* Pushed to the bottom so the card's CTA aligns with the map's
                  lower edge on wide screens regardless of address length. */}
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Button asChild className="w-full">
                  <a href={GOOGLE_DIRECTIONS} target="_blank" rel="noreferrer noopener">
                    <Navigation className="h-4 w-4" aria-hidden />
                    Get directions
                  </a>
                </Button>
                <p className="text-center font-mono text-[11px] text-slate-400">
                  Opens in Google Maps
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
