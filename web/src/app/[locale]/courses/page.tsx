import type { Metadata } from "next";
import Image from "next/image";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, FeatureGrid, ProgramCards } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, LeafDivider, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/courses">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.courses;
  return buildMetadata({ locale, path: "/courses", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function CoursesPage({ params }: PageProps<"/[locale]/courses">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.courses;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/courses" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.lede} crumbs={crumbs}>
        <Button href={href("/tuition")} variant="primary">{p.tuitionCta}</Button>
        <Button href={href("/book-a-tour")} variant="secondary" icon={false}>{p.tourCta}</Button>
      </PageHero>

      <Section tone="white" labelledBy="compare-heading">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h2 id="compare-heading" className="t-h2">{p.compareHeading}</h2>
              <p className="t-lede mt-4 text-black/70">{p.compareText}</p>
            </div>
            <p className="text-[0.95rem] text-black/70">{p.pickHelp} <Button href={href("/which-program")} variant="link">{p.pickCta}</Button></p>
          </Reveal>
          <div className="mt-12"><ProgramCards locale={locale} programs={t.pages.programs} t={t} /></div>
        </Container>
      </Section>

      <Section tone="marble" labelledBy="overview-heading">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2 id="overview-heading" className="t-h2">{p.overviewHeading}</h2>
            <p className="t-lede mt-5 text-black/75">{p.overview}</p>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src="/images/campus/student-kit.jpg" alt={t.pages.tuition.kitsAlt} fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" />
            </div>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-6">
            <div className="rounded-3xl bg-white p-8 ring-1 ring-black/10 sm:p-10">
              <Eyebrow>{p.scheduleHeading}</Eyebrow>
              <p className="t-h3 mt-4">{p.schedule[0]}</p>
              <div className="prose-site t-body mt-5 text-black/75">
                {p.schedule.slice(1, 4).map((s) => <p key={s}>{s}</p>)}
                <p className="mt-4 rounded-xl bg-black px-4 py-3 font-semibold text-white">{p.campusHours}</p>
                <p>{p.schedule[4]}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="white" labelledBy="learn-heading">
        <Container>
          <LeafDivider className="mb-12" />
          <Reveal className="max-w-2xl"><h2 id="learn-heading" className="t-h2">{p.learnHeading}</h2></Reveal>
          <div className="mt-12"><FeatureGrid items={p.learn} /></div>
        </Container>
      </Section>

      <CTABand locale={locale} heading={t.home.closing.heading} text={t.common.tuitionOnTour} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
