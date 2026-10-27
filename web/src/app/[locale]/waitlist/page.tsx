import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { business } from "@/config/site";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand, TextLink } from "@/components/sections/Blocks";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/waitlist">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.waitlist;
  return buildMetadata({ locale, path: "/waitlist", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function WaitlistPage({ params }: PageProps<"/[locale]/waitlist">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.waitlist;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/waitlist" }];
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs}>
        <Button href={wixLinks.waitlistForm} external title={t.common.opensWix}>{p.cta}</Button>
      </PageHero>
      <Section tone="white" size="sm">
        <Container>
          <Reveal className="max-w-2xl rounded-3xl bg-marble p-8 ring-1 ring-black/10">
            <p className="t-body text-black/80">{p.note}</p>
            <p className="t-body mt-4 text-black/80">{p.emailLabel} <TextLink href={`mailto:${business.admissionsEmail}`}>{business.admissionsEmail}</TextLink></p>
          </Reveal>
        </Container>
      </Section>
      <CTABand locale={locale} heading={t.home.closing.heading} primary={t.common.applyNow} secondary={t.common.bookTour} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
