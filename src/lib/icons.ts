import {
  Activity,
  ArrowUpFromLine,
  Award,
  Building2,
  Car,
  FileCheck,
  GraduationCap,
  Hammer,
  HardHat,
  MoveHorizontal,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/**
 * Whitelisted icon registry. Keeps `iconName` strings in the data layer
 * fully type-safe without falling back to `any` dynamic lookups.
 */
const ICONS: Record<string, LucideIcon> = {
  Activity,
  ArrowUpFromLine,
  Award,
  Building2,
  Car,
  FileCheck,
  GraduationCap,
  Hammer,
  HardHat,
  MoveHorizontal,
  ShieldCheck,
};

/** Resolves a data-layer icon name, falling back to a neutral glyph. */
export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? HardHat;
}
