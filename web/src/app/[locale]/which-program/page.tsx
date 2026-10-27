import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { ProgramCards } from "@/components/sections/Blocks";
import { ProgramPicker } from "@/components/quiz/ProgramPicker";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/which-program">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.quiz;
  return buildMetadata({ locale, path: "/which-program", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function WhichProgramPage({ params }: PageProps<"/[locale]/which-program">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.quiz;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/which-program" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs} />
      <Section tone="marble" size="sm">
        <Container className="max-w-3xl">
          <ProgramPicker locale={locale} quiz={p} programs={t.pages.programs} />
        </Container>
      </Section>
      <Section tone="white" labelledBy="all-programs">
        <Container>
          <Reveal><h2 id="all-programs" className="t-h3">{t.pages.courses.compareHeading}</h2></Reveal>
          <div className="mt-8"><ProgramCards locale={locale} programs={t.pages.programs} t={t} compact /></div>
        </Container>
      </Section>
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
