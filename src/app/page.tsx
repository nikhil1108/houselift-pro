import ScrolableAnimation from "@/components/animations/ScrolableAnimation";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Comparison } from "@/components/sections/Comparison";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { OfficeLocation } from "@/components/sections/OfficeLocation";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { Services } from "@/components/sections/Services";
import { StiltParking } from "@/components/sections/StiltParking";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trust } from "@/components/sections/Trust";

/**
 * Single-page composition.
 *
 * Section order follows the reader's questions in the order they ask them:
 * what happened to my house → can it be fixed → how → prove it → who says so →
 * what if I'm unsure → talk to us. Anchors match NAV_LINKS exactly
 * (#services, #simulator, #process, #gallery, #testimonials) so every header
 * link resolves.
 */
export default function HomePage(): JSX.Element {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-amber-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="overflow-x-hidden w-full max-w-full">
        <Hero />

        {/* Pinned GSAP storyboard: one house, seven stages, scrubbed.
            Sits directly under the hero — it is the clearest explanation
            of the service, so it earns the first scroll. Carries the
            #simulator anchor for the header's Simulator link. */}
        <ScrolableAnimation />


        {/* Ten documented plates with lightbox. */}
        <Gallery />



        {/* Sticky blueprint: how the lift is sequenced. */}
        <ProcessTimeline />



        <Services />


        {/* The problem, made tangible before any sales copy. */}
        <Comparison />

        {/* Self-playing clip: the lift re-purposed as covered parking. */}
        <StiltParking />


        {/* The raw photograph set, straight from public/gallery. Sits directly
            after the documented plates: same proof, no figures attached. */}
        {/* <SitePhotos /> */}

        {/* Who did all that work. Sits between the proof and the guarantees:
            the reader has just seen the sites, so this is where the founders
            and the 90° rotation record land hardest. */}
        <About />

        <Trust />

        {/* Carousel + pan-India coverage map. */}
        <Testimonials />

        {/* <FAQ /> */}

        {/* Where the yard is. Sits between the last objection and the quote
            form: by here the reader is deciding whether we are a real firm
            they could drive to, and the map answers that. */}
        <OfficeLocation />

        <QuoteSection />
      </main>

      <Footer />

      <FloatingActions />
    </>
  );
}
