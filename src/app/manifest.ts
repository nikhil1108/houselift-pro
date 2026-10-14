import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RR and Sons Building Solution PVT LTD",
    short_name: "RR and Sons",
    description:
      "India's premier engineer-led house lifting and building relocation contractors.",
    start_url: "/",
    display: "standalone",
    background_color: "#17181A",
    theme_color: "#D97706",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
