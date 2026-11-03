import type { NextConfig } from "next";
import { SITE_URL, WIX_BASE_URL, features } from "./src/config/site";

/**
 * Paths that only exist on the Wix site (student portal, bookings, store, forms).
 * Once www points at this site, old links, emails and search results that still
 * use these paths are forwarded to the portal subdomain so nothing a student
 * bookmarked breaks. Skipped while Wix and this site share a host (local review).
 */
const wixOnlyPaths = [
  "/account/:path*",
  "/service-page/:path*",
  "/booking-calendar/:path*",
  "/product-page/:path*",
  "/category/:path*",
  "/cart-page",
  "/payment-request-page",
  "/intake-form",
  "/inquiry-services-page",
  "/nailinstructorposition",
  "/scholarship",
  "/admin",
  "/home-redesign",
  "/_api/:path*",
];

/** Old Wix page slugs that have a home on this site under a different name. */
const renamedPages: Record<string, string> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/our-team": "/team",
  "/instructors": "/team",
  "/partner-with-us": "/contact",
  "/scholarships": "/financial-aid",
  "/es/scholarships": "/es/financial-aid",
};

function host(url: string): string {
  try { return new URL(url).host; } catch { return ""; }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    const toPortal = host(WIX_BASE_URL) && host(WIX_BASE_URL) !== host(SITE_URL)
      ? wixOnlyPaths.map((source) => ({ source, destination: `${WIX_BASE_URL}${source}`, permanent: false }))
      : [];
    const renamed = Object.entries(renamedPages).map(([source, destination]) => ({ source, destination, permanent: true }));
    const events = [
      ...(features.graduationPage ? [] : [{ source: "/graduation", destination: `${WIX_BASE_URL}/graduation`, permanent: false }]),
      ...(features.friendsFamilyPage ? [] : [{ source: "/friendsandfamily", destination: "/services", permanent: false }]),
    ];
    return [...toPortal, ...renamed, ...events];
  },
};

export default nextConfig;
