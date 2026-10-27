import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { WIX_BASE_URL } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, WorkGallery } from "@/components/sections/Blocks";
import { ServicesBrowser } from "@/components/sections/ServicesBrowser";
import { founderSet } from "@/content/work";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.services;
  return buildMetadata({ locale, path: "/services", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.services;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/services" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs}>
        <Button href={href("/friends-and-family")} variant="link">{p.friendsFamilyCta}</Button>
      </PageHero>

      <Section tone="white">
        <Container>
          <Reveal className="max-w-3xl rounded-2xl bg-lavender/20 px-6 py-4 text-[0.9rem] text-black/80">{p.supervised} {p.note}</Reveal>
          <div className="mt-10">
            <ServicesBrowser items={p.items} categories={p.categories} allLabel={p.allLabel} filterLabel={p.filterLabel} countLabel={p.countLabel} bookLabel={t.common.bookNow} opensWix={t.common.opensWix} wixBase={WIX_BASE_URL} />
          </div>
        </Container>
      </Section>

      <WorkGallery alts={t.home.hero.imageAlts} kicker={t.home.gallery.kicker} heading={t.home.gallery.heading} compact indices={founderSet} prevLabel={t.common.prev} nextLabel={t.common.next} />
      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
