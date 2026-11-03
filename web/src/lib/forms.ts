import { WEB3FORMS_KEY } from "@/config/site";

/**
 * Send a form to Web3Forms. Every key in `fields` becomes a line in the
 * notification email, in the order given, so name fields the way staff
 * should read them.
 */
export async function submitWeb3Form(subject: string, fields: Record<string, string>): Promise<void> {
  if (!WEB3FORMS_KEY) throw new Error("Web3Forms key is not configured");
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: "Tha Nail Artistry website", ...fields }),
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
  if (!res.ok || !data?.success) throw new Error(data?.message ?? `Web3Forms responded ${res.status}`);
}

/** Loose phone check: digits, spaces and punctuation, at least 10 digits. */
export function looksLikePhone(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 10;
}

export function todayLabel(): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date()) + " (Central)";
}
