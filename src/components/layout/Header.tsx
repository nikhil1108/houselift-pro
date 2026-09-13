"use client";

import { Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { CONTACT_INFO, NAV_LINKS } from "@/components/data/mockData";
import { LogoMark } from "@/components/ui/LogoMark";
import {
  FacebookOriginalIcon,
  InstagramOriginalIcon,
  YoutubeOriginalIcon,
} from "@/components/ui/SocialIcons";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { useScrolled } from "@/hooks/useScrolled";
import { cn, telHref } from "@/lib/utils";

export function Header(): JSX.Element {
  const { sentinelRef, scrolled } = useScrolled();
  const scrollToAnchor = useAnchorScroll();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Lock body scroll while the mobile drawer is open, restoring whatever the
  // previous value was rather than blindly clearing it.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const handleNavigate = useCallback(
    (href: string): void => {
      setMenuOpen(false);
      scrollToAnchor(href);
    },
    [scrollToAnchor],
  );

  return (
    <>
      {/* Observed marker — gives us "has scrolled" without a scroll listener. */}
      <div ref={sentinelRef} aria-hidden className="absolute top-0 h-px w-full" />

      <header className="sticky top-0 z-50">
        {/* Emergency helpline bar. Collapses by animating height once the
            reader commits to the page, freeing vertical space. */}
        <div
          className={cn(
            "overflow-hidden bg-ink transition-[height] duration-300 ease-out",
            scrolled ? "h-0" : "h-10",
          )}
        >
          <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-between gap-x-4 px-4 text-xs text-slate-300 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 sm:gap-2 font-medium text-white whitespace-nowrap text-[11px] min-[380px]:text-xs">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-slate-400 hidden min-[380px]:inline">24/7 Helpline:</span>
              <span className="text-slate-400 min-[380px]:hidden">24/7:</span>
              <a
                href={telHref(CONTACT_INFO.phonePrimary)}
                className="text-white transition-colors hover:text-amber-400"
              >
                {CONTACT_INFO.phonePrimary}
              </a>
              <span className="text-white/40">·</span>
              <a
                href={telHref(CONTACT_INFO.phoneSecondary)}
                className="text-white transition-colors hover:text-amber-400"
              >
                {CONTACT_INFO.phoneSecondary}
              </a>
            </div>

            <div className="hidden items-center gap-4 sm:flex">
              <span className="hidden items-center gap-2 md:flex">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                1500+ Houses Lifted Across India
              </span>

              {/* Social icons in top helpline bar - authentic brand logos */}
              <div className="flex items-center gap-3 border-l border-white/15 pl-3">
                <a
                  href={CONTACT_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  title="Official YouTube Channel"
                  className="transition-transform hover:scale-110"
                >
                  <YoutubeOriginalIcon className="h-4 w-4" />
                </a>
                <a
                  href={CONTACT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  title="Official Instagram Profile"
                  className="transition-transform hover:scale-110"
                >
                  <InstagramOriginalIcon className="h-4 w-4" />
                </a>
                <a
                  href={CONTACT_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Page"
                  title="Official Facebook Page"
                  className="transition-transform hover:scale-110"
                >
                  <FacebookOriginalIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Primary navigation — translucent white over the engineering grid. */}
        <div
          className={cn(
            "border-b bg-white/90 backdrop-blur-md transition-all duration-200",
            scrolled ? "border-slate-200 shadow-sm" : "border-slate-200/70",
          )}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
          >
            <a
              href="#hero"
              onClick={(event) => {
                event.preventDefault();
                handleNavigate("#hero");
              }}
              className="flex shrink-0 items-center gap-3 rounded"
            >
              <LogoMark priority size="md" />
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold tracking-tight text-ink sm:text-[16px] whitespace-nowrap">
                  RR and Sons
                </span>
                <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:text-[10px] whitespace-nowrap">
                  Building Solution PVT LTD
                </span>
              </span>
            </a>

            <ul className="hidden flex-1 items-center justify-center gap-1 xl:gap-2.5 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(link.href);
                    }}
                    className="whitespace-nowrap rounded px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 xl:gap-3">
              {/* Top social icons in main nav - authentic brand logos, larger */}
              <div className="hidden sm:flex shrink-0 items-center gap-2 border-r border-slate-200 pr-2.5 mr-0.5">
                <a
                  href={CONTACT_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube channel"
                  title="Official YouTube Channel"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-115 active:scale-95"
                >
                  <YoutubeOriginalIcon className="h-6 w-6" />
                </a>
                <a
                  href={CONTACT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram profile"
                  title="Official Instagram Profile"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-115 active:scale-95"
                >
                  <InstagramOriginalIcon className="h-6 w-6" />
                </a>
                <a
                  href={CONTACT_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook page"
                  title="Official Facebook Page"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-115 active:scale-95"
                >
                  <FacebookOriginalIcon className="h-6 w-6" />
                </a>
              </div>

              <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                <a
                  href={telHref(CONTACT_INFO.phonePrimary)}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200/90 bg-slate-50/90 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm transition-all hover:border-amber-500/50 hover:bg-amber-50/40 hover:text-amber-800"
                  title={`Call ${CONTACT_INFO.phonePrimary}`}
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span>{CONTACT_INFO.phonePrimary}</span>
                </a>
                <a
                  href={telHref(CONTACT_INFO.phoneSecondary)}
                  className="hidden items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200/90 bg-slate-50/90 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm transition-all hover:border-amber-500/50 hover:bg-amber-50/40 hover:text-amber-800 xl:flex"
                  title={`Call ${CONTACT_INFO.phoneSecondary}`}
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span>{CONTACT_INFO.phoneSecondary}</span>
                </a>
              </div>

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 text-ink transition-colors hover:bg-slate-100 touch-manipulation lg:hidden"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile drawer. A grid-template-rows transition animates height
            without needing a layout animation library or a measured pixel
            value, and collapses cleanly at any content length. */}
        <div
          id="mobile-nav"
          className={cn(
            "grid overflow-hidden border-b bg-white/95 backdrop-blur-md transition-[grid-template-rows] duration-300 ease-out lg:hidden",
            menuOpen ? "grid-rows-[1fr] border-slate-200" : "grid-rows-[0fr] border-transparent",
          )}
        >
          <div className="overflow-hidden">
            <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
              {NAV_LINKS.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    tabIndex={menuOpen ? undefined : -1}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(link.href);
                    }}
                    className="flex items-center justify-between border-b border-slate-100 py-3.5 text-sm font-medium text-slate-700 transition-colors last:border-b-0 hover:text-amber-700"
                  >
                    {link.label}
                    <span className="font-mono text-xs text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6">
              <div className="flex flex-col gap-2">
                <a
                  href={telHref(CONTACT_INFO.phonePrimary)}
                  tabIndex={menuOpen ? undefined : -1}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700"
                >
                  <Phone className="h-4 w-4" />
                  Call {CONTACT_INFO.phonePrimary}
                </a>
                <a
                  href={telHref(CONTACT_INFO.phoneSecondary)}
                  tabIndex={menuOpen ? undefined : -1}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-600/30 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900 shadow-sm transition-colors hover:bg-amber-100"
                >
                  <Phone className="h-4 w-4 text-amber-600" />
                  Call {CONTACT_INFO.phoneSecondary}
                </a>
              </div>

              {/* Social Channels in Mobile Menu */}
              <div className="mt-4 flex items-center justify-center gap-5 border-t border-slate-100 pt-4">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Follow Us:
                </span>
                <a
                  href={CONTACT_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="transition-transform active:scale-90"
                >
                  <YoutubeOriginalIcon className="h-7 w-7" />
                </a>
                <a
                  href={CONTACT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-transform active:scale-90"
                >
                  <InstagramOriginalIcon className="h-7 w-7" />
                </a>
                <a
                  href={CONTACT_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition-transform active:scale-90"
                >
                  <FacebookOriginalIcon className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
