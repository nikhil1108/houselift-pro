import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { CONTACT_INFO, SITE_PHOTOS } from "@/components/data/mockData";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SitePhotos } from "@/components/sections/SitePhotos";
import { buildWhatsAppLink, telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Site Photo Gallery & Field Operations Archive | RR and Sons Building Solution",
  description:
    "Direct unedited field photographs of house lifting, building relocation, and foundation repairs across India. Inspect real mechanical jacks under load, RCC pillars, and national media coverage.",
  keywords: [
    "house lifting gallery",
    "building shifting photos",
    "structural elevation proof",
    "house lifting photos India",
    "Salem house lift",
    "Kolkata house lift",
    "Haridwar house lift",
    "temple lifting photos",
    "RCC beam jacketing",
  ],
};

export default function GalleryPage(): JSX.Element {
  return (
    <>
      <a
        href="#gallery-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-amber-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to gallery
      </a>

      <Header />

      <main id="gallery-content" className="overflow-x-hidden w-full max-w-full">
        {/* Gallery Page Hero Header */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-900 via-ink to-slate-950 text-white py-14 sm:py-20 lg:py-24">
          {/* Engineering Blueprint Grid Background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Radial amber glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
              <Link href="/" className="transition-colors hover:text-amber-400">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-amber-400 font-semibold">Site Photo Gallery</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                Unedited Field Photographic Proof · Pan-India Operations
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Site Photo Gallery &amp;{" "}
                <span className="text-amber-400">Field Operations Archive.</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
                Direct field photographs from live structural elevations, building shifts, and foundation
                casting across India. Click any photograph to view high-resolution details, jack arrays,
                load-bearing brick piers, and national media coverage.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-white/10 pt-8">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-amber-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">Track Record</span>
                </div>
                <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">1500+</div>
                <p className="mt-0.5 text-xs text-slate-400">Structures lifted safely</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-amber-400">
                  <Camera className="h-4 w-4" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">Photo Archive</span>
                </div>
                <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">{SITE_PHOTOS.length}+ Photos</div>
                <p className="mt-0.5 text-xs text-slate-400">From verified job sites</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-amber-400">
                  <MapPin className="h-4 w-4" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">Coverage</span>
                </div>
                <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">Pan-India</div>
                <p className="mt-0.5 text-xs text-slate-400">From TN to Assam &amp; Punjab</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-amber-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">Safety Guarantee</span>
                </div>
                <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">100%</div>
                <p className="mt-0.5 text-xs text-slate-400">On legal stamp agreement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Site Photos Archive with Categories & Full Lightbox */}
        <SitePhotos />

        {/* Survey & Consultation Call to Action */}
        <section className="relative overflow-hidden border-t border-slate-200 bg-amber-50/80 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-amber-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-amber-800">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                    Complimentary Engineering Evaluation
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                    Need your house or building lifted above the road?
                  </h2>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
                    Our structural engineers will assess your foundation, soil condition, and road elevation
                    difference anywhere in India. Get a certified feasibility report and transparent cost breakdown.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                  <Link
                    href="/#quote"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-700 hover:shadow-lg active:scale-98"
                  >
                    <span>Request Free Survey</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href={buildWhatsAppLink(
                      CONTACT_INFO.whatsapp,
                      "Hello RR & Sons — I saw your site photo gallery and would like to inquire about lifting my house.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 shadow-sm transition-all hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    <span>WhatsApp Inquiry</span>
                  </a>

                  <a
                    href={telHref(CONTACT_INFO.phonePrimary)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-slate-50"
                  >
                    <Phone className="h-4 w-4 text-amber-600" />
                    <span>{CONTACT_INFO.phonePrimary}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <FloatingActions />
    </>
  );
}
