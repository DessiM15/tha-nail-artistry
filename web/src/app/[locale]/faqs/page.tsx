import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/Blocks";
import { Accordion } from "@/components/ui/Accordion";
import { Container, Section } from "@/components/ui/Primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/faqs">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.faqs;
  return buildMetadata({ locale, path: "/faqs", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faqs">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.faqs;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/faqs" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} crumbs={crumbs} />
      <Section tone="white" size="sm">
        <Container className="max-w-4xl"><Accordion items={p.items} /></Container>
      </Section>
      <CTABand locale={locale} heading={p.stillHeading} primary={p.stillCta} primaryHref={href("/contact")} secondary={t.common.bookTour} />
      <JsonLd data={[breadcrumbJsonLd(locale, crumbs), faqJsonLd(p.items)]} />
    </>
  );
}
