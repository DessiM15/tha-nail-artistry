import type { Metadata } from "next";
import Image from "next/image";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, Note } from "@/components/sections/Blocks";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/team">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.team;
  return buildMetadata({ locale, path: "/team", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function TeamPage({ params }: PageProps<"/[locale]/team">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.team;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/team" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs} />

      <Section tone="white">
        <Container className="space-y-20 lg:space-y-28">
          {p.members.map((m, i) => (
            <article key={m.slug} id={m.slug} className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16" aria-labelledby={`${m.slug}-name`}>
              <Reveal className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="arch relative mx-auto aspect-[4/5] w-full max-w-md lg:sticky lg:top-28">
                  <Image src={m.image} alt={m.imageAlt} fill className="object-cover object-top" sizes="(min-width:1024px) 40vw, 90vw" priority={i === 0} />
                </div>
              </Reveal>
              <Reveal delay={100} className="lg:col-span-7">
                <Eyebrow>{m.role}</Eyebrow>
                <h2 id={`${m.slug}-name`} className="t-h2 mt-4">{m.name}</h2>
                <div className="prose-site t-body mt-6 max-w-2xl text-black/80">
                  {m.bio.map((para) => <p key={para}>{para}</p>)}
                </div>
                {m.isPlaceholderBio && <Note>{t.common.placeholderNote}</Note>}
              </Reveal>
            </article>
          ))}
        </Container>
      </Section>

      <CTABand locale={locale} heading={p.closing} primary={p.cta} primaryHref={wixLinks.apply} primaryExternal secondary={t.common.bookTour} />
      <JsonLd data={[breadcrumbJsonLd(locale, crumbs), ...p.members.map((m) => ({ "@context": "https://schema.org", "@type": "Person", name: m.name, jobTitle: m.role, image: m.image }))]} />
    </>
  );
}
