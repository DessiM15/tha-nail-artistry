import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { localeHref, locales } from "@/i18n/config";
import { en } from "@/content/en";

const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/courses", priority: 0.9, freq: "monthly" },
  { path: "/tuition", priority: 0.9, freq: "monthly" },
  { path: "/apply", priority: 0.9, freq: "monthly" },
  { path: "/book-a-tour", priority: 0.9, freq: "monthly" },
  { path: "/financial-aid", priority: 0.8, freq: "monthly" },
  { path: "/which-program", priority: 0.7, freq: "monthly" },
  { path: "/workshops", priority: 0.8, freq: "monthly" },
  { path: "/services", priority: 0.8, freq: "monthly" },
  { path: "/about", priority: 0.7, freq: "yearly" },
  { path: "/founder", priority: 0.7, freq: "yearly" },
  { path: "/team", priority: 0.7, freq: "yearly" },
  { path: "/faqs", priority: 0.7, freq: "monthly" },
  { path: "/contact", priority: 0.7, freq: "yearly" },
  { path: "/press", priority: 0.5, freq: "yearly" },
  { path: "/careers", priority: 0.5, freq: "monthly" },
  { path: "/careers/manicurist-instructor", priority: 0.4, freq: "monthly" },
  { path: "/scholarships", priority: 0.6, freq: "monthly" },
  { path: "/waitlist", priority: 0.5, freq: "monthly" },
  { path: "/graduation", priority: 0.3, freq: "yearly" },
  { path: "/friends-and-family", priority: 0.3, freq: "yearly" },
  { path: "/refund-policy", priority: 0.3, freq: "yearly" },
  { path: "/privacy-policy", priority: 0.3, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const programs = en.pages.programs.map((p) => ({ path: `/courses/${p.slug}`, priority: 0.9, freq: "monthly" as const }));
  const workshops = en.pages.workshops.items.map((w) => ({ path: `/workshops/${w.slug}`, priority: 0.6, freq: "monthly" as const }));
  const all = [...staticPaths, ...programs, ...workshops];
  const lastModified = new Date("2026-10-26T00:00:00Z");

  return all.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localeHref(locale, entry.path)}`,
      lastModified,
      changeFrequency: entry.freq,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l === "en" ? "en-US" : "es-US", `${SITE_URL}${localeHref(l, entry.path)}`])),
      },
    })),
  );
}
