import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale, localeHref, type Locale } from "@/i18n/config";

/** Resolve the locale param once per page and hand back content + a localized href helper. */
export async function getPage(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getContent(locale);
  const href = (path: string) => localeHref(locale, path);
  return { locale: locale as Locale, t, href };
}
