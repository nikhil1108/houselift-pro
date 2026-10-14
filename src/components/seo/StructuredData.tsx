import { CONTACT_INFO, FAQ_ITEMS, SERVICES, TESTIMONIALS } from "@/components/data/mockData";

const BASE_URL = "https://myhouselifting.com";

/**
 * Core Organization, LocalBusiness, and WebSite structured data.
 * Valid schema.org markup reflecting visible company credentials,
 * verified reviews, services, and geographic operating boundaries.
 */
export function BusinessStructuredData(): JSX.Element {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${BASE_URL}/#business`,
    name: "RR and Sons Building Solution PVT LTD",
    alternateName: [
      "RR & Sons House Lifting Services",
      "RR and Sons",
      "My House Lifting",
      "MyHouseLifting.com",
    ],
    url: BASE_URL,
    logo: `${BASE_URL}/RRandSonsLogo.png`,
    image: [
      `${BASE_URL}/gallery/01-salem-wide.jpg`,
      `${BASE_URL}/gallery/03-commercial-elevation.jpg`,
      `${BASE_URL}/gallery/04-heritage.jpg`,
    ],
    description:
      "India's premier engineer-led house lifting, building relocation, and foundation repair company. Over 2,500 structures elevated safely with 100% legal court safety agreement and 10-year warranty.",
    telephone: CONTACT_INFO.phonePrimary,
    email: CONTACT_INFO.email,
    priceRange: "₹₹",
    foundingDate: `${CONTACT_INFO.foundedYear}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "69-C, Kalsi, P.O. Nilokheri",
      addressLocality: "Nilokheri",
      addressRegion: "Haryana",
      postalCode: "132117",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.8333,
      longitude: 76.9167,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [
      CONTACT_INFO.socials.youtube,
      CONTACT_INFO.socials.facebook,
      CONTACT_INFO.socials.instagram,
    ],
    founder: [
      {
        "@type": "Person",
        name: "Gurdeep Kumar",
        jobTitle: "Civil Engineer & Co-Founder",
      },
      {
        "@type": "Person",
        name: "Sandeep Kumar",
        jobTitle: "Mechanical Engineer & Co-Founder",
      },
    ],
    award: "India Book of Records Holder - 90 Degree Building Rotation",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "135",
      bestRating: "5",
      worstRating: "1",
    },
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: "5",
      },
      reviewBody: t.quote,
    })),
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "State", name: "Haryana" },
      { "@type": "State", name: "Punjab" },
      { "@type": "State", name: "Delhi" },
      { "@type": "State", name: "Uttar Pradesh" },
      { "@type": "State", name: "Rajasthan" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "State", name: "Kerala" },
      { "@type": "State", name: "Karnataka" },
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "State", name: "West Bengal" },
      { "@type": "State", name: "Maharashtra" },
      { "@type": "State", name: "Assam" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "House Lifting & Structural Elevation Services",
      itemListElement: SERVICES.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          provider: {
            "@id": `${BASE_URL}/#business`,
          },
        },
      })),
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "RR and Sons Building Solution PVT LTD",
    description:
      "House Lifting, Building Shifting & Structural Elevation Contractors in India.",
    publisher: {
      "@id": `${BASE_URL}/#business`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

/**
 * FAQPage Schema for Google Rich Snippets in SERP.
 * Strictly scoped to pages where the FAQ component is rendered.
 */
export function FaqStructuredData(): JSX.Element {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
