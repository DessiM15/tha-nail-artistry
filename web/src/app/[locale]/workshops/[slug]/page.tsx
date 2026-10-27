import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/config/site";
import { wixUrl } from "@/lib/wix";
import { en } from "@/content/en";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return en.pages.workshops.items.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/workshops/[slug]">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const { slug } = await params;
  const w = t.pages.workshops.items.find((x) => x.slug === slug);
  if (!w) return {};
  const title = locale === "es" ? `${w.name} en Houston` : `${w.name} in Houston`;
  return buildMetadata({ locale, path: `/workshops/${w.slug}`, title, description: w.seoDescription, kicker: t.pages.workshopPage.kicker });
}

export default async function WorkshopPage({ params }: PageProps<"/[locale]/workshops/[slug]">) {
  const { locale, t, href } = await getPage(params);
  const { slug } = await params;
  const w = t.pages.workshops.items.find((x) => x.slug === slug);
  if (!w) notFound();
  const wp = t.pages.workshopPage;
  const others = t.pages.workshops.items.filter((x) => x.slug !== w.slug).slice(0, 4);
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: t.pages.workshops.eyebrow!, path: "/workshops" }, { name: w.name, path: `/workshops/${w.slug}` }];
  const h1 = locale === "es" ? `${w.name} en Houston` : `${w.name} in Houston`;
  return (
    <>
      <PageHero locale={locale} eyebrow={`${wp.kicker}${w.price ? ` · ${w.price}` : ""}${w.duration ? ` · ${w.duration}` : ""}`} h1={h1} lede={w.tagline} crumbs={crumbs} image={{ src: w.image, alt: w.imageAlt, priority: true }}>
        <Button href={wixUrl(w.wixPath)} external title={t.common.opensWix}>{w.bookLabel}</Button>
        <Button href={href("/workshops")} variant="secondary" icon={false}>{wp.backLabel}</Button>
      </PageHero>

      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="t-h3">{wp.descriptionHeading}</h2>
            <p className="t-lede mt-5 text-black/80">{w.description}</p>
            {w.eligibility && (
              <div className="mt-8 rounded-2xl bg-lavender/20 p-6">
                <h3 className="t-eyebrow text-black/60">{wp.eligibilityHeading}</h3>
                <p className="t-body mt-2">{w.eligibility}</p>
              </div>
            )}
            <details className="mt-10 rounded-2xl ring-1 ring-black/10 open:bg-marble">
              <summary className="cursor-pointer list-none px-6 py-4 font-semibold [&::-webkit-details-marker]:hidden">{wp.policyHeading}</summary>
              <div className="prose-site t-body px-6 pb-6 text-black/70">{wp.policy.map((para) => <p key={para}>{para}</p>)}</div>
            </details>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <div className="on-dark rounded-3xl bg-black p-8 text-white lg:sticky lg:top-28">
              <Eyebrow tone="lavender">{wp.kicker}</Eyebrow>
              <p className="t-h3 mt-4">{w.name}</p>
              {w.price && <p className="t-display mt-4 text-lime" style={{ fontSize: "clamp(2.5rem, 2rem + 2vw, 4rem)" }}>{w.price}</p>}
              {w.duration && <p className="mt-1 text-white/70">{w.duration}</p>}
              <div className="mt-6"><Button href={wixUrl(w.wixPath)} variant="onDark" external title={t.common.opensWix}>{w.bookLabel}</Button></div>
              <p className="mt-4 text-[0.8rem] text-white/55">{t.common.opensWix}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="marble" size="sm" labelledBy="other-workshops">
        <Container>
          <h2 id="other-workshops" className="t-h3">{wp.otherHeading}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}><Link href={href(`/workshops/${o.slug}`)} className="block h-full rounded-2xl bg-white p-5 ring-1 ring-black/10 hover:ring-black/40"><span className="block font-semibold">{o.name}</span>{o.price && <span className="mt-1 block text-[0.85rem] text-black/65">{o.price}</span>}</Link></li>
            ))}
          </ul>
        </Container>
      </Section>

      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={[breadcrumbJsonLd(locale, crumbs), { "@context": "https://schema.org", "@type": "Course", name: w.name, description: w.seoDescription, url: `${SITE_URL}${href(`/workshops/${w.slug}`)}`, provider: { "@id": `${SITE_URL}/#organization` }, ...(w.price ? { offers: { "@type": "Offer", price: w.price.replace(/[^\d.]/g, ""), priceCurrency: "USD" } } : {}) }]} />
    </>
  );
}
