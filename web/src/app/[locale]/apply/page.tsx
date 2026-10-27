import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, Steps } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/apply">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.apply;
  return buildMetadata({ locale, path: "/apply", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function ApplyPage({ params }: PageProps<"/[locale]/apply">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.apply;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/apply" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs}>
        <Button href={wixLinks.apply} external title={t.common.opensWix}>{p.cta}</Button>
        <Button href={href("/book-a-tour")} variant="secondary" icon={false}>{t.common.bookTour}</Button>
      </PageHero>

      <Section tone="white" labelledBy="steps-heading">
        <Container>
          <Reveal className="max-w-3xl">
            <h2 id="steps-heading" className="t-h2">{p.stepsHeading}</h2>
            <p className="t-lede mt-5 text-black/75">{p.intro}</p>
          </Reveal>
          <div className="mt-12 bg-marble rounded-[2rem] p-4 sm:p-6 lg:p-8"><Steps items={p.steps} /></div>
          <p className="mt-6 text-[0.85rem] font-semibold text-black/60">{p.feeNote}</p>
        </Container>
      </Section>

      <CTABand locale={locale} heading={p.readyHeading} primary={p.cta} secondary={p.tourCta} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
