import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, FeatureGrid } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/financial-aid">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.financialAid;
  return buildMetadata({ locale, path: "/financial-aid", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function FinancialAidPage({ params }: PageProps<"/[locale]/financial-aid">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.financialAid;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/financial-aid" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs}>
        <Button href={href("/scholarships")}>{p.scholarshipCta}</Button>
        <Button href={href("/tuition")} variant="secondary" icon={false}>{t.nav[0].children![4].label}</Button>
      </PageHero>

      <Section tone="white" labelledBy="options-heading">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="t-lede text-black/80">{p.intro}</p>
            <p className="mt-4 text-[0.85rem] font-semibold text-black/60">{p.noCombine}</p>
          </Reveal>
          <Reveal className="mt-14 max-w-2xl"><h2 id="options-heading" className="t-h2">{p.optionsHeading}</h2></Reveal>
          <div className="mt-10"><FeatureGrid items={p.options} columns={2} /></div>
        </Container>
      </Section>

      <Section tone="black" labelledBy="workstudy-heading">
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow tone="lavender">{p.workStudyHeading}</Eyebrow>
            <h2 id="workstudy-heading" className="t-h2 mt-4">{p.options[3].text}</h2>
            <p className="t-lede mt-5 text-white/75">{p.workStudyIntro}</p>
          </Reveal>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {p.workStudy.map((col, i) => (
              <Reveal as="li" key={col.title} delay={i * 80} className="rounded-3xl border border-white/15 p-7">
                <span className="t-display block text-lavender" style={{ fontSize: "2.5rem" }} aria-hidden="true">{i + 1}</span>
                <h3 className="t-h4 mt-2">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-[0.92rem] text-white/80">
                  {col.items.map((it) => <li key={it} className="flex gap-2.5"><span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-lime" />{it}</li>)}
                </ul>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <CTABand locale={locale} heading={p.readyHeading} text={p.readyText} primary={p.cta} primaryHref={href("/book-a-tour")} secondary={t.common.applyNow} secondaryHref={href("/apply")} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
