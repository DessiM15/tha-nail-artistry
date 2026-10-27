import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, courseJsonLd } from "@/lib/jsonld";
import { enrollment } from "@/config/site";
import { formatDate } from "@/lib/format";
import { wixLinks } from "@/lib/wix";
import { en } from "@/content/en";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, FeatureGrid, ProgramCards } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/Icons";

export function generateStaticParams() {
  return en.pages.programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/courses/[slug]">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const { slug } = await params;
  const p = t.pages.programs.find((x) => x.slug === slug);
  if (!p) return {};
  return buildMetadata({ locale, path: `/courses/${p.slug}`, title: p.seoTitle, description: p.seoDescription, kicker: t.pages.programPage.kicker });
}

export default async function ProgramPage({ params }: PageProps<"/[locale]/courses/[slug]">) {
  const { locale, t, href } = await getPage(params);
  const { slug } = await params;
  const p = t.pages.programs.find((x) => x.slug === slug);
  if (!p) notFound();
  const pp = t.pages.programPage;
  const others = t.pages.programs.filter((x) => x.slug !== p.slug);
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: t.pages.courses.eyebrow!, path: "/courses" }, { name: p.shortName, path: `/courses/${p.slug}` }];
  const glance = [
    { k: pp.schedule, v: p.schedule },
    { k: pp.length, v: p.lengthLabel },
    { k: pp.format, v: p.format },
    { k: pp.nextStart, v: formatDate(enrollment.nextClassStart, locale) },
  ];

  return (
    <>
      <PageHero locale={locale} eyebrow={`${pp.kicker} · ${p.shortName}`} h1={p.h1} lede={p.intro} crumbs={crumbs} tone={p.featured ? "black" : "marble"}>
        <Button href={wixLinks.apply} variant={p.featured ? "lime" : "primary"} external title={t.common.opensWix}>{t.common.applyNow}</Button>
        <Button href={href("/book-a-tour")} variant={p.featured ? "onDarkOutline" : "secondary"} icon={false}>{t.common.bookTour}</Button>
      </PageHero>

      <Section tone="white" size="sm">
        <Container>
          <Reveal>
            <dl className="grid gap-px overflow-hidden rounded-3xl bg-black/10 ring-1 ring-black/10 sm:grid-cols-2 lg:grid-cols-4">
              {glance.map((g) => (
                <div key={g.k} className="bg-white p-6">
                  <dt className="t-eyebrow text-black/55">{g.k}</dt>
                  <dd className="t-h4 mt-2">{g.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={80} className="mt-8 rounded-3xl bg-lavender/20 p-6 sm:p-8">
            <p className="t-eyebrow text-black/60">{pp.bestFor}</p>
            <p className="t-lede mt-2 max-w-3xl">{p.bestFor}</p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="marble" labelledBy="curriculum-heading">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><h2 id="curriculum-heading" className="t-h2">{pp.curriculumHeading}</h2></Reveal>
            <div className="mt-10"><FeatureGrid items={p.curriculum} columns={2} withIcons={false} /></div>
          </div>
          <Reveal delay={100} className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-8 ring-1 ring-black/10">
              <Eyebrow>{pp.includesHeading}</Eyebrow>
              <ul className="mt-6 space-y-3">
                {p.includes.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.95rem]"><Check width={18} height={18} className="mt-0.5 shrink-0 text-black" />{i}</li>
                ))}
              </ul>
              <div className="on-dark mt-8 rounded-2xl bg-black p-6 text-white">
                <p className="t-eyebrow text-lavender">{pp.tuitionHeading}</p>
                <p className="t-body mt-3 text-white/80">{p.price ? p.price : pp.tuitionText}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-[0.8rem] font-semibold"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />{t.common.noCreditCheck}</p>
                <div className="mt-5"><Button href={href("/tuition")} variant="onDark" size="sm">{t.pages.courses.tuitionCta}</Button></div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="white" labelledBy="others-heading">
        <Container>
          <Reveal><h2 id="others-heading" className="t-h3">{pp.otherPrograms}</h2></Reveal>
          <div className="mt-8"><ProgramCards locale={locale} programs={others} t={t} compact /></div>
        </Container>
      </Section>

      <CTABand locale={locale} heading={t.home.closing.heading} text={t.common.tuitionOnTour} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={[breadcrumbJsonLd(locale, crumbs), courseJsonLd({ locale, path: `/courses/${p.slug}`, name: p.name, description: p.seoDescription, schedule: p.schedule, months: 4, price: p.price })]} />
    </>
  );
}
