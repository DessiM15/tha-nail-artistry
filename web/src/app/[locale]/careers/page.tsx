import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.careers;
  return buildMetadata({ locale, path: "/careers", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function CareersPage({ params }: PageProps<"/[locale]/careers">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.careers;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/careers" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs} />
      <Section tone="white">
        <Container>
          <Reveal><h2 className="t-h3">{p.openingsHeading}</h2></Reveal>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {p.jobs.map((j) => (
              <Reveal as="li" key={j.slug} className="flex flex-col rounded-3xl bg-marble p-8 ring-1 ring-black/10">
                <Eyebrow>{j.type}</Eyebrow>
                <h3 className="t-h2 mt-4">{j.title}</h3>
                <p className="t-body mt-4 text-black/70">{j.summary}</p>
                <div className="mt-8"><Button href={href(`/careers/${j.slug}`)}>{j.cta}</Button></div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
