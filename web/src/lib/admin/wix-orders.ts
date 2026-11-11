import "server-only";

/**
 * Reads application fee orders from Wix Pricing Plans with the site owner's API key.
 * The promo code a student typed at checkout is on the order at
 * pricing.prices[].price.coupon.code.
 *
 * Docs: https://dev.wix.com/docs/api-reference/business-solutions/pricing-plans/orders/order-management-service-list-orders
 */

const API = "https://www.wixapis.com";
const PAGE_SIZE = 50;
const MAX_PAGES = 40;

export interface WixCouponOrder {
  orderId: string;
  code: string;
  contactId: string | null;
  planName: string | null;
  createdDate: string | null;
  canceled: boolean;
}

export interface WixPerson {
  name: string | null;
  email: string | null;
  phone: string | null;
}

export function hasWixKey(): boolean {
  return Boolean(process.env.WIX_API_KEY && process.env.WIX_SITE_ID);
}

async function wix<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: process.env.WIX_API_KEY ?? "", "wix-site-id": process.env.WIX_SITE_ID ?? "" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Wix responded ${res.status} for ${path.split("?")[0]}${body ? `: ${body.slice(0, 200)}` : ""}`);
  }
  return (await res.json()) as T;
}

interface RawOrder {
  id?: string;
  planName?: string;
  createdDate?: string;
  status?: string;
  buyer?: { contactId?: string; memberId?: string };
  pricing?: { prices?: { price?: { coupon?: { code?: string } } }[] };
}

/** Codes are compared without spaces and in capitals, so "Jane 150" in Wix matches "JANE150" here. */
export function normalizeCode(code: string): string {
  return code.replace(/\s+/g, "").toUpperCase();
}

/**
 * Every order that was placed with a coupon code, newest first.
 * Uses the BASIC field set on purpose: the intake form answers hold sensitive
 * details (the form asks for a Social Security number) and the tracker never needs them.
 */
export async function listCouponOrders(): Promise<WixCouponOrder[]> {
  const found: WixCouponOrder[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await wix<{ orders?: RawOrder[] }>(`/pricing-plans/v2/orders?fieldSet=BASIC&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`);
    const orders = data.orders ?? [];
    for (const order of orders) {
      const code = order.pricing?.prices?.map((p) => p.price?.coupon?.code).find(Boolean);
      if (!order.id || !code) continue;
      found.push({
        orderId: order.id,
        code: normalizeCode(code),
        contactId: order.buyer?.contactId ?? order.buyer?.memberId ?? null,
        planName: order.planName ?? null,
        createdDate: order.createdDate ?? null,
        canceled: order.status === "CANCELED",
      });
    }
    if (orders.length < PAGE_SIZE) break;
  }
  return found;
}

interface RawContact {
  contact?: {
    info?: { name?: { first?: string; last?: string } };
    primaryInfo?: { email?: string; phone?: string };
  };
}

/** Name and contact details for the buyer. Returns blanks if the key cannot read contacts. */
export async function getWixPerson(contactId: string): Promise<WixPerson> {
  try {
    const data = await wix<RawContact>(`/contacts/v4/contacts/${encodeURIComponent(contactId)}`);
    const name = [data.contact?.info?.name?.first, data.contact?.info?.name?.last].filter(Boolean).join(" ").trim();
    return { name: name || null, email: data.contact?.primaryInfo?.email ?? null, phone: data.contact?.primaryInfo?.phone ?? null };
  } catch {
    return { name: null, email: null, phone: null };
  }
}
