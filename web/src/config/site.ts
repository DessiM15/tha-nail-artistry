/**
 * Single source of truth for business facts, dates and external links.
 * Gen (or Smart Scale) updates dates and links HERE and the whole site,
 * in both languages, follows.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.thanailartistry.com";

/**
 * Where the Wix site lives once the new site takes over www.
 * Until the subdomain is set up this points at the current Wix domain so every
 * link keeps working during review. See docs/WIX-SUBDOMAIN-GUIDE.md.
 */
export const WIX_BASE_URL =
  process.env.NEXT_PUBLIC_WIX_BASE_URL?.replace(/\/$/, "") ??
  "https://www.thanailartistry.com";

export const business = {
  name: "Tha Nail Artistry Academy",
  shortName: "Tha Nail Artistry",
  legalName: "Tha Nail Artistry Academy",
  founded: 2024,
  phone: "346-724-7565",
  phoneDisplay: "(346) 724-7565",
  phoneHref: "tel:+13467247565",
  smsHref: "sms:+13467247565",
  email: "contact@thanailartistry.com",
  admissionsEmail: "admissions@thanailartistry.com",
  address: {
    street: "13150 FM 529 #108",
    city: "Houston",
    region: "TX",
    postalCode: "77041",
    country: "US",
  },
  geo: { lat: 29.8767, lng: -95.6069 },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=13150+FM+529+%23108+Houston+TX+77041",
  social: {
    facebook: "https://www.facebook.com/thanailartistryacademy",
    instagram: "https://www.instagram.com/thanailartistryacademy/",
    tiktok: "https://www.tiktok.com/@thanailartistryacademy",
    handle: "@thanailartistryacademy",
  },
  hours: {
    class: [
      { days: "mon-fri", open: "09:00", close: "21:00" },
      { days: "sat-sun", open: "10:00", close: "19:00" },
    ],
    office: [{ days: "mon-fri", open: "09:00", close: "18:00" }],
  },
  /** TDLR = Texas Department of Licensing and Regulation */
  licensing: "Licensed by the Texas Department of Licensing and Regulation (TDLR)",
  press: {
    voyageHouston:
      "https://voyagehouston.com/interview/hidden-gems-meet-genevieve-henriquez-of-tha-nail-artistry-academy/",
  },
} as const;

/** Enrollment calendar. ISO dates; formatted per locale at render time. */
export const enrollment = {
  nextClassStart: "2026-11-09",
  enrollmentDeadline: "2026-10-29",
  applicationFee: 150,
  downPayment: 900,
} as const;

/** Smart Scale credit in the footer. */
export const agency = {
  name: "Smart Scale LLC",
  url: "https://smartscaleagent.com/portfolio",
} as const;
