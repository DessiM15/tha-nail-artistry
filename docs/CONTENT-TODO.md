# Content still needed from Tha Nail Artistry Academy

Everything below is either mock content or an unresolved contradiction found on the current website. Each item points to where it lives in the code so it can be swapped in minutes.

## Must confirm before launch

| # | Item | Where it lives | Notes |
| --- | --- | --- | --- |
| 1 | Core / Specialty / Complete program details | `web/src/content/en.ts` and `es.ts`, `pages.programs` | Names, what each tier includes, hours, exact days, and whether all three lead to the 600-hour license. Current copy is a reasonable draft only. |
| 2 | Tuition per program | same, `price` field on each program | Leave empty to keep "shared during your tour". Fill with a string like `"$X,XXX"` to display. |
| 3 | Next class start and enrollment deadline | `web/src/config/site.ts`, `enrollment` | Currently November 9, 2026 and October 29, 2026. One edit updates the announcement bar, hero, CTAs and both languages. |
| 4 | Mia Curry's bio | `pages.team.members[2].bio` | The live website shows Rayven's bio under Mia's name. A short draft is in place and flagged with a visible "placeholder" note. |
| 5 | Privacy Policy | `pages.privacy.sections` | The live website's privacy page is empty. A short draft is in place with a visible "draft" note. |
| 6 | Application URL | `web/src/lib/wix.ts`, `apply` | The current site's apply button is JavaScript-driven; we link to `/apply` on Wix. Confirm the exact page students should land on. |
| 7 | Student login URL | `web/src/lib/wix.ts`, `login` | Currently `/account/my-account` (standard Wix members page). |
| 8 | Class hours vs campus hours | `pages.courses.campusHours` and hours in `HoursBlock` | Home page says class hours Mon to Fri 9am to 9pm; Courses page says campus hours 9:30am to 3:30pm. Both are shown as on the old site. |
| 9 | Workshop descriptions | `pages.workshops.items` | Only State Board Training and the Membership had descriptions on Wix. The other nine are drafts. |
| 10 | Service descriptions | `pages.services.items` | Only Acrylic Full Set had a description on Wix. The rest are one-line drafts. Prices and durations are from Wix. |

## Nice to have

- Gen's and Rayven's "View My Work" gallery photos (currently the four nail photos repeat).
- Any classroom or nail video for the hero.
- Higher resolution versions of the team and campus photos.
- Google review link (currently points to the Maps listing).
- Spanish proofread by Gen (tone is "tú", warm and direct).
- Analytics IDs (GA4, Meta pixel, TikTok pixel) for `web/.env`.

## Pages intentionally hidden from search engines
Graduation Day and Friends & Family Day are reachable from the "More" menu but carry `noindex` because they are event pages with dated content.

## Stock photos in use (Pexels license, free for commercial use, no attribution required)
Workshop images for State Board Training, Business Development, Natural Nails, Pedicure, Toenail Enhancement, Soft Gel Extensions, Hard Gel and the Membership are Pexels stock photos (IDs 7092541, 11142407, 37033378, 34930123, 17056222, 4677854, 4677853, 7755245). Replace with academy photos whenever Gen has them: drop the file into `web/public/images/workshops/<slug>.jpg`.
