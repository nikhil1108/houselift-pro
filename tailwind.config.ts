import type { Config } from "tailwindcss";

/**
 * Design system — "Modern Technical Luxury".
 *
 * Light theme built on a cool off-white canvas with pure-white card surfaces,
 * hairline borders and a two-accent system: Safety Amber carries every call to
 * action, Hydraulic Blue carries technical/measurement information. Charcoal is
 * the ink. Nothing else is allowed to be a brand colour — that restraint is
 * what separates an engineered palette from a decorative one.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
        // Headline face for the storyboard captions. Same stack as `sans` —
        // the distinction is weight and tracking, not a second typeface.
        display: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        // The house curve: fast departure, long settle. Matches the easing the
        // scroll scenes already use in globals.css.
        engineer: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      colors: {
        // Safety Amber — CTAs, active states, "energy" moments only.
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        // Hydraulic Blue — measurements, datums, technical annotation.
        hydraulic: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
        // Semantic tokens, mirrored from the custom properties in globals.css.
        canvas: "var(--canvas)",
        surface: {
          DEFAULT: "var(--surface)",
          sunken: "var(--surface-sunken)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          subtle: "var(--ink-subtle)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        // Short aliases used by the storyboard section (text-accent,
        // border-accent, text-muted). They point at the existing tokens, so
        // no new colour enters the palette.
        accent: "var(--amber)",
        muted: "var(--ink-muted)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07)",
        lg: "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.06)",
        xl: "0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.06)",
        "2xl": "0 25px 50px -12px rgba(15, 23, 42, 0.18)",
        panel: "0 1px 3px rgba(15, 23, 42, 0.06)",
        // Warm halo for the amber CTA, so elevation reads as light not just blur.
        amber: "0 8px 24px -6px rgba(217, 119, 6, 0.35)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Expanding ring behind the primary CTA. Scale + fade only, so it
        // composites and never reflows the button next to it.
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.45" },
          "70%": { transform: "scale(1.35)", opacity: "0" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
        "lightbox-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "veil-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // --- Before/after comparison scenes ---
        // Rain is drawn as two stacked copies of one 560-unit tile; shifting by
        // exactly one tile height means the loop has no visible seam.
        "rain-fall": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(560px)" },
        },
        // One full wavelength of the flood surface, so the drift also seams.
        "water-drift": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-220px)" },
        },
        "water-swell": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "cloud-drift": {
          from: { transform: "translateX(-180px)" },
          to: { transform: "translateX(900px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "lightbox-in": "lightbox-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both",
        "veil-in": "veil-in 0.2s ease-out both",
        "rain-fall": "rain-fall 0.9s linear infinite",
        "water-drift": "water-drift 4.5s linear infinite",
        "water-swell": "water-swell 5s ease-in-out infinite",
        "cloud-drift": "cloud-drift 42s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
