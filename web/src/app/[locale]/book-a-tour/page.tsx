import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, FeatureGrid, HoursBlock } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/book-a-tour">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.tour;
  return buildMetadata({ locale, path: "/book-a-tour", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function TourPage({ params }: PageProps<"/[locale]/book-a-tour">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.tour;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/book-a-tour" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs} image={{ src: "/images/campus/graduates.jpg", alt: "Smiling Tha Nail Artistry Academy graduates in purple caps and gowns at their Houston graduation ceremony", priority: true }} />

      <Section tone="white" labelledBy="tour-options">
        <Container>
          <Reveal><h2 id="tour-options" className="t-h2">{p.intro}</h2></Reveal>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {[{ ...p.inPerson, href: wixLinks.tourInPerson, dark: true }, { ...p.virtual, href: wixLinks.tourVirtual, dark: false }].map((o, i) => (
              <Reveal as="li" key={o.title} delay={i * 90} className={`flex flex-col rounded-3xl p-8 sm:p-10 ${o.dark ? "on-dark bg-black text-white" : "bg-marble ring-1 ring-black/10"}`}>
                <Eyebrow tone={o.dark ? "lavender" : "dark"}>{p.eyebrow}</Eyebrow>
                <h3 className="t-h2 mt-4">{o.title}</h3>
                <p className={`t-lede mt-3 ${o.dark ? "text-white/75" : "text-black/70"}`}>{o.text}</p>
                <div className="mt-8"><Button href={o.href} variant={o.dark ? "lime" : "primary"} external title={t.common.opensWix}>{o.cta}</Button></div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="marble" labelledBy="know-heading">
        <Container>
          <Reveal className="max-w-2xl"><h2 id="know-heading" className="t-h2">{p.knowHeading}</h2></Reveal>
          <div className="mt-10"><FeatureGrid items={p.know} /></div>
          <p className="t-lede mt-12 max-w-2xl text-black/75">{p.closing}</p>
        </Container>
      </Section>

      <HoursBlock locale={locale} t={t} />
      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={p.inPerson.cta} secondaryHref={wixLinks.tourInPerson} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
