# Content still needed from Tha Nail Artistry Academy

Everything below is either mock content or an unresolved contradiction found on the current website. Each item points to where it lives in the code so it can be swapped in minutes.

## Must confirm before launch

| # | Item | Where it lives | Notes |
| --- | --- | --- | --- |
| 1 | Core / Specialty / Complete program details | `web/src/content/en.ts` and `es.ts`, `pages.programs` | Names, what each tier includes, hours, exact days, and whether all three lead to the 600-hour license. Current copy is a reasonable draft only. |
| 2 | Tuition per program | `web/src/config/tuition.ts` | Done November 5, 2026 from Gen's price sheet. See "Tuition pricing" below. |
| 3 | Next class start and enrollment deadline | `web/src/config/site.ts`, `enrollment` | Set to November 30, 2026 and November 20, 2026. One edit updates the announcement bar, hero, CTAs and both languages. |
| 4 | Mia Curry's bio | `pages.team.members[2].bio` | The live website shows Rayven's bio under Mia's name. A short draft is in place and flagged with a visible "placeholder" note. |
| 5 | Privacy Policy | `pages.privacy.sections` | The live website's privacy page is empty. A short draft is in place with a visible "draft" note. |
| 6 | Application URL | `web/src/lib/wix.ts`, `apply` | The current site's apply button is JavaScript-driven; we link to `/apply` on Wix. Confirm the exact page students should land on. |
| 7 | Student login URL | `web/src/lib/wix.ts`, `login` | Currently `/account/my-account` (standard Wix members page). |
| 8 | Class hours vs campus hours | `pages.courses.campusHours` and hours in `HoursBlock` | Home page says class hours Mon to Fri 9am to 9pm; Courses page says campus hours 9:30am to 3:30pm. Both are shown as on the old site. |
| 9 | Workshop descriptions | `pages.workshops.items` | Only State Board Training and the Membership had descriptions on Wix. The other nine are drafts. |
| 10 | Service descriptions | `pages.services.items` | Only Acrylic Full Set had a description on Wix. The rest are one-line drafts. Prices and durations are from Wix. |

## Changes from Gen's review (November 3, 2026)

- Work-study and the $2,000 scholarship are gone from the site. The scholarships route redirects to Financial Aid. Financial Aid now lists payment plans, pay-in-full discount, Klarna or Afterpay and promotions.
- Graduation Day and Friends & Family Day are switched off with `features` in `web/src/config/site.ts` (removed from nav and sitemap, routes return 404). Flip either flag to `true` to bring the page back.
- The waitlist is now a native form (program of interest: Core, Specialty, Complete or Undecided; how they heard about us; typed signature). Questions email is contact@thanailartistry.com.
- New Admissions Readiness Assessment at `/readiness-assessment`, built from Gen's PDF spec: 10 questions one at a time, hidden scoring on questions 1 to 4, confirmation screen that sends people to Book a Tour. Book a Tour prompts people to take it first. Linked from the More menu.
- Both forms submit through Web3Forms (key in `NEXT_PUBLIC_WEB3FORMS_KEY`). The free plan emails the admissions inbox but cannot send the applicant an auto-reply; the on-screen confirmation covers that. Upgrading to Web3Forms Pro adds the auto-reply if Gen wants it.
- Dates set November 4, 2026: enrollment deadline November 20, 2026, first day of class November 30, 2026 (`enrollment` in `web/src/config/site.ts`).
- Every Apply Now on the site now starts the readiness assessment. The only link that opens the Wix application directly is the Apply Now in the black announcement bar. The Apply page lists the six updated enrollment steps from Gen's Wix page.
- Gen's own work photos (ten sets) live in `web/public/images/work/gen/` and show under View My Work on the founder page only.

## Tuition pricing (November 5, 2026)

- All prices live in `web/src/config/tuition.ts` (pay in full, 4 month and 6 month plan totals, and the monthly, biweekly and weekly amounts for each program). The $900 down payment is `enrollment.downPayment` in `web/src/config/site.ts`. One edit updates both languages.
- The Tuition page shows a "Tuition by program" section: the range for each program (pay in full up to the 6 month plan), a "Payment plans available" tag and the full plan breakdown.
- Financial Aid cards use the same numbers. Program pages and the program cards do not show prices; they link to the Tuition page.
- Installment amounts are Gen's own figures, rounded up to the next dollar, so some add up to a few dollars more than the plan total (for example 16 weekly payments of $357 is $5,712 against a $5,700 balance). Gen to confirm that is how the final payment is billed.
- The "tuition is shared on your tour" lines are gone. The closing banners now say payment plans are available and the tour is where you pick one.

## Nice to have

- Any classroom or nail video for the hero.
- Higher resolution versions of the team and campus photos.
- Google review link (currently points to the Maps listing).
- Spanish proofread by Gen (tone is "tú", warm and direct).
- Analytics IDs (GA4, Meta pixel, TikTok pixel) for `web/.env`.

## Pages intentionally hidden from search engines
Graduation Day and Friends & Family Day are reachable from the "More" menu but carry `noindex` because they are event pages with dated content.

## Stock photos in use (Pexels license, free for commercial use, no attribution required)
Workshop images for State Board Training, Business Development, Natural Nails, Pedicure, Toenail Enhancement, Soft Gel Extensions, Hard Gel and the Membership are Pexels stock photos (IDs 7092541, 11142407, 37033378, 34930123, 17056222, 4677854, 4677853, 7755245). Replace with academy photos whenever Gen has them: drop the file into `web/public/images/workshops/<slug>.jpg`.

## Scheduled change

- Rayven Russell leaves the academy after the week of Oct 26, 2026. Her Team page bio is set to disappear automatically on Sunday, November 1, 2026 at 10:00 PM Central (`activeUntil` on her entry in `pages.team.members`, en and es). The Team page renders its roster at request time, so no redeploy is needed. Her photo file `public/images/team/rayven-russell.jpg` and the About page class photo `public/images/campus/class-with-rayven.jpg` are left in place; Gen to say whether the About photo should be swapped.
