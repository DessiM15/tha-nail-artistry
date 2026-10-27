import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, LeafDivider, Section, Stars } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Check, Award, Briefcase, Clock, Heart, Layers, Users, Sparkle } from "@/components/ui/Icons";
import type { Feature, Program, Review, SiteContent } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";
import { business, enrollment } from "@/config/site";
import { daysLabel, formatDate } from "@/lib/format";
import { wixLinks } from "@/lib/wix";
import { allSets, workImages } from "@/content/work";

/* ---------- Feature grid (home "why us", tuition "what's included") ---------- */
const featureIcons = [Users, Award, Clock, Briefcase, Layers, Heart];

export function FeatureGrid({ items, columns = 3, withIcons = true }: { items: Feature[]; columns?: 2 | 3; withIcons?: boolean }) {
  return (
    <ul className={`grid gap-x-10 gap-y-10 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((f, i) => {
        const Icon = featureIcons[i % featureIcons.length];
        return (
          <Reveal as="li" key={f.title} delay={i * 60} className="border-t border-black/15 pt-6">
            {withIcons && (
              <span className="mb-4 inline-grid size-10 place-items-center rounded-full bg-lavender/25 text-black">
                <Icon width={18} height={18} />
              </span>
            )}
            <h3 className="t-h4">{f.title}</h3>
            <p className="t-body mt-2 text-black/70">{f.text}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}

/* ---------- Numbered steps (apply, scholarship) ---------- */
export function Steps({ items }: { items: Feature[] }) {
  return (
    <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 60} className="rounded-2xl border border-black/10 bg-white p-6 sm:p-7">
          <span className="t-display block text-lavender" style={{ fontSize: "clamp(2.5rem, 2rem + 2vw, 3.5rem)" }} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="t-h4 mt-2"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
          <p className="t-body mt-2 text-black/70">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/* ---------- Program cards ---------- */
export function ProgramCards({ locale, programs, t, compact = false }: { locale: Locale; programs: Program[]; t: SiteContent; compact?: boolean }) {
  return (
    <ul className="grid gap-5 lg:grid-cols-3">
      {programs.map((p, i) => {
        const dark = !!p.featured;
        return (
          <Reveal as="li" key={p.slug} delay={i * 80} className={`relative flex flex-col rounded-3xl p-7 sm:p-8 ${dark ? "on-dark bg-black text-white" : "bg-white text-black ring-1 ring-black/10"}`}>
            <div className="flex items-center justify-between gap-3">
              <Eyebrow tone={dark ? "lavender" : "dark"}>{p.shortName}</Eyebrow>
              <span className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${dark ? "bg-lime text-black" : "bg-black/5 text-black/70"}`}>{daysLabel(t.common, p.daysPerWeek)}</span>
            </div>
            <h3 className="t-h3 mt-5">{p.name}</h3>
            <p className={`t-body mt-2 ${dark ? "text-white/75" : "text-black/70"}`}>{p.tagline}</p>
            <p className={`mt-4 text-[0.85rem] ${dark ? "text-white/60" : "text-black/55"}`}>{p.lengthLabel} · {t.common.hybrid}</p>
            {!compact && (
              <ul className="mt-6 space-y-2.5">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[0.92rem]">
                    <Check width={16} height={16} className={`mt-1 shrink-0 ${dark ? "text-lime" : "text-black"}`} />
                    <span className={dark ? "text-white/90" : "text-black/85"}>{h}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap gap-3 pt-2 mt-auto">
              <Button href={localeHref(locale, `/courses/${p.slug}`)} variant={dark ? "onDark" : "primary"} size="sm">{t.common.learnMore}</Button>
              <Button href={localeHref(locale, "/book-a-tour")} variant={dark ? "onDarkOutline" : "secondary"} size="sm" icon={false}>{t.common.bookTour}</Button>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/* ---------- Founder quote (black chapter) ---------- */
export function FounderQuote({ locale, t }: { locale: Locale; t: SiteContent }) {
  const f = t.home.founder;
  return (
    <Section tone="black" labelledBy="founder-quote">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="arch relative mx-auto aspect-[4/5] w-full max-w-md">
            <Image src="/images/campus/gen-henriquez-founder.jpg" alt="Gen Henriquez, founder of Tha Nail Artistry Academy, standing behind a table of professional student nail kits in the Houston classroom" fill className="object-cover object-[50%_30%]" sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-7">
          <Eyebrow tone="lavender">{f.kicker}</Eyebrow>
          <blockquote className="mt-6">
            <p id="founder-quote" className="t-h2 text-white"><span aria-hidden="true" className="t-italic text-lavender">“</span>{f.quote}<span aria-hidden="true" className="t-italic text-lavender">”</span></p>
            <footer className="mt-8 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-lime" />
              <cite className="not-italic"><span className="block font-semibold">{f.name}</span><span className="block text-[0.85rem] text-white/65">{f.role}</span></cite>
            </footer>
          </blockquote>
          <div className="mt-10"><Button href={localeHref(locale, "/founder")} variant="onDark">{f.cta}</Button></div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------- Reviews ---------- */
export function Reviews({ reviews, t }: { reviews: Review[]; t: SiteContent }) {
  return (
    <Section tone="marble" labelledBy="reviews-heading">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{t.common.reviewsKicker}</Eyebrow>
          <h2 id="reviews-heading" className="t-h2 mt-4">{t.common.reviewsHeading}</h2>
        </Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.name} delay={i * 70} className="flex flex-col rounded-3xl bg-white p-7 ring-1 ring-black/10 sm:p-8">
              <Stars n={r.rating} className="text-black" />
              <blockquote className="t-body mt-4 flex-1 text-black/80"><p>“{r.text}”</p></blockquote>
              <p className="mt-6 flex items-center gap-3 text-[0.85rem]"><span aria-hidden="true" className="h-px w-6 bg-lavender" /><span className="font-semibold">{r.name}</span><span className="text-black/50">{r.source}</span></p>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10"><Button href={business.mapsUrl} variant="link" external>{t.common.reviewsMore}</Button></div>
      </Container>
    </Section>
  );
}

/* ---------- Partner marquee ---------- */
function PartnerRow({ logos, hidden }: { logos: SiteContent["partners"]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {logos.map((p) => (
        <li key={p.name} className={`flex h-24 w-48 shrink-0 items-center justify-center rounded-2xl px-6 sm:h-28 sm:w-56 ${p.dark ? "bg-black ring-1 ring-white/20" : "bg-white"}`}>
          <Image src={`/images/partners/${p.file}`} alt={hidden ? "" : `${p.name} logo`} width={200} height={90} className="max-h-16 w-auto max-w-[9rem] object-contain sm:max-h-20" sizes="180px" />
        </li>
      ))}
    </ul>
  );
}

export function Partners({ t }: { t: SiteContent }) {
  return (
    <Section tone="black" size="sm" labelledBy="partners-heading">
      <Container className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <Eyebrow tone="lavender">{t.common.partnersKicker}</Eyebrow>
          <h2 id="partners-heading" className="t-h3 mt-3">{t.common.partnersHeading}</h2>
        </div>
      </Container>
      <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track"><PartnerRow logos={t.partners} /><PartnerRow logos={t.partners} hidden /></div>
      </div>
    </Section>
  );
}

/* ---------- Hours + visit ---------- */
export function HoursBlock({ locale, t }: { locale: Locale; t: SiteContent }) {
  const c = t.common;
  const h = t.home.hours;
  return (
    <Section tone="white" labelledBy="hours-heading">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <Eyebrow>{h.kicker}</Eyebrow>
          <h2 id="hours-heading" className="t-h2 mt-4">{h.heading}</h2>
          <p className="t-lede mt-5 max-w-xl text-black/70">{h.text}</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="t-eyebrow text-black/60">{c.classHours}</h3>
              <dl className="mt-3 space-y-1.5 text-[0.95rem]">
                <div className="flex justify-between gap-4 border-b border-black/10 pb-1.5"><dt>{c.monFri}</dt><dd className="font-semibold">9am to 9pm</dd></div>
                <div className="flex justify-between gap-4 border-b border-black/10 pb-1.5"><dt>{c.satSun}</dt><dd className="font-semibold">10am to 7pm</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="t-eyebrow text-black/60">{c.officeHours}</h3>
              <dl className="mt-3 space-y-1.5 text-[0.95rem]">
                <div className="flex justify-between gap-4 border-b border-black/10 pb-1.5"><dt>{c.monFri}</dt><dd className="font-semibold">9am to 6pm</dd></div>
                <div className="flex justify-between gap-4 border-b border-black/10 pb-1.5"><dt>{c.satSun}</dt><dd className="font-semibold">{c.closed}</dd></div>
              </dl>
            </div>
          </div>
          <address className="mt-8 not-italic text-[0.95rem] text-black/75">
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-lavender decoration-2 hover:decoration-black">{business.address.street}, {business.address.city}, {business.address.region} {business.address.postalCode}</a>
            <span className="mx-2 text-black/30" aria-hidden="true">·</span>
            <a href={business.phoneHref} className="font-semibold">{business.phoneDisplay}</a>
          </address>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={localeHref(locale, "/book-a-tour")}>{h.cta}</Button>
            <Button href={business.mapsUrl} variant="secondary" external>{c.directions}</Button>
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Image src="/images/campus/storefront.jpg" alt="Storefront of Tha Nail Artistry Academy at 13150 FM 529 Suite 108 in Houston, with the academy's services and phone number on the windows" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------- Closing CTA band ---------- */
export function CTABand({ locale, heading, text, primary, secondary, primaryHref, secondaryHref, primaryExternal }: { locale: Locale; heading: string; text?: string; primary: string; secondary?: string; primaryHref?: string; secondaryHref?: string; primaryExternal?: boolean }) {
  return (
    <Section tone="black" size="sm" labelledBy="cta-heading" className="overflow-hidden">
      <Container className="relative">
        <LeafDivider className="mb-10" />
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="cta-heading" className="t-h2">{heading}</h2>
          {text && <p className="t-lede mt-4 text-white/75">{text}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={primaryHref ?? wixLinks.apply} variant="lime" size="lg" external={primaryExternal ?? !primaryHref}>{primary}</Button>
            {secondary && <Button href={secondaryHref ?? localeHref(locale, "/book-a-tour")} variant="onDarkOutline" size="lg" icon={false}>{secondary}</Button>}
          </div>
          <p className="mt-6 text-[0.8rem] text-white/55">{formatDate(enrollment.nextClassStart, locale)}</p>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------- Work gallery ---------- */
export function WorkGallery({ alts, heading, kicker, cta, compact = false, indices = allSets }: { alts: string[]; heading?: string; kicker?: string; cta?: string; compact?: boolean; indices?: number[] }) {
  const work = indices.map((i) => ({ i, ...workImages[i] }));
  return (
    <Section tone="white" size={compact ? "sm" : "md"} labelledBy="gallery-heading">
      <Container>
        {(heading || kicker) && (
          <Reveal className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              {kicker && <Eyebrow>{kicker}</Eyebrow>}
              {heading && <h2 id="gallery-heading" className="t-h2 mt-3">{heading}</h2>}
            </div>
            {cta && <Button href={business.social.instagram} variant="link" external>{cta}</Button>}
          </Reveal>
        )}
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {work.map((img, i) => (
            <Reveal as="li" key={img.src} delay={(i % 4) * 70} className={i % 2 === 1 ? "lg:translate-y-10" : ""}>
              <div className={`relative overflow-hidden ${i % 2 === 0 ? "arch" : "rounded-3xl"} aspect-[4/5]`}>
                <Image src={img.src} alt={alts[img.i] ?? ""} fill className="object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.04]" sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ---------- Simple prose renderer for policy pages ---------- */
export function PolicySections({ sections }: { sections: { heading: string; blocks: (string | string[])[] }[] }) {
  return (
    <div className="prose-site max-w-3xl">
      {sections.map((s) => (
        <section key={s.heading} className="border-t border-black/10 py-8 first:border-t-0 first:pt-0">
          <h2 className="t-h3">{s.heading}</h2>
          <div className="t-body mt-4 text-black/80">
            {s.blocks.map((b, i) =>
              Array.isArray(b) ? (
                <ul key={i}>{b.map((li) => <li key={li}>{li}</li>)}</ul>
              ) : (
                <p key={i} className={i > 0 ? "mt-4" : ""}>{b}</p>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 inline-flex items-start gap-2 rounded-2xl bg-lavender/20 px-4 py-3 text-[0.85rem] text-black/80">
      <Sparkle width={16} height={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function TextLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const cls = "font-semibold underline underline-offset-4 decoration-lavender decoration-2 hover:decoration-black";
  return external ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}
