# Keeping the Wix back office alive when the new site goes live

The new site is the public face. Wix keeps doing what it does today: student portal and logins, payment plans, tour and workshop bookings, student services, the store (graduation tickets, scrub tops), and the scholarship, waitlist and instructor application forms.

Right now Wix owns `www.thanailartistry.com`. When the new site takes that address, Wix needs its own address or every booking, login and apply link breaks. The fix is a subdomain.

## The plan

| What | Address |
| --- | --- |
| New website (Next.js on Vercel) | `www.thanailartistry.com` and `thanailartistry.com` |
| Wix site (portal, bookings, store, forms) | `portal.thanailartistry.com` |

Every link on the new site that points into Wix is built from one setting, `NEXT_PUBLIC_WIX_BASE_URL`. Change that one value to `https://portal.thanailartistry.com` and all links update at once.

## Status (November 3, 2026)

Phase one is done. Gen added `portal.thanailartistry.com` in Wix, Wix created the DNS record itself and the portal address is live over HTTPS as a secondary domain that redirects to www. The Vercel project has both `thanailartistry.com` and `www.thanailartistry.com` attached and the production environment already points Wix links at the portal. Nothing students see has changed yet.

What we learned on the way:

- DNS is managed inside Wix (nameservers are `ns2.wixdns.net` and `ns3.wixdns.net`), so every DNS step happens in the Wix dashboard.
- Email runs on Google Workspace through MX records in that same Wix DNS. Never move the nameservers away from Wix. Edit individual records only.
- The subdomain option is not in the three-dot menu on the site-level Domains page. Gen used "Add an Existing Domain" and Wix handled the record.

## Launch day (phase two), in this order

1. Smart Scale confirms the latest deploy on the vercel.app address looks right.
2. Gen, in Wix Settings then Domains: next to `portal.thanailartistry.com` click **Set as primary**. From this moment www redirects to portal, so steps 3 and 4 follow immediately.
3. Gen, in Wix: three dots next to `thanailartistry.com`, then **Manage DNS records**. Change the A record for the root (`@`) to `76.76.21.21` and set `www` to either an A record `76.76.21.21` or a CNAME `cname.vercel-dns.com`. Leave every MX, TXT and other record alone. If Wix locks those two records because www is still assigned to the site, use **Unassign from this site** on `thanailartistry.com` first. Portal keeps working because it is primary.
4. Wait for Vercel to show both domains as valid (it emails when verification completes). Load `https://www.thanailartistry.com` and `https://thanailartistry.com`.
5. Test from the live site: Student Login, Apply, a tour booking link, the waitlist form and the readiness assessment. The two forms email the inbox tied to the Web3Forms key.

## Old links keep working

The new site forwards every path that only exists on Wix (student account, bookings, store, payment request page, intake form) to the portal, so emails and bookmarks students already have still land in the right place. The list lives in `web/next.config.ts`.

## Original step by step (kept for reference)

### 1. Find out where the domain's DNS is managed
Log in to Wix, open **Settings > Domains**. If it says the domain was purchased through Wix, DNS is managed in Wix. If it was connected from GoDaddy, Namecheap or another registrar, DNS is managed there. Either way the steps below work; only the screen you type records into changes.

### 2. Add the subdomain in Wix
1. In Wix go to **Settings > Domains**.
2. Click **Connect a domain you already own** (even if it was bought through Wix, this is the option for adding a subdomain).
3. Type `portal.thanailartistry.com` and continue.
4. Wix shows the DNS record it needs. For a subdomain it is a **CNAME** record. Copy the value it gives (it looks like `cdn1.wixdns.net` or similar).

### 3. Add the DNS record
In the DNS manager (Wix or the registrar):

| Type | Host / Name | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `portal` | the value Wix gave you | default |

Save. DNS can take from a few minutes to 24 hours. Wix will show the subdomain as connected when it is ready.

### 4. Make the subdomain the primary address for the Wix site
Once connected, in **Settings > Domains** set `portal.thanailartistry.com` as the **primary** domain for the Wix site. Wix will treat the old `www` address as secondary. Do not remove `www` from Wix until the new site is live (step 6).

### 5. Point the main domain at the new site
Smart Scale will give you two records from Vercel. In the same DNS manager:

| Type | Host / Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

If DNS is managed inside Wix and Wix refuses to let `www` point elsewhere, the cleanest fix is to move DNS management to the registrar (or to Vercel). Smart Scale can walk you through that call.

### 6. Remove `www` from the Wix site
After the new site loads at `www.thanailartistry.com`, go back to Wix **Settings > Domains** and disconnect `www.thanailartistry.com` from the Wix site. Wix will keep working at `portal.thanailartistry.com`.

### 7. Tell the new site where Wix lives
Smart Scale sets `NEXT_PUBLIC_WIX_BASE_URL=https://portal.thanailartistry.com` in Vercel and redeploys. Done.

## What students will notice
Nothing changes inside the portal. Bookmarks to `www.thanailartistry.com/account/my-account` will land on the new site; the **Student Login** link in the header and footer takes them straight to the portal.

## Links the new site sends into Wix
All defined in `web/src/lib/wix.ts`:

- Apply: `/apply`
- Student login: `/account/my-account`
- In-person tour: `/service-page/in-person-tour`
- Virtual tour: `/service-page/virtual-tour`
- Workshops: `/service-page/<workshop>`
- Student services: `/service-page/<service>`
- Scholarship form: `/scholarships`
- Waitlist form: `/waitlist`
- Instructor application: `/nailinstructorposition`
- Graduation tickets: `/product-page/adult-graduation-tickets`
- Store: `/category/all-products`

Keep those page URLs the same inside Wix and nothing else needs to change.
