import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, WorkGallery } from "@/components/sections/Blocks";
import { founderSet } from "@/content/work";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/content/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.services;
  return buildMetadata({ locale, path: "/services", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.services;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/services" }];
  const cats: Service["category"][] = ["manipedi", "enhancements", "repairs"];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs}>
        <Button href={href("/friends-and-family")} variant="link">{p.friendsFamilyCta}</Button>
      </PageHero>

      <Section tone="white">
        <Container>
          <Reveal className="max-w-3xl rounded-2xl bg-lavender/20 px-6 py-4 text-[0.9rem] text-black/80">{p.supervised} {p.note}</Reveal>
          <div className="mt-12 space-y-14">
            {cats.map((cat) => (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                <Reveal><h2 id={`cat-${cat}`} className="t-h3">{p.categories[cat]}</h2></Reveal>
                <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
                  {p.items.filter((s) => s.category === cat).map((s, i) => (
                    <Reveal as="li" key={s.slug} delay={i * 40} className="grid gap-3 py-5 sm:grid-cols-12 sm:items-center sm:gap-6">
                      <div className="sm:col-span-7">
                        <h3 className="t-h4">{s.name}</h3>
                        <p className="t-body mt-1 text-black/65">{s.description}</p>
                      </div>
                      <p className="text-[0.85rem] text-black/55 sm:col-span-2">{s.duration}</p>
                      <div className="flex items-center justify-between gap-4 sm:col-span-3 sm:justify-end">
                        <span className="t-h4">{s.price}</span>
                        <Button href={wixLinks.service(s.slug)} size="sm" external title={t.common.opensWix}>{t.common.bookNow}</Button>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <WorkGallery alts={t.home.hero.imageAlts} kicker={t.home.gallery.kicker} heading={t.home.gallery.heading} compact indices={founderSet} />
      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
