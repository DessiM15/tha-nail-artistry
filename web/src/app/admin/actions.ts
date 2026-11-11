"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/admin/db";
import { endSession, isSignedIn, passwordMatches, startSession } from "@/lib/admin/session";
import { tierCentsFor, todayInHouston } from "@/lib/admin/referrals";
import { getWixPerson, hasWixKey, listCouponOrders, normalizeCode } from "@/lib/admin/wix-orders";

export interface ActionResult {
  ok: boolean;
  message: string;
}

const done = (message = ""): ActionResult => ({ ok: true, message });
const fail = (message: string): ActionResult => ({ ok: false, message });
const SIGNED_OUT = fail("You have been signed out. Refresh the page and sign in again.");

const text = (form: FormData, key: string): string => String(form.get(key) ?? "").trim();
const optional = (form: FormData, key: string): string | null => text(form, key) || null;

function optionalDate(form: FormData, key: string): string | null | undefined {
  const value = text(form, key);
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : undefined;
}

/** "150", "150.50" or "$150" to cents. Blank is null, anything else is undefined (invalid). */
function optionalCents(form: FormData, key: string): number | null | undefined {
  const value = text(form, key).replace(/[$,\s]/g, "");
  if (!value) return null;
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(value)) return undefined;
  return Math.round(Number(value) * 100);
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}

/* ------------------------------ Sign in ------------------------------ */

const MAX_FAILURES = 8;

export async function signIn(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const sql = await db();
  const [{ failures }] = await sql`SELECT count(*)::int AS failures FROM admin_login_failures WHERE ip = ${ip} AND at > now() - interval '15 minutes'`;
  if ((failures as number) >= MAX_FAILURES) return fail("Too many tries. Wait 15 minutes and try again.");

  if (!passwordMatches(text(form, "password"))) {
    await sql`INSERT INTO admin_login_failures (ip) VALUES (${ip})`;
    await sql`DELETE FROM admin_login_failures WHERE at < now() - interval '1 day'`;
    return fail("That password is not right.");
  }
  await startSession();
  return done();
}

export async function signOut(): Promise<void> {
  await endSession();
}

/* ----------------------------- Educators ----------------------------- */

export async function saveEducator(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (!(await isSignedIn())) return SIGNED_OUT;
  const id = Number(text(form, "id")) || null;
  const name = text(form, "name");
  const code = normalizeCode(text(form, "code"));
  if (!name) return fail("Add the educator's name.");
  if (!code) return fail("Add the educator's promo code.");
  if (code.length > 20) return fail("Wix promo codes are 20 characters or fewer.");

  const sql = await db();
  try {
    if (id) {
      await sql`UPDATE educators SET name = ${name}, code = ${code}, email = ${optional(form, "email")}, phone = ${optional(form, "phone")}, notes = ${optional(form, "notes")} WHERE id = ${id}`;
    } else {
      await sql`INSERT INTO educators (name, code, email, phone, notes) VALUES (${name}, ${code}, ${optional(form, "email")}, ${optional(form, "phone")}, ${optional(form, "notes")})`;
    }
  } catch (err) {
    if (isUniqueViolation(err)) return fail(`The code ${code} already belongs to another educator.`);
    throw err;
  }
  refresh();
  return done("Saved.");
}

export async function deleteEducator(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (!(await isSignedIn())) return SIGNED_OUT;
  const id = Number(text(form, "id"));
  if (!id) return fail("Educator not found.");
  const sql = await db();
  const [{ total }] = await sql`SELECT count(*)::int AS total FROM referrals WHERE educator_id = ${id}`;
  if ((total as number) > 0) return fail("This educator has referrals on file, so they cannot be removed.");
  await sql`DELETE FROM educators WHERE id = ${id}`;
  refresh();
  return done("Removed.");
}

/* ----------------------------- Referrals ----------------------------- */

