import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/content/heroImages";
import { ReadinessAssessment } from "@/components/forms/ReadinessAssessment";
import { Container, Section } from "@/components/ui/Primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/readiness-assessment">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.assessment;
  return buildMetadata({ locale, path: "/readiness-assessment", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function ReadinessAssessmentPage({ params }: PageProps<"/[locale]/readiness-assessment">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.assessment;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/readiness-assessment" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs} images={heroImages(locale, "assessment")} />
      <Section tone="white" size="sm">
        <Container>
          <div className="mx-auto max-w-3xl">
            <ReadinessAssessment locale={locale} copy={p} />
          </div>
        </Container>
      </Section>
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
