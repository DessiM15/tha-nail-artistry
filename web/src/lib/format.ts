import type { Locale } from "@/i18n/config";

const tags: Record<Locale, string> = { en: "en-US", es: "es-US" };

export function formatDate(iso: string, locale: Locale, opts?: Intl.DateTimeFormatOptions): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat(tags[locale], { month: "long", day: "numeric", year: "numeric", timeZone: "UTC", ...opts }).format(date);
}

export function daysUntil(iso: string, now = new Date()): number {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((target - today) / 86_400_000);
}

/** Replace {placeholders} in a content string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export function daysLabel(common: { oneDayPerWeek: string; daysPerWeek: string }, n: number): string {
  return n === 1 ? common.oneDayPerWeek : fill(common.daysPerWeek, { n });
}
