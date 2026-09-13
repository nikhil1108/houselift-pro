"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Building2, PhoneCall, ShieldCheck, Waves } from "lucide-react";
import { useRef } from "react";

import { CONTACT_INFO, HERO_STATS } from "@/components/data/mockData";
import { useSmoothScroll } from "@/components/providers/LenisProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Stat } from "@/types";

/* ------------------------------------------------------------------ */
/* Counter card — fires once the stat strip enters the viewport        */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  stat: Stat;
  index: number;
  active: boolean;
}

function StatCard({ stat, index, active }: StatCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50 p-5 backdrop-blur-xl transition-colors hover:border-amber-500/40"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-baseline gap-0.5 font-bold tracking-tight text-white">
        {stat.prefix ? (
          <span className="text-2xl text-amber-500">{stat.prefix}</span>
        ) : null}
        <span className="text-3xl sm:text-4xl">
          <AnimatedNumber
            value={stat.value}
            active={active}
            decimals={stat.decimals ?? 0}
            durationSeconds={1.6}
          />
        </span>
        <span className="text-lg text-amber-500 sm:text-xl">{stat.suffix}</span>
      </div>

      <p className="mt-1.5 text-xs leading-snug text-slate-400 sm:text-[13px]">
        {stat.label}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Blueprint visual — the parallax foreground subject                  */
/* ------------------------------------------------------------------ */

function BlueprintVisual({ lift }: { lift: MotionValue<number> }): JSX.Element {
  // Derived once and shared by all three pistons — hooks must not run in loops.
  // `lift` is negative as the house rises, so the piston grows downward-anchored:
  // top edge tracks the plinth (translateY) while the base stays welded at y=280.
  const pistonHeight = useTransform(lift, (value: number) => 22 - value);

  return (
    <div className="relative aspect-square w-full max-w-lg">
      {/* Rotating technical rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-slate-700/50"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[12%] rounded-full border border-slate-800/80"
      />

      <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-sky-500/10 via-transparent to-amber-500/10 blur-2xl" />

      {/* House + jack schematic */}
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label="Schematic of a house elevated on mechanical jacks above the flood line"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="hero-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="hero-wall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Flood water reference */}
        <g opacity="0.5">
          <path
            d="M20 262 Q 50 256 80 262 T 140 262 T 200 262 T 260 262 T 300 262"
            stroke="#0284C7"
            strokeWidth="2"
            fill="none"
          />
          <rect x="20" y="262" width="280" height="18" fill="#0284C7" opacity="0.16" />
        </g>
        <text
          x="24"
          y="292"
          fill="#64748B"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="1"
        >
          FLOOD LINE / ROAD LEVEL
        </text>

        {/* Ground */}
        <line x1="12" y1="280" x2="308" y2="280" stroke="#334155" strokeWidth="2" />

        {/* Jack columns */}
        {[96, 160, 224].map((x) => (
          <g key={x}>
            <motion.rect
              x={x - 4}
              y={258}
              width={8}
              rx="1.5"
              fill="#0284C7"
              style={{ height: pistonHeight, y: lift }}
            />
            {/* Jack body sits over the piston so the stroke reads as a sleeve */}
            <rect x={x - 9} y={258} width={18} height={22} rx="2" fill="#334155" />
            <rect x={x - 9} y={258} width={18} height={3} rx="1.5" fill="#475569" />
          </g>
        ))}

        {/* House assembly rises with scroll */}
        <motion.g style={{ y: lift }}>
          <rect x="84" y="196" width="152" height="58" fill="url(#hero-wall)" rx="3" />
          <path d="M74 198 L160 138 L246 198 Z" fill="url(#hero-roof)" />
          <rect x="104" y="212" width="26" height="24" rx="2" fill="#0284C7" opacity="0.75" />
          <rect x="190" y="212" width="26" height="24" rx="2" fill="#0284C7" opacity="0.75" />
          <rect x="148" y="216" width="24" height="38" rx="2" fill="#F59E0B" opacity="0.85" />
          {/* Plinth beam */}
          <rect x="80" y="250" width="160" height="8" rx="2" fill="#475569" />
        </motion.g>

        {/* Dimension arrow indicating the lift */}
        <g stroke="#F59E0B" strokeWidth="1.4" opacity="0.9">
          <line x1="286" y1="196" x2="286" y2="252" strokeDasharray="4 3" />
          <path d="M286 196 l-4 6 h8 z" fill="#F59E0B" stroke="none" />
          <path d="M286 252 l-4 -6 h8 z" fill="#F59E0B" stroke="none" />
        </g>
      </svg>

      {/* Floating spec chips */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-2 top-10 rounded-xl border border-slate-700/70 bg-slate-900/85 px-3 py-2 backdrop-blur-md sm:-left-6"
      >
        <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
          Tolerance
        </p>
        <p className="text-sm font-bold text-amber-400">±2 mm</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute -right-2 bottom-24 rounded-xl border border-slate-700/70 bg-slate-900/85 px-3 py-2 backdrop-blur-md sm:-right-4"
      >
        <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
          Capacity
        </p>
        <p className="text-sm font-bold text-sky-400">15,000 T</p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

export function HeroParallax(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const depth = reduceMotion ? 0 : 1;

  // Layered parallax: grid drifts slowest, subject moves fastest.
  const gridY = useTransform(scrollYProgress, [0, 1], [-50 * depth, 50 * depth]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 140 * depth]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 190 * depth]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 280 * depth]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Feeds the schematic's lift — a small preview of the full simulator.
  const schematicLift = useTransform(scrollYProgress, [0, 0.6], [0, -34 * depth]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 lg:pt-36"
    >
      {/* Layer 1 — technical grid (slowest) */}
      <motion.div
        style={{ y: gridY }}
        aria-hidden
        className="engineering-grid absolute inset-[-10%] -z-20"
      />

      {/* Layer 2 — atmospheric glows */}
      <motion.div style={{ y: glowY }} aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-sky-600/15 blur-[120px]" />
        <div className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 blur-[130px]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 to-transparent" />
      </motion.div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Layer 3 — copy */}
          <motion.div style={{ y: copyY, opacity: copyOpacity }}>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              ISO-Grade Engineering &middot; 10-Year Warranty
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.1rem]"
            >
              We Lift Your House
              <br />
              <span className="text-gradient-amber">Above The Flood Line.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              India&apos;s most precise Mechanical House Lifting and structural
              elevation service. Computer-synchronised jacks raise your home up to
              10 ft — walls intact, family inside, zero cracks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" onClick={() => scrollTo("#calculator")}>
                Calculate Lifting Cost
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={`tel:${CONTACT_INFO.phonePrimary.replace(/\s/g, "")}`}>
                  <PhoneCall className="h-4 w-4" />
                  Talk To An Engineer
                </a>
              </Button>
            </motion.div>

            {/* Assurance strip */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.36 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500"
            >
              {[
                { icon: Waves, text: "Monsoon flood protection" },
                { icon: Building2, text: "Residential · Commercial · Heritage" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-1.5">
                  <item.icon className="h-3.5 w-3.5 text-amber-500/80" />
                  {item.text}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Layer 4 — visual subject (fastest) */}
          <motion.div
            style={{ y: visualY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={cn("flex justify-center lg:justify-end")}
          >
            <BlueprintVisual lift={schematicLift} />
          </motion.div>
        </div>

        {/* Counters */}
        <div
          ref={statsRef}
          className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-4"
        >
          {HERO_STATS.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              active={statsInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
