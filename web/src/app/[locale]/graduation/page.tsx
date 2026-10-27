import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/graduation">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.graduation;
  return buildMetadata({ locale, path: "/graduation", title: p.title, description: p.description, kicker: p.eyebrow, noIndex: true });
}

export default async function GraduationPage({ params }: PageProps<"/[locale]/graduation">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.graduation;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/graduation" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs} image={{ src: "/images/campus/graduates.jpg", alt: "Tha Nail Artistry Academy graduates celebrating in purple caps and gowns", priority: true }}>
        <Button href={wixLinks.graduationTickets} external title={t.common.opensWix}>{p.ticketsCta}</Button>
      </PageHero>
      <Section tone="white">
        <Container className="grid gap-6 lg:grid-cols-12">
          <Reveal className="on-dark rounded-3xl bg-black p-8 text-white lg:col-span-4">
            <Eyebrow tone="lavender">{p.overviewHeading}</Eyebrow>
            <p className="t-h3 mt-4">{p.date}</p>
            <h2 className="t-eyebrow mt-6 text-white/60">{p.locationHeading}</h2>
            <p className="mt-2 font-semibold">{p.location[0]}</p>
            <p className="text-white/75">{p.location[1]}</p>
          </Reveal>
          <Reveal delay={80} className="rounded-3xl bg-marble p-8 ring-1 ring-black/10 lg:col-span-8">
            <h2 className="t-h3">{p.ceremonyHeading} <span className="t-italic text-black/60">{p.ceremonyTime}</span></h2>
            <p className="t-body mt-3 text-black/75">{p.ceremonyText}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div><h3 className="t-eyebrow text-black/60">{p.expectHeading}</h3><ul className="mt-2 space-y-1 text-[0.9rem]">{p.expect.map((e) => <li key={e}>{e}</li>)}</ul></div>
              <div><h3 className="t-eyebrow text-black/60">{p.dressHeading}</h3><p className="mt-2 text-[0.9rem]">{p.dress}</p></div>
              <div><h3 className="t-eyebrow text-black/60">{p.photosHeading}</h3><p className="mt-2 text-[0.9rem]">{p.photos}</p></div>
            </div>
          </Reveal>
          <Reveal delay={120} className="rounded-3xl ring-1 ring-black/10 p-8 lg:col-span-12">
            <h2 className="t-h3">{p.diningHeading} <span className="t-italic text-black/60">{p.diningTime}</span></h2>
            <div className="prose-site t-body mt-3 max-w-3xl text-black/75">{p.dining.map((d) => <p key={d}>{d}</p>)}</div>
          </Reveal>
        </Container>
      </Section>
      <CTABand locale={locale} heading={p.ticketsHeading} primary={p.ticketsCta} primaryHref={wixLinks.graduationTickets} primaryExternal />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
