"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CONTACT_INFO } from "@/components/data/mockData";
import { buildWhatsAppLink, cn, telHref } from "@/lib/utils";

const WHATSAPP_MESSAGE =
  "Hello RR & Sons — I'd like to enquire about house lifting. Could you share details and arrange a site survey?";

/**
 * Persistent call / WhatsApp actions.
 *
 * Deliberately absent over the hero (which already carries both CTAs) and
 * revealed only once the reader has moved past it, so the first impression
 * isn't cluttered. Visibility is derived from an IntersectionObserver on a
 * sentinel rather than a scroll position, so there's no per-frame work and
 * nothing to recalculate on resize.
 */
export function FloatingActions(): JSX.Element {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sits roughly one viewport down; once it's above the fold, show. */}
      <div ref={sentinelRef} aria-hidden className="absolute top-[85vh] h-px w-full" />

      <div
        className={cn(
          "fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-300 sm:bottom-6 sm:right-6",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <a
          href={buildWhatsAppLink(CONTACT_INFO.whatsapp, WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg transition-all hover:shadow-xl sm:pr-5"
        >
          <MessageCircle className="h-6 w-6 shrink-0" />
          <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
        </a>

        <a
          href={telHref(CONTACT_INFO.phonePrimary)}
          aria-label={`Call ${CONTACT_INFO.phonePrimary}`}
          className="group flex items-center gap-3 rounded-full bg-amber-600 py-3 pl-3 pr-4 text-white shadow-amber transition-all hover:bg-amber-700 hover:shadow-xl sm:pr-5"
        >
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 motion-reduce:hidden" />
            <Phone className="relative h-5 w-5" />
          </span>
          <span className="hidden text-sm font-semibold sm:inline">Call Now</span>
        </a>
      </div>
    </>
  );
}
