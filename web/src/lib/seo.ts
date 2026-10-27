import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import { localeHref, type Locale } from "@/i18n/config";

interface Args {
  locale: Locale;
  /** Locale-less path, e.g. "/courses/core" */
  path: string;
  title: string;
  description: string;
  kicker?: string;
  noIndex?: boolean;
}

const ogLocale: Record<Locale, string> = { en: "en_US", es: "es_US" };

export function buildMetadata({ locale, path, title, description, kicker, noIndex }: Args): Metadata {
  const url = `${SITE_URL}${localeHref(locale, path)}`;
  const og = new URL("/og", SITE_URL);
  og.searchParams.set("title", title);
  og.searchParams.set("locale", locale);
  if (kicker) og.searchParams.set("kicker", kicker);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "en-US": `${SITE_URL}${localeHref("en", path)}`,
        "es-US": `${SITE_URL}${localeHref("es", path)}`,
        "x-default": `${SITE_URL}${localeHref("en", path)}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Tha Nail Artistry Academy",
      locale: ogLocale[locale],
      images: [{ url: og.toString(), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og.toString()] },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
