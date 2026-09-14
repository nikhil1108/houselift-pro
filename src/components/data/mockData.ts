/**
 * Static content database for the RR AND SONS marketing site.
 * Real production deployment would pull this from a headless CMS or API.
 */

import type {
  ContactInfo,
  ContactPerson,
  FaqItem,
  GalleryFilter,
  GalleryProject,
  NavLink,
  OfficeLocation,
  PresenceCity,
  ProcessStep,
  Project,
  ProjectFilter,
  Service,
  SitePhoto,
  Stat,
  StructureOption,
  Testimonial,
  TrustPoint,
} from "@/types";

/* ------------------------------------------------------------------ */
/* Navigation & contact                                                */
/* ------------------------------------------------------------------ */

export const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Simulator", href: "#simulator" },
  { label: "Process", href: "#process" },
  { label: "Stilt Parking", href: "#stilt-parking" },
  { label: "Field Work", href: "#gallery" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Office", href: "#office" },
];

const ADDRESS_LINES: readonly string[] = [
  "69-C, Kalsi",
  "P.O. Nilokheri",
  "District Karnal, Haryana – 132117",
  "India",
];

export const CONTACT_INFO: ContactInfo = {
  companyName: "RR and Sons Building Solution PVT LTD",
  foundedYear: 2009,
  phonePrimary: "+91 94941 60000",
  phoneSecondary: "+91 94914 70000",
  phones: [
    "+91 94941 60000",
    "+91 94914 70000",
    "+91 95887 32102",
    "+91 94911 70000",
  ],
  // TODO(owner): confirm which number is on WhatsApp. Defaulted to the primary
  // line — if WhatsApp sits on a different handset, the chat buttons in the
  // hero, quote form and floating actions all silently go to the wrong place.
  whatsapp: "+918053743181",
  email: "buildinglifting83@gmail.com",
  addressLines: ADDRESS_LINES,
  addressLine: ADDRESS_LINES.join(", "),
  hours: "24*7",
  socials: {
    youtube: "https://youtube.com/@besthouseliftingservicesin6640?si=ObJMvxrdJIMqqARe",
    facebook: "https://www.facebook.com/share/1CXTyfB2km/",
    instagram: "https://www.instagram.com/houseliftingservices?utm_source=qr&igsh=Zmp1b3pxdGM1bHM3",
  },
};

/**
 * The two founders. Named on the page because a caller asking for a person by
 * name gets a better reception than one asking for "the office", and because
 * both qualifications are load-bearing claims — a civil and a mechanical
 * engineer between them cover the structure and the hydraulics.
 */
export const CONTACT_PEOPLE: ContactPerson[] = [
  {
    id: "gurdeep",
    name: "Gurdeep Kumar",
    role: "Civil Engineer",
    detail: "Co-founder · structural assessment and foundation design",
    photo: "/gallery/gurdeep.jpg",
  },
  {
    id: "sandeep",
    name: "Sandeep Kumar",
    role: "Mechanical Engineer",
    detail: "Co-founder · Kurukshetra University · mechanical jack systems",
    photo: "/gallery/sandeep.jpg",
  },
];

/* ------------------------------------------------------------------ */
/* Services (4 core offerings)                                         */
/* ------------------------------------------------------------------ */

