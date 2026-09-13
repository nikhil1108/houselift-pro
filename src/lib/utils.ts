import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type {
  CalculatorResult,
  CalculatorState,
  LeadFormErrors,
  LeadFormState,
  StructureType,
} from "@/types";

/** Tailwind-aware className merge. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------ */
/* Currency + number formatting (Indian numbering system)              */
/* ------------------------------------------------------------------ */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹12,50,000 */
export function formatINR(value: number): string {
  return INR.format(Math.round(value));
}

/** Compact Indian units: 1,20,000 -> "₹1.2 Lakh", 1,20,00,000 -> "₹1.2 Cr". */
export function formatINRCompact(value: number): string {
  const rounded = Math.round(value);
  if (rounded >= 10_000_000) {
    return `₹${(rounded / 10_000_000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (rounded >= 100_000) {
    return `₹${(rounded / 100_000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  }
  return formatINR(rounded);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/* ------------------------------------------------------------------ */
/* Cost estimation engine                                              */
/* ------------------------------------------------------------------ */

/** Base rate band in ₹ per sq ft per foot of lift. */
export const RATE_PER_SQFT_PER_FT = { min: 250, max: 350 } as const;

const STRUCTURE_MULTIPLIER: Record<StructureType, number> = {
  residential: 1,
  commercial: 1.18,
  heritage: 1.35,
};

/** Each additional storey adds load, and therefore cost. */
const FLOOR_MULTIPLIER_STEP = 0.22;

/**
 * Pure, deterministic estimator. Rate band is multiplied by structure
 * complexity and storey count; jacks scale with slab area; duration
 * scales with lift height.
 */
export function calculateEstimate(state: CalculatorState): CalculatorResult {
  const { areaSqFt, liftHeightFt, floors, structureType } = state;

  const structureMultiplier = STRUCTURE_MULTIPLIER[structureType];
  const loadFactor = structureMultiplier * floorLoadFactor(floors);

  const baseUnits = areaSqFt * liftHeightFt;

  return {
    estimatedCostMin: Math.round(baseUnits * RATE_PER_SQFT_PER_FT.min * loadFactor),
    estimatedCostMax: Math.round(baseUnits * RATE_PER_SQFT_PER_FT.max * loadFactor),
    jacksRequired: Math.ceil(areaSqFt / 40),
    durationDays: Math.ceil(15 + liftHeightFt * 3),
  };
}

/** Exposed separately so the calculator can show the breakdown row. */
export function floorLoadFactor(floors: number): number {
  return 1 + (floors - 1) * FLOOR_MULTIPLIER_STEP;
}

/** Structure premium, exposed for the same breakdown table. */
export function structureLoadFactor(structureType: StructureType): number {
  return STRUCTURE_MULTIPLIER[structureType];
}

/* ------------------------------------------------------------------ */
/* Lead form validation                                                */
/* ------------------------------------------------------------------ */

/** Indian mobile numbers: 10 digits starting 6–9, optional +91 / 0 prefix. */
const INDIAN_PHONE = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/;

export function validateLeadForm(state: LeadFormState): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (state.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  const phone = state.phone.replace(/[\s-]/g, "");
  if (!INDIAN_PHONE.test(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (state.city.trim().length < 2) {
    errors.city = "Please tell us your city.";
  }

  const area = Number(state.areaSqFt);
  if (!state.areaSqFt.trim() || Number.isNaN(area) || area < 100) {
    errors.areaSqFt = "Enter the built-up area (min. 100 sq ft).";
  }

  return errors;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Strips display formatting from a phone number for `tel:` hrefs. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
