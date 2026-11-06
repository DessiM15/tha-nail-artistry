import type { Program } from "@/content/types";

/**
 * Tuition per program, from Gen's price sheet (November 5, 2026).
 * Plan totals include the down payment (`enrollment.downPayment` in site.ts).
 * Installment amounts are Gen's own figures, rounded up to the next dollar.
 * Update numbers HERE and the tuition and financial aid pages follow in both languages.
 */
export interface TuitionPlan {
  months: number;
  total: number;
  monthly: number;
  biweekly: number;
  weekly: number;
}

export interface ProgramTuition {
  payInFull: number;
  plans: TuitionPlan[];
}

export const tuition: Record<Program["slug"], ProgramTuition> = {
  core: {
    payInFull: 6000,
    plans: [
      { months: 4, total: 6600, monthly: 1425, biweekly: 713, weekly: 357 },
      { months: 6, total: 7200, monthly: 1050, biweekly: 525, weekly: 263 },
    ],
  },
  specialty: {
    payInFull: 8000,
    plans: [
      { months: 4, total: 8600, monthly: 1925, biweekly: 963, weekly: 482 },
      { months: 6, total: 9200, monthly: 1384, biweekly: 692, weekly: 346 },
    ],
  },
  complete: {
    payInFull: 10500,
    plans: [
      { months: 4, total: 11100, monthly: 2550, biweekly: 1275, weekly: 638 },
      { months: 6, total: 11700, monthly: 1800, biweekly: 900, weekly: 450 },
    ],
  },
};

/** Lowest and highest total for a program: pay in full up to the longest plan. */
export function tuitionRange(slug: Program["slug"]): { min: number; max: number } {
  const t = tuition[slug];
  const totals = [t.payInFull, ...t.plans.map((p) => p.total)];
  return { min: Math.min(...totals), max: Math.max(...totals) };
}
