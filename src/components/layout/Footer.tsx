"use client";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { CONTACT_INFO, NAV_LINKS, SERVICES } from "@/components/data/mockData";
import { LogoMark } from "@/components/ui/LogoMark";
import {
  FacebookOriginalIcon,
  InstagramOriginalIcon,
  YoutubeOriginalIcon,
} from "@/components/ui/SocialIcons";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { telHref } from "@/lib/utils";

/**
 * TODO(owner): VERIFY BEFORE LAUNCH. These four values were placeholders from
 * the original template and were not in the details you supplied. A published
 * GSTIN or ISO number that isn't yours is a legal exposure, not a copy nit —
 * replace each with the real figure or delete the row outright.
 */
const CERTIFICATIONS: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Quality", value: "ISO 9001:2015" },
  { label: "Registration", value: "MSME / Udyam" },
  { label: "GSTIN", value: "06AABCU9603R1ZM" },
];

const SERVICE_STATES: string[] = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Pune",
  "Jaipur",
  "Indore",
  "Mysuru",
  "Visakhapatnam",
  "Kochi",
  "Thiruvananthapuram",
  "Coimbatore",
  "Vijayawada",
  "Bhubaneswar",
  "Salem",
  "Meerut",
  "Kollam",
  "Ernakulam",
  "Haridwar",
  "Tiruppur",
  "Rajahmundry",
  "Jorhat",
  "Guwahati",
  "Pondicherry",
  "Thrissur",
  "Sikar",
  "Dibrugarh",
  "Bhadrak",
  "Cuttack"
];

export function Footer(): JSX.Element {
  const scrollToAnchor = useAnchorScroll();

  return (
    <footer className="relative overflow-hidden bg-ink text-slate-300">
      {/* Same engineering grid as the page canvas, inverted for the dark band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="xs:col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3">
              <LogoMark onDark size="md" />
              <span className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                  RR and Sons
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-400 whitespace-nowrap">
                  Building Solution PVT LTD
                </span>
                <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">
                  Est. {CONTACT_INFO.foundedYear}
                </span>
              </span>
            </div>

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate-400">
              Mechanical House Lifting, building relocation and foundation
              strengthening. Licensed structural engineers, instrumented lifts,
              and a written ten-year warranty on every project.
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
              {CERTIFICATIONS.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-slate-300">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Social Media & Live Video channels */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Official Channels &amp; Live Videos
              </span>
              <div className="mt-3.5 flex items-center gap-3">
                <a
                  href={CONTACT_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch live house lifting videos on YouTube"
                  title="Official YouTube Channel"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-all hover:scale-110 hover:border-red-500/50 hover:bg-white/10"
                >
                  <YoutubeOriginalIcon className="h-6 w-6" />
                </a>
                <a
                  href={CONTACT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow daily project reels on Instagram"
                  title="Official Instagram Profile"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-all hover:scale-110 hover:border-pink-500/50 hover:bg-white/10"
                >
                  <InstagramOriginalIcon className="h-6 w-6" />
                </a>
                <a
                  href={CONTACT_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit RR &amp; Sons on Facebook"
                  title="Official Facebook Page"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-all hover:scale-110 hover:border-blue-500/50 hover:bg-white/10"
                >
                  <FacebookOriginalIcon className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToAnchor(link.href);
                    }}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#quote"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToAnchor("#quote");
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-white transition-colors hover:text-amber-400"
                >
                  Request a survey
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
              Capabilities
            </h2>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToAnchor("#services");
                    }}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="xs:col-span-2 sm:col-span-1 lg:col-span-1">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
              Direct Contact
            </h2>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span className="flex flex-col gap-1 text-sm">
                  {CONTACT_INFO.phones.map((phone, index) => (
                    <a
                      key={phone}
                      href={telHref(phone)}
                      className={
                        index === 0
                          ? "font-mono text-white transition-colors hover:text-amber-400"
                          : "font-mono text-slate-400 transition-colors hover:text-amber-400"
                      }
                    >
                      {phone}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="break-all text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <address className="text-sm not-italic leading-relaxed text-slate-400">
                  {CONTACT_INFO.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span className="text-sm text-slate-400">
                  {CONTACT_INFO.hours}
                  <span className="mt-1 block font-mono text-xs text-emerald-400">
                    Emergency line open 24/7
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Coverage strip */}
        <div className="mt-14 border-t border-white/10 pt-8">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Projects delivered across
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
            {SERVICE_STATES.map((state) => (
              <li
                key={state}
                className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-400"
              >
                {state}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {CONTACT_INFO.foundedYear}–2026 {CONTACT_INFO.companyName}. All
            rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5 font-mono text-[11px] text-slate-400">
            <a
              href={CONTACT_INFO.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <YoutubeOriginalIcon className="h-3.5 w-3.5" />
              <span>YouTube</span>
            </a>
            <span className="text-white/20">·</span>
            <a
              href={CONTACT_INFO.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <InstagramOriginalIcon className="h-3.5 w-3.5" />
              <span>Instagram</span>
            </a>
            <span className="text-white/20">·</span>
            <a
              href={CONTACT_INFO.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <FacebookOriginalIcon className="h-3.5 w-3.5" />
              <span>Facebook</span>
            </a>
          </div>

          <p className="font-mono">
            Estimates are indicative. Final scope follows the site survey.
          </p>
        </div>
      </div>
    </footer>
  );
}
