import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://myhouselifting.com";
  const currentDate = new Date().toISOString();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
