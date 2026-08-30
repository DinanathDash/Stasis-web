import { MetadataRoute } from "next";

const siteUrl = "https://stasis.dinanath.dev";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stasis",
    short_name: "Stasis",
    description: "A smarter battery icon for your MacBook.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: `${siteUrl}/android-chrome-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${siteUrl}/android-chrome-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
