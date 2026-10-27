import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tha Nail Artistry Academy",
    short_name: "TNAA",
    description: "Nail school in Houston, TX. Become a licensed nail tech.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [{ src: "/images/emblem.png", sizes: "386x386", type: "image/png" }],
  };
}
