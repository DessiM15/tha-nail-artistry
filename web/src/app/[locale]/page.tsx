import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { CTABand, FeatureGrid, FounderQuote, HoursBlock, Partners, ProgramCards, Reviews, WorkGallery } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  return buildMetadata({ locale, path: "/", title: t.meta.defaultTitle, description: t.meta.defaultDescription });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale, t, href } = await getPage(params);
  const h = t.home;
  return (
    <>
      <Hero locale={locale} t={t} />

      <Section tone="white" labelledBy="intro-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>{h.intro.kicker}</Eyebrow>
              <h2 id="intro-heading" className="t-h2 mt-4">{h.intro.heading}</h2>
              <p className="t-lede mt-5 text-black/70">{h.intro.text}</p>
              <div className="mt-7"><Button href={href("/about")} variant="link">{h.intro.cta}</Button></div>
            </Reveal>
            <div className="lg:col-span-7">
              <FeatureGrid items={h.features} columns={2} />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="marble" labelledBy="programs-heading">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Eyebrow>{h.programs.kicker}</Eyebrow>
              <h2 id="programs-heading" className="t-h2 mt-4">{h.programs.heading}</h2>
              <p className="t-lede mt-5 text-black/70">{h.programs.text}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={href("/courses")} variant="secondary">{h.programs.cta}</Button>
              <Button href={href("/which-program")} variant="ghost">{h.programs.quizCta}</Button>
            </div>
          </Reveal>
          <div className="mt-12"><ProgramCards locale={locale} programs={t.pages.programs} t={t} /></div>
        </Container>
      </Section>

      <FounderQuote locale={locale} t={t} />

      <WorkGallery alts={h.hero.imageAlts} kicker={h.gallery.kicker} heading={h.gallery.heading} cta={h.gallery.cta} />

      <Reviews reviews={t.reviews} t={t} />

      <HoursBlock locale={locale} t={t} />

      <Partners t={t} />

      <CTABand locale={locale} heading={h.closing.heading} text={h.closing.text} primary={h.closing.primary} secondary={h.closing.secondary} />
    </>
  );
}
