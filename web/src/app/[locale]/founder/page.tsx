import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { business } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, WorkGallery } from "@/components/sections/Blocks";
import { founderSet } from "@/content/work";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/founder">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.founder;
  return buildMetadata({ locale, path: "/founder", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function FounderPage({ params }: PageProps<"/[locale]/founder">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.founder;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: t.nav[1].children![1].label, path: "/founder" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.quote} crumbs={crumbs} image={{ src: "/images/campus/gen-henriquez-founder.jpg", alt: "Gen Henriquez, founder of Tha Nail Artistry Academy, in the Houston classroom with professional student nail kits", priority: true }} />

      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="prose-site t-lede text-black/80">
              {p.story.map((para, i) => <p key={i} className={i === 1 ? "t-h3 text-black" : ""}>{para}</p>)}
            </div>
            <div className="mt-10 border-t border-black/10 pt-8 prose-site t-body text-black/75">
              {p.bio.map((para) => <p key={para}>{para}</p>)}
            </div>
          </Reveal>
          <div className="lg:col-span-5">
            <Reveal delay={120} className="on-dark rounded-3xl bg-black p-8 text-white">
              <Eyebrow tone="lavender">{p.missionHeading}</Eyebrow>
              <p className="t-h4 mt-4">{p.mission}</p>
            </Reveal>
            <Reveal delay={200} className="mt-5 rounded-3xl bg-marble p-8 ring-1 ring-black/10">
              <Eyebrow>{p.pressKicker}</Eyebrow>
              <p className="t-h4 mt-4"><span className="t-italic">“{p.pressQuote}”</span></p>
              <div className="mt-5"><Button href={business.press.voyageHouston} variant="link" external>{p.pressCta}</Button></div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <WorkGallery alts={t.home.hero.imageAlts} kicker={p.name} heading={p.workHeading} cta={t.home.gallery.cta} compact indices={founderSet} />

      <Section tone="marble" size="sm">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h2 className="t-h3">{t.pages.team.h1}</h2>
          <Button href={href("/team")}>{p.cta}</Button>
        </Container>
      </Section>

      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.home.closing.primary} secondary={t.home.closing.secondary} />
      <JsonLd data={[breadcrumbJsonLd(locale, crumbs), { "@context": "https://schema.org", "@type": "Person", name: "Genevieve Henriquez", alternateName: "Gen Henriquez", jobTitle: p.role, worksFor: { "@id": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thanailartistry.com"}/#organization` }, image: "/images/campus/gen-henriquez-founder.jpg" }]} />
    </>
  );
}