export const SERVICES: Service[] = [
  {
    id: "hydraulic-lifting",
    title: "Mechanical House Lifting",
    description:
      "Precision synchronized jack system elevates your entire structure safely above flood levels, road realignment, or metro construction. Zero structural damage guarantee.",
    features: [
      "Synchronized mechanical jack operation",
      "Live foundation casting during elevation",
      "Waterlogging & flood protection (2–10 ft lift)",
      "Residential, commercial, heritage buildings",
    ],
    iconName: "ArrowUpFromLine",
  },
  {
    id: "building-relocation",
    title: "Building Shifting, Rotation & Relocation",
    description:
      "Move your entire structure horizontally to a new plot or align it with updated road layouts. Intact utilities, zero downtime for your family.",
    features: [
      "Horizontal transport on custom rail systems",
      "Foundation re-casting at the new location",
      "Utility reconnection (plumbing, electrical)",
      "Temple, heritage, and residential shifting",
    ],
    iconName: "MoveHorizontal",
  },
  {
    id: "foundation-repair",
    title: "Foundation Strengthening, Repair & Alignment",
    description:
      "Diagnose and fix settlement cracks, weak RCC columns, or soil subsidence with micro-piling, underpinning, and structural reinforcement.",
    features: [
      "Laser-scanned structural audit",
      "Micro-piling & underpinning",
      "Steel reinforcement & concrete jacketing",
    ],
    iconName: "Hammer",
  },
  {
    id: "stilt-parking",
    title: "Stilt Parking & Basement Construction Under Existing Building",
    description:
      "Raise the house 10–12 ft and the ground plane becomes a covered two-car bay on RCC stilts. Parking added without buying land or losing a single room.",
    features: [
      "Two-car covered bay under the existing footprint",
      "M20 RCC stilt columns (or as per requirement) on new pad footings",
      "Living floor clears the flood line in the same lift",
      "Screeded parking floor and perimeter drainage",
    ],
    iconName: "Car",
  },
  {
    id: "commercial-elevation",
    title: "Commercial & Industrial Lifting",
    description:
      "Large-scale elevation for factories, warehouses, petrol pumps, and multi-storey buildings. Minimal operational disruption, phased execution.",
    features: [
      "Load capacity up to 15,000 tons",
      "Phased lifting for occupied structures",
      "Industrial-grade mechanical jacks (3000+ units)",
      "Post-lift vibration & settlement monitoring",
    ],
    iconName: "Building2",
  },
];

/* ------------------------------------------------------------------ */
/* 5-step engineering process                                          */
/* ------------------------------------------------------------------ */

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: "Structural Survey",
    subtitle: "Precision Diagnostics",
    description:
      "Our certified structural engineers conduct a comprehensive 3D laser scan of your building's foundation, load-bearing walls, and RCC columns.",
    technicalDetail:
      "Total station surveying equipment maps every mm of settlement. Soil bearing capacity tested via plate load tests. Detailed CAD drawings delivered within 48 hours.",
    badge: "Day 1–2",
  },
  {
    id: 2,
    title: "Foundation Trenching & Jack Placement",
    subtitle: "Strategic Preparation",
    description:
      "We excavate precision trenches beneath your building's plinth beams and position synchronized mechanical jacks at calculated load points.",
    technicalDetail:
      "Jack spacing determined by FEA (Finite Element Analysis) to ensure uniform load distribution. Steel spreader beams installed to prevent point loads.",
    badge: "Day 3–7",
  },
  {
    id: 3,
    title: "Synchronized Jack Elevation",
    subtitle: "Controlled Lift",
    description:
      "Manual movement of mechanical jacks lifts your entire structure in 25mm increments. Real-time sensors ensure ±2mm tolerance across all jacks.",
    technicalDetail:
      "Mechanical jack alignment monitored at regular intervals. Tilt sensors trigger automatic correction if any corner deviates >1mm. Average lift rate: 150mm per day.",
    badge: "Day 8–20",
  },
  {
    id: 4,
    title: "Live Foundation Construction",
    subtitle: "RCC Casting",
    description:
      "While your house is suspended, we cast new RCC columns and foundation walls beneath it using M20 grade concrete (or as per requirement) with corrosion-resistant rebar.",
    technicalDetail:
      "7-day curing under controlled humidity. Anti-termite soil treatment. Damp-proof course (DPC) with waterproof membrane. Plumbing & electrical conduits pre-installed.",
    badge: "Day 12–25",
  },
  {
    id: 5,
    title: "Packing & Final Handover",
    subtitle: "Precision Settling",
    description:
      "Your structure is gently packed and placed into the new foundation. Jacks removed, trenches backfilled, and external finishing completed.",
    technicalDetail:
      "Post-lift settlement monitoring for 30 days. Structural stability certificate issued. 10-year warranty activated.",
    badge: "Day 26–30",
  },
];

