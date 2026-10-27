# Tha Nail Artistry Academy

Marketing website for Tha Nail Artistry Academy, a TDLR-licensed nail school in Houston, TX. Built by Smart Scale LLC.

- **Framework:** Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, TypeScript
- **Languages:** English at `/`, Spanish at `/es/`
- **Back office:** stays on Wix (portal, payment plans, bookings, store, forms). See `docs/WIX-SUBDOMAIN-GUIDE.md`.

## Run it

```bash
cd web
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Copy `web/.env.example` to `web/.env.local` to override the site URL, the Wix base URL or analytics IDs.

## Where things live

| Path | What |
| --- | --- |
| `web/src/config/site.ts` | Phone, address, hours, socials, **class dates**, agency credit |
| `web/src/lib/wix.ts` | Every link into the Wix back office |
| `web/src/content/en.ts`, `es.ts` | All copy, both languages, typed by `types.ts` |
| `web/src/app/[locale]/` | Pages. English is rewritten to `/en/...` internally by `src/proxy.ts` |
| `web/src/components/` | Layout, sections, UI primitives, program quiz |
| `web/public/images/` | Logo, team, campus, student work, partner logos, generated marble texture |
| `docs/CONTENT-TODO.md` | Mock content awaiting the academy's final text |

## Brand rules enforced in code

Only four colors exist in the theme: black `#000000`, white `#FFFFFF`, lavender `#B0A1EA`, lime `#C7F37D`. Greys are tints of black. Lavender and lime are used as text only on black backgrounds (they fail WCAG contrast on white), and lime is reserved for the "now enrolling" dot and the primary button on dark CTA bands.

## Accessibility and SEO checklist

- Skip link, visible focus rings on light and dark, keyboard-operable menus and accordions, reduced-motion fallbacks
- Every image has descriptive alt text in both languages; decorative SVGs are `aria-hidden`
- One H1 per page naming the service and the city (e.g. "Nail School in Houston")
- Per-page titles, descriptions, canonical URLs, `hreflang` pairs, Open Graph cards generated at `/og`
- JSON-LD: EducationalOrganization + LocalBusiness, Course, FAQPage, BreadcrumbList, JobPosting, Person
- `sitemap.xml` and `robots.txt` generated from the route list
- Every navigation lands at the top of the page; the logo returns to the top of the homepage
