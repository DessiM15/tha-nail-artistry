import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { wixLinks } from "@/lib/wix";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container, LeafDivider, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/friends-and-family">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.friendsFamily;
  return buildMetadata({ locale, path: "/friends-and-family", title: p.title, description: p.description, kicker: p.eyebrow, noIndex: true });
}

export default async function FriendsFamilyPage({ params }: PageProps<"/[locale]/friends-and-family">) {
  const { locale, t } = await getPage(params);
  const p = t.pages.friendsFamily;
  const crumbs = [{ name: t.common.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/friends-and-family" }];
  const picks = t.pages.services.items.filter((s) => s.category === "manipedi");
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro[0]} crumbs={crumbs} tone="black" />
      <Section tone="white">
        <Container>
          <LeafDivider className="mb-10" />
          <Reveal className="mx-auto max-w-2xl text-center"><p className="t-h3 t-italic text-black/70">“{p.quote}”</p><p className="t-body mt-6 text-black/70">{p.intro[1]}</p></Reveal>
          <Reveal className="mt-14"><h2 className="t-h2">{p.servicesHeading}</h2></Reveal>
          <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
            {picks.map((s) => (
              <li key={s.slug} className="grid gap-3 py-5 sm:grid-cols-12 sm:items-center">
                <div className="sm:col-span-7"><h3 className="t-h4">{s.name}</h3><p className="text-[0.85rem] text-black/65">{s.duration}</p></div>
                <div className="flex items-center justify-between gap-4 sm:col-span-5 sm:justify-end"><span className="t-h4">{s.price}</span><Button href={wixLinks.service(s.slug)} size="sm" external title={t.common.opensWix}>{p.cta}</Button></div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