/* ------------------------------------------------------------------ */
/* Social proof: stats, testimonials, projects                         */
/* ------------------------------------------------------------------ */

export const HERO_STATS: Stat[] = [
  {
    id: "experience",
    // Combined across both founders, not the company's own trading age —
    // the label has to say "combined" or the two figures contradict the
    // "Est. 2013" in the footer.
    value: 20,
    suffix: "+ Years",
    label: "Combined Experience",
  },
  {
    id: "projects",
    value: 1000,
    suffix: "+",
    label: "Houses Safely Lifted",
  },
  {
    id: "damage",
    value: 0,
    suffix: "%",
    label: "Structural Damage",
    decimals: 1,
  },
  {
    id: "warranty",
    value: 10,
    suffix: "-Year",
    label: "Warranty Coverage",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-nitin",
    name: "Mr. Nitin Singhal",
    city: "Ernakulam, Kerala",
    role: "Homeowner",
    quote:
      "I had a very old house in Ernakulam (Kerala), this house was way below the road level and had severe problem of water logging. RR AND SON'S COMPANY immediately arranged a site visit to see if it was feasible to lift the entire house ( approx area 3500 sqft ) I was not aware of anything like this before and was amazed that within few weeks they raised the house by 4.5 feet.",
    rating: 5,
    project: "House Lifted 4.5 ft – 3,500 sq ft",
    avatar: "/gallery/nitin-singhal.jpg",
  },
  {
    id: "t-kevin",
    name: "Mr. Kevin",
    city: "Ernakulam, Kerala",
    role: "Property Owner",
    quote:
      "They finished the work as per schedule and the communication process during the whole project right from start to the end was very smooth. The experience of the whole process of house lifting can be daunting, if you don't partner with the right party. I recommend RR & Sons without any reservations if you are thinking of lifting your house or building.",
    rating: 5,
    project: "Residential Building Elevation",
  },
  {
    id: "t-soumya",
    name: "Mrs. Soumya R. Potti",
    city: "Thiruvananthapuram, Kerala",
    role: "Homeowner",
    quote:
      "It was magical that the entire group of RR agency worked togater and lifted my home to a height of 4 feet within the stipulated time admist this pandemic situation on a reasonable price without causing any damage to the building. Whenever there is a requirement to lift the house my first suggestion would be the RR and sons construction company.",
    rating: 5,
    project: "Home Lifted 4 ft with Zero Damage",
    avatar: "/gallery/soumya-potti.jpg",
  },
  {
    id: "t-deshraj",
    name: "Deshraj Kumar",
    city: "Delhi",
    role: "Homeowner, Green Park",
    quote:
      "My 3-storey house was sinking due to metro construction nearby. RR AND SONS raised it by 6 feet in just 22 days with zero cracks. The mechanical jack system was so smooth we stayed inside during the entire process!",
    rating: 5,
    project: "Residential Lifting – 2,400 sq ft",
  },
];

export const TRUST_POINTS: TrustPoint[] = [
  {
    id: "engineers",
    title: "Engineer-Led, Both Disciplines",
    description:
      "Founded and run by Gurdeep Kumar (Civil) and Sandeep Kumar (Mechanical, Kurukshetra University) — the structure and the mechanical lifting systems are each owned by a qualified engineer, not subcontracted.",
    iconName: "GraduationCap",
  },
  {
    id: "record",
    title: "India Book of Records Holder",
    description:
      "First company in India to rotate a building through a full 90°, recognised in the India Book of Records and the Indian World Record Book.",
    iconName: "Award",
  },
  {
    id: "agreement",
    title: "100% Safety Agreement",
    description:
      "Every project is backed by a written safety agreement executed on court documentation, so your protection is a legal instrument rather than a promise.",
    iconName: "FileCheck",
  },
  {
    id: "monitoring",
    title: "24/7 Real-Time Monitoring",
    description:
      "Synchronized mechanical jacks with live tilt sensors and precision leveling. Continuous on-site engineering supervision.",
    iconName: "Activity",
  },
];

