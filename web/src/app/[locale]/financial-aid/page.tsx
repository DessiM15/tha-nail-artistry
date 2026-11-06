import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/content/heroImages";
import { CTABand, FeatureGrid } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { enrollment } from "@/config/site";
import { tuition } from "@/config/tuition";
import { fill, usd } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/[locale]/financial-aid">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.financialAid;
  return buildMetadata({ locale, path: "/financial-aid", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function FinancialAidPage({ params }: PageProps<"/[locale]/financial-aid">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.financialAid;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/financial-aid" }];
  const amounts = {
    down: usd(enrollment.downPayment),
    core: usd(tuition.core.payInFull),
    specialty: usd(tuition.specialty.payInFull),
    complete: usd(tuition.complete.payInFull),
  };
  const options = p.options.map((o) => ({ ...o, text: fill(o.text, amounts) }));
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs} images={heroImages(locale, "financialAid")}>
        <Button href={href("/book-a-tour")}>{t.common.bookTour}</Button>
        <Button href={href("/tuition")} variant="secondary" icon={false}>{t.nav[0].children![4].label}</Button>
      </PageHero>

      <Section tone="white" labelledBy="options-heading">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="t-lede text-black/80">{p.intro}</p>
            <p className="mt-4 text-[0.85rem] font-semibold text-black/60">{p.noCombine}</p>
          </Reveal>
          <Reveal className="mt-14 max-w-2xl"><h2 id="options-heading" className="t-h2">{p.optionsHeading}</h2></Reveal>
          <div className="mt-10"><FeatureGrid items={options} columns={2} /></div>
          <Reveal className="mt-10"><Button href={`${href("/tuition")}#pricing`} variant="link">{t.pages.tuition.pricing.heading}</Button></Reveal>
        </Container>
      </Section>

      <CTABand locale={locale} heading={p.readyHeading} text={p.readyText} primary={p.cta} primaryHref={href("/book-a-tour")} secondary={t.common.applyNow} secondaryHref={href("/apply")} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