export async function saveReferral(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (!(await isSignedIn())) return SIGNED_OUT;
  const id = Number(text(form, "id")) || null;
  const educatorId = Number(text(form, "educatorId"));
  const studentName = text(form, "studentName");
  const status = text(form, "status");
  const appliedOn = optionalDate(form, "appliedOn");
  const classStart = optionalDate(form, "classStart");
  const paidOn = optionalDate(form, "paidOn");
  const payoutCents = optionalCents(form, "payout");

  if (!educatorId) return fail("Choose the educator who referred this student.");
  if (!studentName) return fail("Add the student's name.");
  if (!["applied", "enrolled", "withdrawn"].includes(status)) return fail("Choose a status.");
  if (appliedOn === undefined || classStart === undefined || paidOn === undefined) return fail("One of the dates is not valid.");
  if (payoutCents === undefined) return fail("Enter the payout as a dollar amount, like 150.");

  const email = optional(form, "studentEmail");
  const phone = optional(form, "studentPhone");
  const notes = optional(form, "notes");
  const sql = await db();
  let savedId = id;
  if (id) {
    await sql`
      UPDATE referrals SET educator_id = ${educatorId}, student_name = ${studentName}, student_email = ${email}, student_phone = ${phone},
        applied_on = ${appliedOn}, class_start = ${classStart}, status = ${status}, payout_cents = ${payoutCents}, paid_on = ${paidOn}, notes = ${notes}
      WHERE id = ${id}`;
  } else {
    const [row] = await sql`
      INSERT INTO referrals (educator_id, student_name, student_email, student_phone, applied_on, class_start, status, payout_cents, paid_on, notes)
      VALUES (${educatorId}, ${studentName}, ${email}, ${phone}, ${appliedOn}, ${classStart}, ${status}, ${payoutCents}, ${paidOn}, ${notes})
      RETURNING id`;
    savedId = row.id as number;
  }
  // A paid referral keeps the amount it was paid at, even if the educator's tier changes later.
  if (paidOn && payoutCents === null && savedId) {
    const tier = await tierCentsFor(savedId);
    if (tier === null) {
      await sql`UPDATE referrals SET paid_on = NULL WHERE id = ${savedId}`;
      refresh();
      return fail("Saved, but not marked paid. Add the payout amount first.");
    }
    await sql`UPDATE referrals SET payout_cents = ${tier} WHERE id = ${savedId}`;
  }
  refresh();
  return done("Saved.");
}

export async function markPaid(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (!(await isSignedIn())) return SIGNED_OUT;
  const id = Number(text(form, "id"));
  if (!id) return fail("Referral not found.");
  const sql = await db();
  // Freeze the tier amount at the moment of payment so it never shifts afterwards.
  const tier = await tierCentsFor(id);
  const updated = await sql`
    UPDATE referrals SET paid_on = ${todayInHouston()}, payout_cents = coalesce(payout_cents, ${tier})
    WHERE id = ${id} AND paid_on IS NULL AND coalesce(payout_cents, ${tier}) IS NOT NULL
    RETURNING id`;
  if (updated.length === 0) return fail("Add the payout amount first, then mark it paid.");
  refresh();
  return done("Marked paid.");
}

export async function deleteReferral(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (!(await isSignedIn())) return SIGNED_OUT;
  const id = Number(text(form, "id"));
  if (!id) return fail("Referral not found.");
  const sql = await db();
  // Referrals that came from Wix would only come back on the next check, so those are marked withdrawn instead.
  await sql`DELETE FROM referrals WHERE id = ${id} AND source = 'manual'`;
  refresh();
  return done("Removed.");
}

/* ------------------------------ Wix sync ------------------------------ */

export async function checkWix(_prev: ActionResult): Promise<ActionResult> {
  void _prev;
  if (!(await isSignedIn())) return SIGNED_OUT;
  if (!hasWixKey()) return fail("The Wix connection is not set up yet.");

  const sql = await db();
  let orders;
  try {
    orders = await listCouponOrders();
  } catch (err) {
    return fail(`Could not reach Wix. ${err instanceof Error ? err.message : ""}`.trim());
  }

  const educators = await sql`SELECT id, code FROM educators`;
  const byCode = new Map(educators.map((e) => [e.code as string, e.id as number]));
  const known = new Set((await sql`SELECT wix_order_id FROM referrals WHERE wix_order_id IS NOT NULL`).map((r) => r.wix_order_id as string));

  let added = 0;
  const unmatched = new Set<string>();
  for (const order of orders) {
    const educatorId = byCode.get(order.code);
    if (!educatorId) {
      unmatched.add(order.code);
      continue;
    }
    if (known.has(order.orderId) || order.canceled) continue;

    const person = order.contactId ? await getWixPerson(order.contactId) : { name: null, email: null, phone: null };
    const name = person.name ?? person.email ?? "Name not on the Wix order";
    const appliedOn = order.createdDate && !Number.isNaN(Date.parse(order.createdDate))
      ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(order.createdDate))
      : todayInHouston();
    const inserted = await sql`
      INSERT INTO referrals (educator_id, student_name, student_email, student_phone, applied_on, source, wix_order_id)
      VALUES (${educatorId}, ${name}, ${person.email}, ${person.phone}, ${appliedOn}, 'wix', ${order.orderId})
      ON CONFLICT (wix_order_id) DO NOTHING
      RETURNING id`;
    added += inserted.length;
  }

  refresh();
  const summary = added === 0 ? "No new referrals in Wix." : `Added ${added} new ${added === 1 ? "referral" : "referrals"} from Wix.`;
  const extra = unmatched.size ? ` Codes used in Wix with no educator here: ${[...unmatched].sort().join(", ")}.` : "";
  return done(summary + extra);
}
