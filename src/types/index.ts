/**
 * Complete data models for the RR AND SONS marketing site.
 * Every structure rendered on the page is typed here — no `any` anywhere.
 */

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type ServiceType =
  | "hydraulic-lifting"
  | "building-relocation"
  | "foundation-repair"
  | "stilt-parking"
  | "commercial-elevation";

export interface Service {
  id: ServiceType;
  title: string;
  description: string;
  features: string[];
  iconName: string;
}

/* ------------------------------------------------------------------ */
/* Cost calculator                                                     */
/* ------------------------------------------------------------------ */

export type StructureType = "residential" | "commercial" | "heritage";

export interface CalculatorState {
  areaSqFt: number;
  liftHeightFt: number;
  floors: number;
  structureType: StructureType;
}

export interface CalculatorResult {
  estimatedCostMin: number;
  estimatedCostMax: number;
  durationDays: number;
  jacksRequired: number;
}

export interface StructureOption {
  value: StructureType;
  label: string;
  /** Complexity multiplier applied to the base rate. */
  multiplier: number;
  hint: string;
}

/* ------------------------------------------------------------------ */
/* Engineering process                                                 */
/* ------------------------------------------------------------------ */

export interface ProcessStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  technicalDetail: string;
  badge: string;
}

/* ------------------------------------------------------------------ */
/* Social proof                                                        */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  role: string;
  quote: string;
  /** Whole stars, 1–5. */
  rating: number;
  project: string;
  /** Optional customer avatar photo */
  avatar?: string;
}

export interface Stat {
  id: string;
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  decimals?: number;
}

export type ProjectCategory =
  | "house-lifting"
  | "building-lifting"
  | "shifting"
  | "temple-lifting";

export interface Project {
  id: string;
  title: string;
  city: string;
  category: ProjectCategory;
  areaSqFt: number;
  liftHeightFt: number;
  durationDays: number;
}

export interface ProjectFilter {
  value: ProjectCategory | "all";
  label: string;
}

/* ------------------------------------------------------------------ */
/* Field gallery                                                       */
/* ------------------------------------------------------------------ */

export type GalleryCategory =
  | "residential"
  | "commercial"
  | "hydraulic-tech"
  | "before-after";

/**
 * Identifies which vector scene `ProjectPlate` should draw. Kept as a closed
 * union rather than a string so a typo in the data file is a compile error.
 */
export type PlateScene =
  | "raised-house"
  | "jack-array"
  | "commercial-block"
  | "heritage"
  | "jack-closeup"
  | "before-after"
  | "rcc-pillar"
  | "temple"
  | "villa-flood"
  | "control-panel";

export interface GalleryProject {
  id: string;
  /** Sequence label rendered in the corner of the plate, e.g. "01". */
  index: string;
  title: string;
  location: string;
  category: GalleryCategory;
  scene: PlateScene;
  /**
   * Site photograph, served from `public/`. Optional — when absent, or when
   * the file 404s, the plate falls back to the `scene` vector so the grid
   * never shows a broken frame.
   */
  photo?: string;
  /** Plate aspect. The masonry rhythm alternates between the two. */
  ratio: "16:9" | "4:3";
  /** Short technical caption shown under the plate and in the lightbox. */
  caption: string;
  /** Key/value specs listed in the lightbox detail panel. */
  specs: ReadonlyArray<{ label: string; value: string }>;
}

export interface GalleryFilter {
  value: GalleryCategory | "all";
  label: string;
}

/* ------------------------------------------------------------------ */
/* Site photos                                                         */
/* ------------------------------------------------------------------ */

/**
 * A raw site photograph, shown as-is in the Site Photos strip.
 *
 * Deliberately thinner than `GalleryProject`: no specs, no location and no
 * scene fallback. These are the photographs themselves rather than documented
 * plates, so nothing here asserts a figure that would need verifying.
 */
export interface SitePhoto {
  id: string;
  /** Path under `public/`. */
  src: string;
  /** Describes only what is visible in the frame — used as the alt text. */
  alt: string;
}

/* ------------------------------------------------------------------ */
/* Pan-India presence                                                  */
/* ------------------------------------------------------------------ */

export interface PresenceCity {
  id: string;
  name: string;
  /** Real WGS-84 latitude, projected onto the map by PresenceMap. */
  lat: number;
  /** Real WGS-84 longitude. */
  lng: number;
  projects: number;
  /** Head-office marker renders larger, with a ring. */
  hq?: boolean;
}

/**
 * A physical office. Coordinates drive both the embedded map and the
 * "directions" links, so a wrong pin sends a customer to the wrong place —
 * treat them as content to be verified, not decoration.
 */
export interface OfficeLocation {
  id: string;
  label: string;
  addressLine: string;
  lat: number;
  lng: number;
  /**
   * Half-width of the embedded map's bounding box, in degrees. Larger values
   * zoom out — useful where the pin is approximate and more context helps.
   */
  spanDeg: number;
}

/* ------------------------------------------------------------------ */
/* Content blocks                                                      */
/* ------------------------------------------------------------------ */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ContactInfo {
  /** Registered company name, as it should appear in legal contexts. */
  companyName: string;
  /** Year the firm was established. */
  foundedYear: number;
  /**
   * Kept alongside `phones` because the header, hero and floating call button
   * each surface a single number and must all pick the same one.
   */
  phonePrimary: string;
  phoneSecondary: string;
  /** Every published number, primary first. */
  phones: readonly string[];
  whatsapp: string;
  email: string;
  /** Address split for block display; joined for single-line contexts. */
  addressLines: readonly string[];
  addressLine: string;
  hours: string;
  socials: {
    youtube: string;
    facebook: string;
    instagram: string;
  };
}

/** A named person a caller can ask for. */
export interface ContactPerson {
  id: string;
  name: string;
  /** Professional discipline, e.g. "Civil Engineer". */
  role: string;
  /** Optional extra context, e.g. the university behind the qualification. */
  detail?: string;
  /** Profile photograph path in public directory */
  photo?: string;
}

/* ------------------------------------------------------------------ */
/* Lead capture form                                                   */
/* ------------------------------------------------------------------ */

export interface LeadFormState {
  name: string;
  phone: string;
  city: string;
  areaSqFt: string;
}

export type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;

export type FormStatus = "idle" | "submitting" | "success" | "error";
