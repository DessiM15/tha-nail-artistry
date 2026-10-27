import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { Note, PolicySections } from "@/components/sections/Blocks";
import { Container, Section } from "@/components/ui/Primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/refund-policy">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.refund;
  return buildMetadata({ locale, path: "/refund-policy", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function PolicyPage({ params }: PageProps<"/[locale]/refund-policy">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.refund;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.h1, path: "/refund-policy" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} crumbs={crumbs} />
      <Section tone="white" size="sm">
        <Container>
          {"placeholder" in p && <div className="mb-8"><Note>{String(p.placeholder)}</Note></div>}
          <PolicySections sections={p.sections} />
        </Container>
      </Section>
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
