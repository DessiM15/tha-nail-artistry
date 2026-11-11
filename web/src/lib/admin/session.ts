import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * One shared password (ADMIN_PASSWORD) guards the admin page. A successful login
 * sets a signed, http-only cookie. The signing key is derived from the password,
 * so changing the password in Vercel signs everyone out.
 */

const COOKIE = "tna_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function password(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function hasAdminPassword(): boolean {
  return password().length >= 8;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function sign(expires: number): string {
  return createHmac("sha256", digest(`tna-admin-session:${password()}`)).update(String(expires)).digest("hex");
}

export function passwordMatches(candidate: string): boolean {
  if (!hasAdminPassword()) return false;
  return timingSafeEqual(digest(candidate), digest(password()));
}

export async function isSignedIn(): Promise<boolean> {
  if (!hasAdminPassword()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expiresRaw, signature] = value.split(".");
  const expires = Number(expiresRaw);
  if (!signature || !Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = Buffer.from(sign(expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function startSession(): Promise<void> {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/admin", maxAge: 0 });
}
