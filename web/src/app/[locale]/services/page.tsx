import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, WorkGallery } from "@/components/sections/Blocks";
import { founderSet } from "@/content/work";
import Image from "next/image";
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
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {p.items.filter((s) => s.category === cat).map((s, i) => (
                    <Reveal as="li" key={s.slug} delay={(i % 3) * 60} className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-lavender">
                      <div className="relative aspect-[5/4]">
                        <Image src={s.image} alt={s.imageAlt} fill className="object-cover" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
                        <span className="absolute left-4 top-4 rounded-full bg-lime px-3 py-1 text-[0.8rem] font-semibold text-black">{s.price}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="t-h4">{s.name}</h3>
                        <p className="mt-0.5 text-[0.8rem] text-black/65">{s.duration}</p>
                        <p className="t-body mt-2 flex-1 text-black/70">{s.description}</p>
                        <div className="mt-4"><Button href={wixLinks.service(s.slug)} size="sm" external title={t.common.opensWix}>{t.common.bookNow}</Button></div>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <WorkGallery alts={t.home.hero.imageAlts} kicker={t.home.gallery.kicker} heading={t.home.gallery.heading} compact indices={founderSet} prevLabel={t.common.prev} nextLabel={t.common.next} />
      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
