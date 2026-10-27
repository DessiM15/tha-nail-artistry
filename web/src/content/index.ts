import type { Locale } from "@/i18n/config";
import type { SiteContent } from "./types";
import { en } from "./en";
import { es } from "./es";

const dictionaries: Record<Locale, SiteContent> = { en, es };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}

export type { SiteContent } from "./types";
