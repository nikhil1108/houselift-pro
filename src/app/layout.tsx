import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

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

export const metadata: Metadata = {
  title:
    "RR and Sons Building Solution PVT LTD | House Lifting & Structural Elevation Contractors",
  description:
    "Mechanical house lifting, building relocation and foundation strengthening across India. Established 2013 in Nilokheri, Karnal — engineer-led, and the first company in India to rotate a building through 90°.",
  keywords: [
    "house lifting",
    "building lifting",
    "mechanical house lifting",
    "foundation repair",
    "flood protection",
    "structural elevation",
    "building rotation",
    "Nilokheri",
    "Karnal",
    "Haryana",
    "India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "RR and Sons Building Solution PVT LTD",
    title: "RR and Sons Building Solution PVT LTD | House Lifting & Structural Elevation",
    description:
      "Mechanical House Lifting held to ±2 mm across every jack point. Engineer-led since 2013, India Book of Records holder, 100% safety agreement on court documentation.",
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
      <body className="font-sans overflow-x-hidden max-w-full w-full">{children}</body>
    </html>
  );
}
