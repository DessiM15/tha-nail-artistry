import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL, business } from "@/config/site";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/Icons";

export async function generateMetadata({ params }: PageProps<"/[locale]/careers/manicurist-instructor">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.job;
  return buildMetadata({ locale, path: "/careers/manicurist-instructor", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function JobPage({ params }: PageProps<"/[locale]/careers/manicurist-instructor">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.job;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: t.pages.careers.eyebrow!, path: "/careers" }, { name: p.h1, path: "/careers/manicurist-instructor" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={t.pages.careers.jobs[0].type} crumbs={crumbs}>
        <Button href={wixLinks.instructorApplication} external title={t.common.opensWix}>{p.cta}</Button>
      </PageHero>
      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="t-h3">{p.summaryHeading}</h2>
              <p className="t-lede mt-4 text-black/80">{p.summary}</p>
            </Reveal>
            <Reveal className="mt-12">
              <h2 className="t-h3">{p.qualificationsHeading}</h2>
              <ul className="mt-5 space-y-3">{p.required.map((r) => <li key={r} className="flex gap-3 text-[0.95rem]"><Check width={18} height={18} className="mt-0.5 shrink-0" />{r}</li>)}</ul>
              <h3 className="t-eyebrow mt-8 text-black/60">{p.preferredLabel}</h3>
              <ul className="mt-3 space-y-2.5">{p.preferred.map((r) => <li key={r} className="flex gap-3 text-[0.95rem] text-black/75"><span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-lavender" />{r}</li>)}</ul>
            </Reveal>
          </div>
          <div className="space-y-5 lg:col-span-5">
            <Reveal delay={100} className="rounded-3xl bg-marble p-8 ring-1 ring-black/10">
              <Eyebrow>{p.scheduleHeading}</Eyebrow>
              <dl className="mt-5 space-y-4">{p.schedules.map((s) => <div key={s.label}><dt className="font-semibold">{s.label}</dt><dd className="mt-1 text-[0.92rem] text-black/70">{s.items.map((i) => <span key={i} className="block">{i}</span>)}</dd></div>)}</dl>
            </Reveal>
            <Reveal delay={160} className="on-dark rounded-3xl bg-black p-8 text-white">
              <Eyebrow tone="lavender">{p.compensationHeading}</Eyebrow>
              <dl className="mt-5 space-y-4">{p.compensation.map((s) => <div key={s.label}><dt className="t-eyebrow text-white/60">{s.label}</dt><dd className="mt-1 t-h4">{s.items.join(" · ")}</dd></div>)}</dl>
              <div className="mt-7"><Button href={wixLinks.instructorApplication} variant="lime" external title={t.common.opensWix}>{p.cta}</Button></div>
              <p className="mt-3 text-[0.8rem] text-white/55">{p.ctaNote}</p>
            </Reveal>
          </div>
        </Container>
      </Section>
      <CTABand locale={locale} heading={t.pages.careers.h1} primary={p.cta} primaryHref={wixLinks.instructorApplication} primaryExternal />
      <JsonLd data={[breadcrumbJsonLd(locale, crumbs), {
        "@context": "https://schema.org", "@type": "JobPosting", title: p.h1, description: p.summary, datePosted: "2026-01-01",
        employmentType: ["FULL_TIME", "PART_TIME"], hiringOrganization: { "@type": "Organization", name: business.name, sameAs: SITE_URL },
        jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: business.address.street, addressLocality: business.address.city, addressRegion: business.address.region, postalCode: business.address.postalCode, addressCountry: "US" } },
        baseSalary: { "@type": "MonetaryAmount", currency: "USD", value: { "@type": "QuantitativeValue", minValue: 15, maxValue: 18, unitText: "HOUR" } },
      }]} />
    </>
  );
}
