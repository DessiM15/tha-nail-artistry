import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixUrl } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Icons";

export async function generateMetadata({ params }: PageProps<"/[locale]/workshops">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.workshops;
  return buildMetadata({ locale, path: "/workshops", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function WorkshopsPage({ params }: PageProps<"/[locale]/workshops">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.workshops;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/workshops" }];
  const membership = p.items.find((w) => w.slug === "skills-workshop-membership")!;
  const list = p.items.filter((w) => w.slug !== "skills-workshop-membership");
  return (
    <>
      <PageHero locale={locale} eyebrow={p.kicker} h1={p.h1} lede={p.text} crumbs={crumbs} />

      <Section tone="white" labelledBy="workshop-list">
        <Container>
          <Reveal className="max-w-2xl"><h2 id="workshop-list" className="t-h2">{p.listHeading}</h2><p className="t-body mt-4 text-black/65">{p.eligibility}</p></Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((w, i) => (
              <Reveal as="li" key={w.slug} delay={(i % 3) * 70}>
                <Link href={href(`/workshops/${w.slug}`)} className="group flex h-full flex-col rounded-3xl bg-marble p-7 ring-1 ring-black/10 transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center justify-between gap-3">
                    <Eyebrow>{p.eyebrow}</Eyebrow>
                    {w.price && <span className="rounded-full bg-black px-3 py-1 text-[0.72rem] font-semibold text-white">{w.price}</span>}
                  </div>
                  <h3 className="t-h4 mt-5">{w.name}</h3>
                  {w.tagline && <p className="t-italic mt-1 text-black/60">{w.tagline}</p>}
                  <p className="t-body mt-3 line-clamp-3 text-black/70">{w.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 pt-2 text-[0.9rem] font-semibold mt-auto">{t.common.readMore}<ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="black" labelledBy="membership-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="lavender">{p.heading}</Eyebrow>
            <h2 id="membership-heading" className="t-h2 mt-4">{p.membershipHeading}</h2>
            <p className="t-lede mt-5 text-white/75">{p.membershipText}</p>
          </Reveal>
          <Reveal delay={100} className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Button href={wixUrl(membership.wixPath)} variant="lime" external title={t.common.opensWix}>{p.membershipCta}</Button>
            <Button href={href(`/workshops/${membership.slug}`)} variant="onDarkOutline" icon={false}>{t.common.learnMore}</Button>
          </Reveal>
        </Container>
      </Section>

      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