/* ------------------------------------------------------------------ */
/* Project portfolio                                                   */
/* ------------------------------------------------------------------ */

export const PROJECT_FILTERS: ProjectFilter[] = [
  { value: "all", label: "All Projects" },
  { value: "house-lifting", label: "House Lifting" },
  { value: "building-lifting", label: "Commercial Buildings" },
  { value: "shifting", label: "Building Shifting" },
  { value: "temple-lifting", label: "Heritage & Temples" },
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Residential Villa Elevation",
    city: "Bangalore",
    category: "house-lifting",
    areaSqFt: 2800,
    liftHeightFt: 6,
    durationDays: 24,
  },
  {
    id: "p2",
    title: "Corporate Office Building",
    city: "Gurugram",
    category: "building-lifting",
    areaSqFt: 12000,
    liftHeightFt: 5,
    durationDays: 45,
  },
  {
    id: "p3",
    title: "Heritage Temple Relocation",
    city: "Noida",
    category: "temple-lifting",
    areaSqFt: 1800,
    liftHeightFt: 4,
    durationDays: 18,
  },
  {
    id: "p4",
    title: "Apartment Complex (4 Floors)",
    city: "Chennai",
    category: "building-lifting",
    areaSqFt: 18000,
    liftHeightFt: 7,
    durationDays: 60,
  },
  {
    id: "p5",
    title: "Bungalow Horizontal Shifting",
    city: "Hyderabad",
    category: "shifting",
    areaSqFt: 3200,
    liftHeightFt: 0,
    durationDays: 21,
  },
  {
    id: "p6",
    title: "Farmhouse Flood Protection",
    city: "Kurukshetra",
    category: "house-lifting",
    areaSqFt: 2400,
    liftHeightFt: 8,
    durationDays: 26,
  },
];

/* ------------------------------------------------------------------ */
/* FAQ content                                                         */
/* ------------------------------------------------------------------ */

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq1",
    question: "Can we stay inside the house during the lifting process?",
    answer:
      "Yes, in most residential projects you can remain inside. Our synchronized mechanical jacks lift the structure so smoothly (25mm increments) that there's minimal vibration. We do recommend moving fragile items and temporarily disconnecting heavy appliances. For commercial buildings, we offer phased lifting so operations can continue.",
  },
  {
    id: "faq2",
    question: "How much does house lifting cost in India?",
    answer:
      "The cost typically ranges from ₹250 to ₹350 per square foot per foot of lift, depending on structure type, number of floors, soil conditions, and location. For example, lifting a 2,000 sq ft house by 6 feet would cost approximately ₹30–42 Lakhs including new foundation, labor, materials, and 10-year warranty. Use our cost calculator above for a precise estimate.",
  },
  {
    id: "faq3",
    question: "Will lifting damage my house structure or cause cracks?",
    answer:
      "No. Our synchronized mechanical jack system maintains ±2mm tolerance across all jack points, preventing differential settlement that causes cracks. We've successfully lifted 1,000+ structures with a zero structural damage record.",
  },
  {
    id: "faq4",
    question: "How long does the entire house lifting process take?",
    answer:
      "A typical residential project (2,000–3,000 sq ft, 6 ft lift) takes 25–30 days from start to finish: 2 days for structural survey, 5 days for trenching and jack placement, 12 days for lifting, 10 days for RCC foundation casting and curing, and 3 days for lowering and finishing. Larger commercial buildings may take 45–60 days.",
  },
  {
    id: "faq5",
    question: "What about plumbing, electrical, and gas connections during lifting?",
    answer:
      "We temporarily disconnect all utilities before lifting and reconnect them after your house is settled on the new foundation. Flexible hoses are used for water and gas during the suspended phase if needed. Our team includes licensed plumbers and electricians who handle all reconnections as part of the project scope.",
  },
  {
    id: "faq7",
    question: "Which cities and states do you operate in?",
    answer:
      "We are based at Nilokheri in Karnal district, Haryana, and operate across North India including Delhi NCR, Haryana, Punjab, Uttar Pradesh, Rajasthan, and Uttarakhand. We have also successfully completed projects in Bangalore, Chennai, Hyderabad, and Mumbai. For projects outside our primary service area, we assess feasibility during the free site survey.",
  },
  {
    id: "faq8",
    question: "What is the maximum height and weight you can lift?",
    answer:
      "We can lift structures up to 10 feet vertically and handle buildings weighing up to 15,000 tons. Our largest project to date was an 18,000 sq ft commercial building (4 floors) lifted by 7 feet. For heritage structures and temples, we use specialized low-pressure jacks. There's virtually no upper limit on horizontal shifting distance.",
  },
];

