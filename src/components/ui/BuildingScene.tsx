"use client";

import { forwardRef } from "react";

/**
 * Original layered building illustration (front-elevation style).
 *
 * Every animatable part carries a stable className so GSAP can target it via a
 * scoped selector (see ScrollBuildingStory). The whole `.bs-structure` group is
 * treated as ONE rigid body so the building moves as a single unit.
 */
const BuildingScene = forwardRef<SVGSVGElement, { className?: string }>(
  function BuildingScene({ className }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 1200 800"
        width="100%"
        className={className}
        style={{ maxWidth: "100%" }}
        role="img"
        aria-label="Diagram of a house being inspected, lifted on mechanical jacks, shifted on rails and placed on a new foundation."
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eceae2" />
            <stop offset="1" stopColor="#f5f4ef" />
          </linearGradient>
          <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe9d8" />
            <stop offset="1" stopColor="#ffd6b0" />
          </linearGradient>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbfaf6" />
            <stop offset="1" stopColor="#ece9df" />
          </linearGradient>
          <linearGradient id="flood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a5a6a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#4a5a6a" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6b7684" />
            <stop offset="1" stopColor="#454e59" />
          </linearGradient>
        </defs>

        {/* Sky / warm light overlay */}
        <rect className="bs-sky" x="0" y="0" width="1200" height="800" fill="url(#sky)" />
        <rect className="bs-warm" x="0" y="0" width="1200" height="800" fill="url(#warm)" opacity="0" />

        {/* Environmental depth: distant trees + utility pole */}
        <g className="bs-scenery" opacity="0.9">
          <g className="bs-tree" transform="translate(120 470)">
            <rect x="-4" y="0" width="8" height="60" fill="#8a8574" />
            <circle cx="0" cy="-14" r="34" fill="#c9cbb4" />
            <circle cx="-22" cy="4" r="24" fill="#bfc2a8" />
            <circle cx="22" cy="2" r="26" fill="#c3c6ac" />
          </g>
          <g className="bs-tree" transform="translate(1080 480)">
            <rect x="-4" y="0" width="8" height="52" fill="#8a8574" />
            <circle cx="0" cy="-10" r="28" fill="#c9cbb4" />
            <circle cx="20" cy="6" r="20" fill="#bfc2a8" />
          </g>
          <g className="bs-pole" transform="translate(1010 300)">
            <rect x="-3" y="0" width="6" height="230" fill="#9a9689" />
            <rect x="-34" y="18" width="68" height="6" rx="3" fill="#9a9689" />
            <rect x="-34" y="42" width="68" height="6" rx="3" fill="#9a9689" />
          </g>
        </g>

        {/* Raised road on the left — the reason the house sits low */}
        <g className="bs-road">
          <path d="M0 560 L340 560 L300 620 L0 620 Z" fill="#2a2e33" />
          <rect x="0" y="556" width="340" height="8" fill="#4a5058" />
          <g fill="#f5f4ef">
            <rect x="40" y="584" width="34" height="6" rx="3" />
            <rect x="130" y="584" width="34" height="6" rx="3" />
            <rect x="220" y="584" width="34" height="6" rx="3" />
          </g>
        </g>

        {/* Static ground layer (stays put during the lift) */}
        <g className="bs-ground">
          <rect x="0" y="620" width="1200" height="180" fill="#d9d6cb" />
          <rect x="0" y="620" width="1200" height="6" fill="#c7c3b5" />
        </g>

        {/* Floodwater layer (rises subtly, then passes safely below the raised house) */}
        <g className="bs-flood" opacity="0">
          <rect x="0" y="600" width="1200" height="40" fill="url(#flood)" />
          <path className="bs-flood-wave" d="M0 602 q60 -8 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 v40 H0 Z" fill="#4a5a6a" opacity="0.35" />
        </g>

        {/* New foundation (assembles beneath at placement stage) */}
        <g className="bs-newfoundation" opacity="0">
          <rect x="535" y="598" width="50" height="22" rx="2" fill="#a6a293" />
          <rect x="675" y="598" width="50" height="22" rx="2" fill="#a6a293" />
          <rect x="815" y="598" width="50" height="22" rx="2" fill="#a6a293" />
          <rect x="525" y="410" width="360" height="16" rx="2" fill="#b0ac9e" />
        </g>

        {/* Temporary rails + shifting platform (appear at the shift stage) */}
        <g className="bs-rails" opacity="0">
          <rect x="360" y="612" width="520" height="10" rx="2" fill="url(#steel)" />
          <rect x="360" y="626" width="520" height="6" rx="2" fill="#3a424c" />
          <g className="bs-wheels" fill="#2a2e33">
            <circle cx="470" cy="612" r="10" />
            <circle cx="560" cy="612" r="10" />
            <circle cx="740" cy="612" r="10" />
            <circle cx="830" cy="612" r="10" />
          </g>
        </g>

        {/* Steel support beams (slide beneath during preparation) */}
        <g className="bs-beams" opacity="0">
          <rect className="bs-beam" x="440" y="556" width="420" height="16" rx="2" fill="url(#steel)" />
          <rect className="bs-beam" x="440" y="574" width="420" height="6" rx="2" fill="#3a424c" />
        </g>

        {/* Mechanical jacks (rise into place, then extend) */}
        <g className="bs-jacks" opacity="0">
          {[500, 600, 700, 780].map((x) => (
            <g className="bs-jack" key={x} transform={`translate(${x} 560)`}>
              <rect x="-14" y="26" width="28" height="26" rx="2" fill="#3a424c" />
              <rect className="bs-jack-rod" x="-7" y="0" width="14" height="30" fill="url(#steel)" />
              <rect x="-16" y="-6" width="32" height="8" rx="2" fill="#6b7684" />
            </g>
          ))}
        </g>

        {/* ---- The rigid structure: foundation + body + roof + openings ---- */}
        <g className="bs-structure" transform="translate(0 0)">
          {/* foundation slab */}
          <rect className="bs-foundation" x="470" y="512" width="360" height="48" fill="#b0ac9e" />
          <rect x="470" y="512" width="360" height="6" fill="#9f9b8d" />

          {/* body */}
          <rect className="bs-body" x="490" y="330" width="320" height="182" fill="url(#wall)" stroke="#e0ddd2" />

          {/* windows */}
          <g className="bs-windows">
            <rect x="522" y="368" width="70" height="70" rx="3" fill="#cfe0e6" stroke="#b7c4c9" />
            <rect x="708" y="368" width="70" height="70" rx="3" fill="#cfe0e6" stroke="#b7c4c9" />
            <line x1="557" y1="368" x2="557" y2="438" stroke="#b7c4c9" />
            <line x1="522" y1="403" x2="592" y2="403" stroke="#b7c4c9" />
            <line x1="743" y1="368" x2="743" y2="438" stroke="#b7c4c9" />
            <line x1="708" y1="403" x2="778" y2="403" stroke="#b7c4c9" />
          </g>

          {/* door */}
          <rect className="bs-door" x="620" y="430" width="60" height="82" rx="3" fill="#c98a5e" stroke="#b0754c" />
          <circle cx="668" cy="472" r="3" fill="#8a5a38" />

          {/* roof */}
          <g className="bs-roof">
            <path d="M470 330 L650 250 L830 330 Z" fill="#3a424c" />
            <path d="M470 330 L650 250 L650 262 L488 336 Z" fill="#4a5560" />
          </g>
        </g>

        {/* Inspection overlay: scan line + measurement guides + labels */}
        <g className="bs-inspect" opacity="0">
          <g className="bs-measure" stroke="rgb(var(--color-accent))" strokeWidth="1.5" fill="none">
            <line x1="450" y1="250" x2="450" y2="560" strokeDasharray="4 5" />
            <line x1="444" y1="250" x2="456" y2="250" />
            <line x1="444" y1="560" x2="456" y2="560" />
            <line x1="490" y1="300" x2="810" y2="300" strokeDasharray="4 5" />
          </g>
          <g className="bs-points" fill="rgb(var(--color-accent))">
            <circle cx="490" cy="512" r="5" />
            <circle cx="810" cy="512" r="5" />
            <circle cx="650" cy="512" r="5" />
          </g>
          <rect className="bs-scanline" x="490" y="330" width="320" height="3" fill="rgb(var(--color-accent))" opacity="0.9" />
        </g>

        {/* Dimension line for the horizontal shift (shift stage) */}
        <g className="bs-shiftdim" opacity="0" stroke="rgb(var(--color-accent))" strokeWidth="1.5" fill="none">
          <line x1="650" y1="700" x2="650" y2="700" className="bs-shiftdim-line" strokeDasharray="4 5" />
        </g>

        {/* Dust particles (brief, subtle, during the lift) */}
        <g className="bs-dust" opacity="0" fill="#c7c3b5">
          <circle className="bs-dust-p" cx="500" cy="558" r="3" />
          <circle className="bs-dust-p" cx="640" cy="562" r="2.5" />
          <circle className="bs-dust-p" cx="780" cy="558" r="3" />
          <circle className="bs-dust-p" cx="560" cy="560" r="2" />
          <circle className="bs-dust-p" cx="720" cy="560" r="2" />
        </g>

        {/* Spirit level (relevel stage) */}
        <g className="bs-level" opacity="0" transform="translate(650 300)">
          <rect x="-60" y="-12" width="120" height="24" rx="6" fill="#f5f4ef" stroke="#c7c3b5" />
          <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#d9ead9" stroke="#bcd4bc" />
          <circle className="bs-level-bubble" cx="0" cy="0" r="6" fill="rgb(var(--color-success))" />
        </g>

        {/* Stilt columns carrying the elevated building (result stage) */}
        <g className="bs-stilt" opacity="0">
          <g stroke="url(#steel)" strokeWidth="12" strokeLinecap="round">
            <line x1="560" y1="420" x2="560" y2="608" />
            <line x1="700" y1="420" x2="700" y2="608" />
            <line x1="840" y1="420" x2="840" y2="608" />
          </g>
        </g>
      </svg>
    );
  },
);

export default BuildingScene;
