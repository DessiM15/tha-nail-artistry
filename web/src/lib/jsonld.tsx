import { SITE_URL, business } from "@/config/site";
import { localeHref, type Locale } from "@/i18n/config";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, author-controlled data; escape "<" to keep it inert inside <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: business.name,
    url: `${SITE_URL}${localeHref(locale, "/")}`,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/campus/storefront.jpg`,
    telephone: "+1-346-724-7565",
    email: business.email,
    foundingDate: String(business.founded),
    founder: { "@type": "Person", name: "Genevieve Henriquez" },
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    areaServed: ["Houston", "Cypress", "Jersey Village", "Katy", "Northwest Houston"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "10:00", closes: "19:00" },
    ],
    sameAs: [business.social.facebook, business.social.instagram, business.social.tiktok],
    availableLanguage: ["English", "Spanish"],
    priceRange: "$$",
  };
}

export function courseJsonLd(args: { locale: Locale; path: string; name: string; description: string; schedule: string; months: number; price?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: args.name,
    description: args.description,
    url: `${SITE_URL}${localeHref(args.locale, args.path)}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    inLanguage: args.locale === "es" ? "es" : "en",
    educationalCredentialAwarded: "Texas Manicurist License eligibility (TDLR)",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Blended", "Onsite", "Online"],
      courseSchedule: { "@type": "Schedule", repeatFrequency: "Weekly", duration: `P${args.months}M`, description: args.schedule },
      location: { "@type": "Place", name: business.name, address: `${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}` },
    },
    ...(args.price ? { offers: { "@type": "Offer", price: args.price, priceCurrency: "USD" } } : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

export function breadcrumbJsonLd(locale: Locale, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${localeHref(locale, c.path)}` })),
  };
}
