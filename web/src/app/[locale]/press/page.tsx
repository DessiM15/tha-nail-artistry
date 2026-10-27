import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { business } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, TextLink } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/press">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.press;
  return buildMetadata({ locale, path: "/press", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function PressPage({ params }: PageProps<"/[locale]/press">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.press;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/press" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs} />
      <Section tone="white">
        <Container>
          <ul className="grid gap-6">
            {p.features.map((f) => (
              <Reveal as="li" key={f.href} className="on-dark grid gap-8 rounded-3xl bg-black p-8 text-white sm:p-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <Eyebrow tone="lavender">{f.outlet} · {f.date}</Eyebrow>
                  <h2 className="t-h2 mt-4">{f.title}</h2>
                  <p className="t-body mt-5 text-white/75">{f.summary}</p>
                  <div className="mt-7"><Button href={f.href} variant="onDark" external>{p.readLabel}</Button></div>
                </div>
                <blockquote className="flex items-center border-t border-white/15 pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <p className="t-h3 t-italic text-lavender">“{f.quote}”</p>
                </blockquote>
              </Reveal>
            ))}
          </ul>
          <p className="t-body mt-12 text-black/70">{p.inquiries} <TextLink href={`mailto:${business.email}`}>{business.email}</TextLink></p>
        </Container>
      </Section>
      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
