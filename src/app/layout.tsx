import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { BusinessStructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#D97706",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://myhouselifting.com"),
  title: {
    default: "House Lifting Services in India | RR and Sons",
    template: "%s | RR and Sons",
  },
  description:
    "India's premier house lifting services. Elevate your structure 2 to 14 ft safely above flood levels with 100% legal court safety agreement & 10-year warranty.",
  keywords: [
    "house lifting services in India",
    "house lifting cost in India",
    "building lifting contractors",
    "building shifting and relocation",
    "house elevation without demolition",
    "hydraulic house lifting",
    "mechanical house lifting",
    "foundation strengthening and repair",
    "stilt parking under existing house",
    "temple relocation India",
    "building rotation 90 degrees",
    "waterlogging flood protection house lift",
    "RR and Sons Building Solution",
    "my house lifting",
    "myhouselifting.com",
    "house lifting Nilokheri Karnal Haryana",
    "house lifting Delhi NCR",
    "house lifting Punjab",
    "house lifting Uttar Pradesh",
    "house lifting Rajasthan",
    "house lifting Bangalore",
    "house lifting Kerala",
    "house lifting Tamil Nadu",
    "house lifting West Bengal",
    "house lifting Maharashtra",
  ],
  authors: [
    {
      name: "RR and Sons Building Solution PVT LTD",
      url: "https://myhouselifting.com",
    },
  ],
  creator: "RR and Sons Building Solution PVT LTD",
  publisher: "RR and Sons Building Solution PVT LTD",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://myhouselifting.com",
    siteName: "RR and Sons Building Solution PVT LTD | MyHouseLifting.com",
    title: "House Lifting Services in India | RR and Sons",
    description:
      "Precision mechanical house lifting held to ±2 mm across every jack point. Raise your home 2 to 14 ft safely above flood and road levels with zero damage guarantee.",
    images: [
      {
        url: "/gallery/01-salem-wide.jpg",
        width: 1200,
        height: 630,
        alt: "RR and Sons House Lifting Project in India - Raised 5 ft Above Road Level",
      },
      {
        url: "/gallery/03-commercial-elevation.jpg",
        width: 1200,
        height: 630,
        alt: "4-Storey Commercial Building Elevation - RR and Sons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House Lifting & Building Elevation in India | RR and Sons",
    description:
      "Lift your building 2 to 14 ft safely above road level without demolition. 2,500+ successful lifts pan-India. 100% legal court safety agreement.",
    images: ["/gallery/01-salem-wide.jpg"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
  other: {
    "geo.region": "IN-HR",
    "geo.placename": "Nilokheri, Karnal, Haryana, India",
    "geo.position": "29.8333;76.9167",
    ICBM: "29.8333, 76.9167",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} overflow-x-hidden max-w-full`}
    >
      <body className="font-sans overflow-x-hidden max-w-full w-full">
        <BusinessStructuredData />
        {children}
      </body>
    </html>
  );
}
