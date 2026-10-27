import type { Metadata } from "next";
import Image from "next/image";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, LeafDivider, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.about;
  return buildMetadata({ locale, path: "/about", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.about;
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} crumbs={[{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/about" }]} image={{ src: "/images/campus/gen-with-student.jpg", alt: "Gen Henriquez guiding a student through a nail art practice sheet at Tha Nail Artistry Academy in Houston", priority: true }} />

      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="prose-site t-lede lg:col-span-7 text-black/80">
            {p.body.map((para) => <p key={para}>{para}</p>)}
            <p className="mt-8 text-[0.85rem] font-semibold tracking-[0.04em] text-black/60">{p.serving}</p>
            <div className="mt-8"><Button href={href("/founder")}>{p.cta}</Button></div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src="/images/campus/class-with-rayven.jpg" alt="Rayven Russell teaching a hands-on class at Tha Nail Artistry Academy, Houston" fill className="object-cover" sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="black">
        <Container>
          <LeafDivider className="mb-12" />
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <Eyebrow tone="lavender">{p.missionHeading}</Eyebrow>
              <p className="t-h3 mt-5 text-white/95">{p.mission}</p>
            </Reveal>
            <Reveal delay={100}>
              <Eyebrow tone="lavender">{p.visionHeading}</Eyebrow>
              <div className="mt-5 space-y-5">
                {p.vision.map((v) => <p key={v} className="t-lede text-white/85">{v}</p>)}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand locale={locale} heading={t.home.closing.heading} text={t.home.closing.text} primary={t.home.closing.primary} secondary={t.home.closing.secondary} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/about" }])} />
    </>
  );
}
