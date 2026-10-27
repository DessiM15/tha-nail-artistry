# Keeping the Wix back office alive when the new site goes live

The new site is the public face. Wix keeps doing what it does today: student portal and logins, payment plans, tour and workshop bookings, student services, the store (graduation tickets, scrub tops), and the scholarship, waitlist and instructor application forms.

Right now Wix owns `www.thanailartistry.com`. When the new site takes that address, Wix needs its own address or every booking, login and apply link breaks. The fix is a subdomain.

## The plan

| What | Address |
| --- | --- |
| New website (Next.js on Vercel) | `www.thanailartistry.com` and `thanailartistry.com` |
| Wix site (portal, bookings, store, forms) | `portal.thanailartistry.com` |

Every link on the new site that points into Wix is built from one setting, `NEXT_PUBLIC_WIX_BASE_URL`. Change that one value to `https://portal.thanailartistry.com` and all links update at once.

## Step by step for Gen (about 20 minutes, plus DNS wait time)

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
