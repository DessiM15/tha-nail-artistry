import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Referral tracker storage (Neon Postgres, connected through the Vercel integration).
 * Wix stays the source of truth for orders; this database only holds what Wix
 * does not know: which educator owns which promo code, and payout progress.
 */

let client: NeonQueryFunction<false, false> | null = null;
let ready: Promise<void> | null = null;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function sql(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}

/** Creates the tables on first use, so a fresh database needs no manual setup. */
async function migrate(): Promise<void> {
  const q = sql();
  await q`
    CREATE TABLE IF NOT EXISTS educators (
      id serial PRIMARY KEY,
      name text NOT NULL,
      code text NOT NULL UNIQUE,
      email text,
      phone text,
      notes text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await q`
    CREATE TABLE IF NOT EXISTS referrals (
      id serial PRIMARY KEY,
      educator_id integer NOT NULL REFERENCES educators(id) ON DELETE CASCADE,
      student_name text NOT NULL,
      student_email text,
      student_phone text,
      applied_on date,
      class_start date,
      status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'enrolled', 'withdrawn')),
      payout_cents integer,
      paid_on date,
      source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'wix')),
      wix_order_id text UNIQUE,
      notes text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await q`
    CREATE TABLE IF NOT EXISTS admin_login_failures (
      ip text NOT NULL,
      at timestamptz NOT NULL DEFAULT now()
    )`;
}

export async function db(): Promise<NeonQueryFunction<false, false>> {
  ready ??= migrate().catch((err) => {
    ready = null;
    throw err;
  });
  await ready;
  return sql();
}
