import type { Metadata } from "next";
import Image from "next/image";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { enrollment } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, FeatureGrid, ProgramCards } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, LeafDivider, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/tuition">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.tuition;
  return buildMetadata({ locale, path: "/tuition", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function TuitionPage({ params }: PageProps<"/[locale]/tuition">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.tuition;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/tuition" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro[0]} crumbs={crumbs}>
        <Button href={href("/book-a-tour")}>{p.cta}</Button>
        <Button href={href("/financial-aid")} variant="secondary" icon={false}>{t.nav[0].children![5].label}</Button>
      </PageHero>

      <Section tone="white" size="sm">
        <Container className="grid gap-5 lg:grid-cols-12">
          <Reveal className="on-dark rounded-3xl bg-black p-8 text-white lg:col-span-5">
            <Eyebrow tone="lavender">{t.common.paymentPlans}</Eyebrow>
            <p className="t-display mt-4" style={{ fontSize: "clamp(3rem, 2rem + 4vw, 5rem)" }}>${enrollment.applicationFee}</p>
            <p className="t-h4 mt-1">{p.feeHeading.replace(/^\$\d+\s*/, "")}</p>
            <p className="t-body mt-4 text-white/75">{p.feeText}</p>
          </Reveal>
          <Reveal delay={100} className="rounded-3xl bg-marble p-8 ring-1 ring-black/10 lg:col-span-7">
            <h2 className="t-h3">{p.programHeading}</h2>
            <div className="prose-site t-body mt-4 text-black/75">
              {p.program.map((para) => <p key={para}>{para}</p>)}
            </div>
            <div className="mt-6"><Button href={href("/courses")} variant="link">{t.common.courseInfo}</Button></div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="white" labelledBy="included-heading">
        <Container>
          <Reveal className="max-w-2xl"><h2 id="included-heading" className="t-h2">{p.includedHeading}</h2></Reveal>
          <div className="mt-12"><FeatureGrid items={p.included} /></div>
        </Container>
      </Section>

      <Section tone="black" labelledBy="kits-heading">
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
              <Image src="/images/campus/student-kit.jpg" alt={p.kitsAlt} fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" />
            </div>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-6">
            <Eyebrow tone="lavender">{p.kitsHeading}</Eyebrow>
            <h2 id="kits-heading" className="t-h2 mt-4">{p.kitsText}</h2>
            <p className="t-lede mt-5 text-white/75">{p.included[1].text}</p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="marble" labelledBy="payment-heading">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 id="payment-heading" className="t-h2">{p.paymentHeading}</h2>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[0.8rem] font-semibold text-white"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />{t.common.noCreditCheck}</p>
          </Reveal>
          <Reveal delay={100} className="prose-site t-lede text-black/80 lg:col-span-7">
            {p.payment.map((para) => <p key={para}>{para}</p>)}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={href("/book-a-tour")}>{p.cta}</Button>
              <Button href={href("/refund-policy")} variant="link">{p.refundCta}</Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="white" labelledBy="tuition-programs">
        <Container>
          <LeafDivider className="mb-12" />
          <Reveal><h2 id="tuition-programs" className="t-h3">{t.pages.courses.compareHeading}</h2></Reveal>
          <div className="mt-8"><ProgramCards locale={locale} programs={t.pages.programs} t={t} compact /></div>
        </Container>
      </Section>

      <CTABand locale={locale} heading={t.home.closing.heading} text={t.common.tuitionOnTour} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
