export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** English lives at the root (/courses); Spanish is prefixed (/es/courses). */
export function localeHref(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Strip a locale prefix from a pathname so we can swap languages in place. */
export function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (l === defaultLocale) continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

export const localeNames: Record<Locale, string> = { en: "English", es: "Español" };
export const htmlLang: Record<Locale, string> = { en: "en-US", es: "es-US" };
