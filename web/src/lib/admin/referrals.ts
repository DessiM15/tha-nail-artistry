import "server-only";
import { db } from "./db";

/** A student has to stay enrolled this many days after class starts before the educator is paid. */
export const PAYOUT_WAIT_DAYS = 30;
/** Window Gen uses to count an educator's referrals toward the payout tier. */
export const TIER_WINDOW_MONTHS = 4;

export type ReferralStatus = "applied" | "enrolled" | "withdrawn";
export type Stage = "applied" | "needs-start" | "waiting" | "due" | "paid" | "withdrawn";

export interface Educator {
  id: number;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  referralCount: number;
  recentCount: number;
}

export interface Referral {
  id: number;
  educatorId: number;
  educatorName: string;
  code: string;
  studentName: string;
  studentEmail: string | null;
  studentPhone: string | null;
  appliedOn: string | null;
  classStart: string | null;
  eligibleOn: string | null;
  status: ReferralStatus;
  payoutCents: number | null;
  paidOn: string | null;
  source: "manual" | "wix";
  notes: string | null;
  stage: Stage;
}

/** Today's date in Houston, as YYYY-MM-DD. */
export function todayInHouston(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function stageOf(r: { status: ReferralStatus; paidOn: string | null; classStart: string | null; eligibleOn: string | null }, today: string): Stage {
  if (r.paidOn) return "paid";
  if (r.status === "withdrawn") return "withdrawn";
  if (r.status === "applied") return "applied";
  if (!r.classStart || !r.eligibleOn) return "needs-start";
  return r.eligibleOn <= today ? "due" : "waiting";
}

export async function listEducators(): Promise<Educator[]> {
  const sql = await db();
  const rows = await sql`
    SELECT e.id, e.name, e.code, e.email, e.phone, e.notes,
      count(r.id) FILTER (WHERE r.status <> 'withdrawn')::int AS referral_count,
      count(r.id) FILTER (
        WHERE r.status <> 'withdrawn'
          AND coalesce(r.applied_on, r.created_at::date) >= (current_date - make_interval(months => ${TIER_WINDOW_MONTHS}))
      )::int AS recent_count
    FROM educators e
    LEFT JOIN referrals r ON r.educator_id = e.id
    GROUP BY e.id
    ORDER BY lower(e.name)`;
  return rows.map((r) => ({
    id: r.id as number,
    name: r.name as string,
    code: r.code as string,
    email: (r.email as string | null) ?? null,
    phone: (r.phone as string | null) ?? null,
    notes: (r.notes as string | null) ?? null,
    referralCount: r.referral_count as number,
    recentCount: r.recent_count as number,
  }));
}

export async function listReferrals(): Promise<Referral[]> {
  const sql = await db();
  const today = todayInHouston();
  const rows = await sql`
    SELECT r.id, r.educator_id, e.name AS educator_name, e.code,
      r.student_name, r.student_email, r.student_phone,
      r.applied_on::text AS applied_on,
      r.class_start::text AS class_start,
      (r.class_start + ${PAYOUT_WAIT_DAYS}::int)::text AS eligible_on,
      r.status, r.payout_cents, r.paid_on::text AS paid_on, r.source, r.notes
    FROM referrals r
    JOIN educators e ON e.id = r.educator_id
    ORDER BY coalesce(r.applied_on, r.created_at::date) DESC, r.id DESC`;
  return rows.map((r) => {
    const base = {
      id: r.id as number,
      educatorId: r.educator_id as number,
      educatorName: r.educator_name as string,
      code: r.code as string,
      studentName: r.student_name as string,
      studentEmail: (r.student_email as string | null) ?? null,
      studentPhone: (r.student_phone as string | null) ?? null,
      appliedOn: (r.applied_on as string | null) ?? null,
      classStart: (r.class_start as string | null) ?? null,
      eligibleOn: (r.eligible_on as string | null) ?? null,
      status: r.status as ReferralStatus,
      payoutCents: (r.payout_cents as number | null) ?? null,
      paidOn: (r.paid_on as string | null) ?? null,
      source: r.source as "manual" | "wix",
      notes: (r.notes as string | null) ?? null,
    };
    return { ...base, stage: stageOf(base, today) };
  });
}
