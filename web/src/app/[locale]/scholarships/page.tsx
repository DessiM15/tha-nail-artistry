import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, Steps } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/scholarships">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.scholarships;
  return buildMetadata({ locale, path: "/scholarships", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function ScholarshipsPage({ params }: PageProps<"/[locale]/scholarships">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.scholarships;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/scholarships" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs} tone="black">
        <Button href={wixLinks.scholarshipForm} variant="lime" external title={t.common.opensWix}>{p.cta}</Button>
      </PageHero>

      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="t-h2">{p.detailsHeading}</h2>
            <p className="t-lede mt-5 text-black/80">{p.details}</p>
            <p className="t-body mt-5 text-black/65">{p.intro}</p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <div className="rounded-3xl bg-marble p-8 ring-1 ring-black/10">
              <Eyebrow>{p.responsibleHeading}</Eyebrow>
              <p className="t-body mt-4 text-black/75">{p.responsible[0]}</p>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-[0.92rem]">
                {p.responsible.slice(1).map((r) => <li key={r} className="flex gap-2"><span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-lavender" />{r}</li>)}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="marble" labelledBy="qualify-heading">
        <Container>
          <Reveal className="max-w-2xl"><h2 id="qualify-heading" className="t-h2">{p.qualifyHeading}</h2></Reveal>
          <div className="mt-10"><Steps items={p.steps} /></div>
          <p className="mt-6 text-[0.85rem] text-black/60">{p.ctaNote}</p>
        </Container>
      </Section>

      <CTABand locale={locale} heading={p.h1} text={p.lede} primary={p.cta} primaryHref={wixLinks.scholarshipForm} primaryExternal secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