/* ------------------------------------------------------------------ */
/* Live field gallery — 10 documented site operations                  */
/* ------------------------------------------------------------------ */

export const GALLERY_FILTERS: GalleryFilter[] = [
  { value: "all", label: "All Projects" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "hydraulic-tech", label: "Mechanical Tech" },
  { value: "before-after", label: "Before & After" },
];

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "g01",
    index: "01",
    title: "Two-Storey Residential House Raised 5 ft Above Road Level",
    location: "Ernakulam, Kerala",
    category: "residential",
    scene: "raised-house",
    photo: "/gallery/01-raised-house.jpg",
    ratio: "4:3",
    caption:
      "A two-storey residential house raised 5 feet above road level in Ernakulam, Kerala.",
    specs: [
      { label: "Lift height", value: "5.0 ft / 1,524 mm" },
      { label: "Structure", value: "2-Storey House" },
      { label: "Elevation", value: "Above road level" },
      { label: "Location", value: "Ernakulam, Kerala" },
    ],
  },
  {
    id: "g02",
    index: "02",
    title: "House Lifted on Mechanical Jacks with New Plinth Beam for Extra Floor",
    location: "Chittoor, Andhra Pradesh",
    category: "hydraulic-tech",
    scene: "jack-array",
    photo: "/gallery/02-jack-array.jpg",
    ratio: "4:3",
    caption:
      "A house lifted using mechanical jacks, with a new plinth beam installed to provide additional structural strength for an extra floor, in Chittoor, Andhra Pradesh.",
    specs: [
      { label: "Method", value: "Mechanical jacks" },
      { label: "Beam installed", value: "New plinth beam" },
      { label: "Purpose", value: "Extra floor capacity" },
      { label: "Location", value: "Chittoor, Andhra Pradesh" },
    ],
  },
  {
    id: "g03",
    index: "03",
    title: "Commercial Complex Elevation Without Demolition",
    location: "Patna, Bihar",
    category: "commercial",
    scene: "commercial-block",
    // No commercial-block photograph in the set yet — the file at this path
    // duplicates 02, so the slot falls back to its vector scene.
    ratio: "16:9",
    caption:
      "Three-floor retail block lifted in phases so ground-floor tenants continued trading throughout the programme.",
    specs: [
      { label: "Lift height", value: "4.0 ft / 1,219 mm" },
      { label: "Built-up area", value: "11,400 sq ft" },
      { label: "Phases", value: "3 (tenanted)" },
      { label: "Duration", value: "48 days" },
    ],
  },
  {
    id: "g04",
    index: "04",
    title: "Minaret Lifted 10 ft & Shifted 10 ft to New Position",
    location: "Nagaon, Assam",
    category: "before-after",
    scene: "heritage",
    photo: "/gallery/04-heritage.jpg",
    ratio: "4:3",
    caption:
      "A minaret lifted 10 feet and shifted 10 feet from its existing location to a new position, in Nagaon, Assam.",
    specs: [
      { label: "Lift height", value: "10.0 ft / 3,048 mm" },
      { label: "Shift distance", value: "10.0 ft / 3,048 mm" },
      { label: "Structure", value: "Masonry minaret" },
      { label: "Location", value: "Nagaon, Assam" },
    ],
  },
  {
    id: "g05",
    index: "05",
    title: "Alignment Correction & Foundation Strengthening for Multi-Storeyed Building",
    location: "Digha, West Bengal",
    category: "commercial",
    scene: "jack-closeup",
    photo: "/gallery/09-villa-flood.jpg",
    ratio: "4:3",
    caption:
      "Alignment correction and foundation strengthening for a multi-storeyed building in Digha, West Bengal.",
    specs: [
      { label: "Operation", value: "Alignment correction" },
      { label: "Foundation", value: "Strengthening & repair" },
      { label: "Structure", value: "Multi-storeyed building" },
      { label: "Location", value: "Digha, West Bengal" },
    ],
  },
  {
    id: "g06",
    index: "06",
    title: "Temple Lifted 4.5 ft Above Road Level",
    location: "Villupuram, Tamil Nadu",
    category: "before-after",
    scene: "temple",
    photo: "/gallery/08-temple.jpg",
    ratio: "4:3",
    caption:
      "A temple being lifted 4.5 feet above road level in Villupuram, Tamil Nadu.",
    specs: [
      { label: "Lift height", value: "4.5 ft / 1,372 mm" },
      { label: "Structure", value: "Heritage temple" },
      { label: "Elevation", value: "+4.5 ft above road" },
      { label: "Location", value: "Villupuram, Tamil Nadu" },
    ],
  },
  {
    id: "g07",
    index: "07",
    title: "Reinforced Steel RCC Pillar Casting Under Lifted Building",
    location: "Gurugram, Haryana",
    category: "commercial",
    scene: "rcc-pillar",
    // No pillar-casting photograph in the set yet — the file at this path
    // duplicates 05, so the slot falls back to its vector scene.
    ratio: "4:3",
    caption:
      "New columns cast while the structure is held on jacks. Fe500D cage, M20 pour (or as per requirement), 7-day controlled cure before load transfer.",
    specs: [
      { label: "Concrete grade", value: "M20 (or as per requirement)" },
      { label: "Rebar", value: "Fe500D, 16 mm" },
      { label: "Cure period", value: "7 days" },
      { label: "Columns cast", value: "22" },
    ],
  },
  {
    id: "g08",
    index: "08",
    title: "House Lifted 12.5 ft to Create Stilt Parking Beneath",
    location: "Tirupati, Andhra Pradesh",
    category: "residential",
    scene: "raised-house",
    photo: "/gallery/06-before-after.jpg",
    ratio: "4:3",
    caption:
      "A house being lifted up to 12.5 feet to create stilt parking beneath it, in Tirupati, Andhra Pradesh.",
    specs: [
      { label: "Lift height", value: "12.5 ft / 3,810 mm" },
      { label: "Feature", value: "Stilt parking creation" },
      { label: "Structure", value: "Residential house" },
      { label: "Location", value: "Tirupati, Andhra Pradesh" },
    ],
  },
  {
    id: "g09",
    index: "09",
    title: "House Lifted 5 ft with Belt Beam Installed Underneath",
    location: "Kolkata, West Bengal",
    category: "residential",
    scene: "villa-flood",
    photo: "/gallery/05-jack-closeup.jpg",
    ratio: "4:3",
    caption:
      "A house being lifted up to 5 feet, with a belt beam installed underneath, in Kolkata, West Bengal.",
    specs: [
      { label: "Lift height", value: "5.0 ft / 1,524 mm" },
      { label: "Reinforcement", value: "Underneath belt beam" },
      { label: "Structure", value: "Residential house" },
      { label: "Location", value: "Kolkata, West Bengal" },
    ],
  },
  {
    id: "g10",
    index: "10",
    title: "House Lifted 4 ft in Kochi, Kerala",
    location: "Kochi, Kerala",
    category: "residential",
    scene: "control-panel",
    photo: "/gallery/10-control-panel.jpg",
    ratio: "4:3",
    caption:
      "A house being lifted 4 feet in Kochi, Kerala.",
    specs: [
      { label: "Lift height", value: "4.0 ft / 1,219 mm" },
      { label: "Structure", value: "Residential house" },
      { label: "Net lift", value: "+4.0 ft" },
      { label: "Location", value: "Kochi, Kerala" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Site photos — every file in public/gallery, shown as-is              */
/* ------------------------------------------------------------------ */

/**
 * The raw photograph set. Every file in `public/gallery` appears here in
 * filename order, including the two pairs that the documented plates above
 * skip because they duplicate an earlier frame.
 *
 * Alt text describes only what is visible in the frame. Locations, lift
 * heights and durations stay with `GALLERY_PROJECTS` — this strip makes no
 * claim beyond "this is one of our sites".
 */
export const SITE_PHOTOS: SitePhoto[] = [
  {
    id: "p01",
    src: "/gallery/01-raised-house.jpg",
    alt: "Two-storey residential house raised 5 feet above road level in Ernakulam, Kerala",
  },
  {
    id: "p02",
    src: "/gallery/02-jack-array.jpg",
    alt: "House lifted using mechanical jacks, with a new plinth beam installed in Chittoor, Andhra Pradesh",
  },
  {
    id: "p03",
    src: "/gallery/03-commercial-block.jpg",
    alt: "Jack array under a foundation wall, mechanical jacks spaced along the plinth course",
  },
  {
    id: "p04",
    src: "/gallery/04-heritage.jpg",
    alt: "Minaret lifted 10 feet and shifted 10 feet in Nagaon, Assam",
  },
  {
    id: "p05",
    src: "/gallery/05-jack-closeup.jpg",
    alt: "Alignment correction and foundation strengthening for a multi-storeyed building in Digha, West Bengal",
  },
  {
    id: "p06",
    src: "/gallery/06-before-after.jpg",
    alt: "Temple being lifted 4.5 feet above road level in Villupuram, Tamil Nadu",
  },
  {
    id: "p07",
    src: "/gallery/07-rcc-pillar.jpg",
    alt: "House on jacks with the new plinth partly built up around it",
  },
  {
    id: "p08",
    src: "/gallery/08-temple.jpg",
    alt: "House being lifted up to 12.5 feet to create stilt parking beneath it in Tirupati, Andhra Pradesh",
  },
  {
    id: "p09",
    src: "/gallery/09-villa-flood.jpg",
    alt: "House being lifted up to 5 feet, with a belt beam installed underneath in Kolkata, West Bengal",
  },
  {
    id: "p10",
    src: "/gallery/10-control-panel.jpg",
    alt: "House being lifted 4 feet in Kochi, Kerala",
  },
];

/* ------------------------------------------------------------------ */
/* Pan-India presence                                                  */
/* ------------------------------------------------------------------ */

/**
 * Real WGS-84 coordinates — PresenceMap projects these onto OpenStreetMap
 * tiles, so a marker lands where the city actually is. Each pin is the city
 * centre, not a specific site address.
 */
export const PRESENCE_CITIES: PresenceCity[] = [
  { id: "bangalore", name: "Bengaluru", lat: 12.9716, lng: 77.5946, projects: 7 },
  { id: "ernakulam", name: "Ernakulam", lat: 9.9816, lng: 76.2999, projects: 4 },
  { id: "kochi", name: "Kochi", lat: 9.9312, lng: 76.2673, projects: 9 },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, projects: 6 },
  { id: "kollam", name: "Kollam", lat: 8.8932, lng: 76.6141, projects: 3 },
  { id: "thrissur", name: "Thrissur", lat: 10.5276, lng: 76.2144, projects: 8 },
  { id: "coimbatore", name: "Coimbatore", lat: 11.0168, lng: 76.9558, projects: 5 },
  { id: "tiruppur", name: "Tiruppur", lat: 11.1085, lng: 77.3411, projects: 2 },
  { id: "salem", name: "Salem", lat: 11.6643, lng: 78.146, projects: 7 },
  { id: "chennai", name: "Chennai", lat: 13.0827, lng: 80.2707, projects: 10 },
  { id: "pondicherry", name: "Pondicherry", lat: 11.9416, lng: 79.8083, projects: 4 },
  { id: "hyderabad", name: "Hyderabad", lat: 17.385, lng: 78.4867, projects: 8 },
  { id: "vijayawada", name: "Vijayawada", lat: 16.5062, lng: 80.648, projects: 6 },
  { id: "rajahmundry", name: "Rajahmundry", lat: 16.9891, lng: 81.2293, projects: 3 },
  { id: "visakhapatnam", name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, projects: 9 },
  { id: "bhubaneswar", name: "Bhubaneswar", lat: 20.2961, lng: 85.8245, projects: 5 },
  { id: "cuttack", name: "Cuttack", lat: 20.4625, lng: 85.883, projects: 7 },
  { id: "bhadrak", name: "Bhadrak", lat: 21.0583, lng: 86.4958, projects: 2 },
  { id: "kolkata", name: "Kolkata", lat: 22.5726, lng: 88.3639, projects: 10 },
  { id: "guwahati", name: "Guwahati", lat: 26.1445, lng: 91.7362, projects: 6 },
  { id: "dibrugarh", name: "Dibrugarh", lat: 27.4728, lng: 94.912, projects: 3 },
  { id: "jorhat", name: "Jorhat", lat: 26.7509, lng: 94.2037, projects: 8 },
  { id: "new-delhi", name: "New Delhi", lat: 28.6139, lng: 77.209, projects: 9 },
  { id: "mumbai", name: "Mumbai", lat: 19.076, lng: 72.8777, projects: 8 },
  { id: "pune", name: "Pune", lat: 18.5204, lng: 73.8567, projects: 6 },
  { id: "ahmedabad", name: "Ahmedabad", lat: 23.0225, lng: 72.5714, projects: 7 },
  { id: "indore", name: "Indore", lat: 22.7196, lng: 75.8577, projects: 5 },
  { id: "mysuru", name: "Mysuru", lat: 12.2958, lng: 76.6394, projects: 4 },
  { id: "sikar", name: "Sikar", lat: 27.6094, lng: 75.1399, projects: 4 },
  { id: "jaipur", name: "Jaipur", lat: 26.9124, lng: 75.7873, projects: 7 },
  { id: "haridwar", name: "Haridwar", lat: 29.9457, lng: 78.1642, projects: 5 },
  { id: "meerut", name: "Meerut", lat: 28.9845, lng: 77.7064, projects: 6 },
];

/* ------------------------------------------------------------------ */
/* Office                                                              */
/* ------------------------------------------------------------------ */

/**
 * TODO(owner): confirm `lat`/`lng`. These point at Nilokheri town in Karnal
 * district, not at 69-C Kalsi itself, so the marker is accurate to roughly the
 * town rather than the gate. Open the office in OpenStreetMap or Google Maps,
 * right-click the exact spot, and paste the coordinates here — the embedded
 * map reads them directly.
 *
 * `spanDeg` is deliberately wide (~2.5 km each way) while the pin is
 * approximate: it shows the surrounding roads rather than implying a precision
 * the coordinate does not have. Tighten it to ~0.004 once verified. The
 * "Get directions" link searches the written address rather than these
 * numbers, so drivers are routed correctly even before that happens.
 */
export const HEAD_OFFICE: OfficeLocation = {
  id: "nilokheri",
  label: "Head Office & Equipment Yard",
  addressLine: CONTACT_INFO.addressLine,
  lat: 29.8339,
  lng: 76.9333,
  spanDeg: 0.022,
};

/* ------------------------------------------------------------------ */
/* Cost calculator structure options                                   */
/* ------------------------------------------------------------------ */

export const STRUCTURE_OPTIONS: StructureOption[] = [
  {
    value: "residential",
    label: "Residential",
    multiplier: 1.0,
    hint: "Houses, villas, bungalows",
  },
  {
    value: "commercial",
    label: "Commercial",
    multiplier: 1.18,
    hint: "Offices, warehouses, shops",
  },
  {
    value: "heritage",
    label: "Heritage / Temple",
    multiplier: 1.35,
    hint: "Requires specialized handling",
  },
];
