import type { Metadata } from "next";
import { getPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { business } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Facebook, Instagram, Mail, Phone, Pin, TikTok } from "@/components/ui/Icons";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale, t } = await getPage(params);
  const p = t.pages.contact;
  return buildMetadata({ locale, path: "/contact", title: p.title, description: p.description, kicker: p.eyebrow });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale, t, href } = await getPage(params);
  const p = t.pages.contact;
  const c = t.common;
  const crumbs = [{ name: c.breadcrumbHome, path: "/" }, { name: p.eyebrow!, path: "/contact" }];
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`)}&output=embed`;
  return (
    <>
      <PageHero locale={locale} eyebrow={p.eyebrow} h1={p.h1} lede={p.intro} crumbs={crumbs}>
        <Button href={href("/faqs")} variant="secondary" icon={false}>{p.faqCta}</Button>
        <Button href={href("/book-a-tour")}>{p.tourCta}</Button>
      </PageHero>

      <Section tone="white">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            <Reveal className="rounded-3xl bg-marble p-7 ring-1 ring-black/10">
              <Phone className="text-black/60" />
              <h2 className="t-h4 mt-4">{p.phoneHeading}</h2>
              <a href={business.phoneHref} className="t-h3 mt-2 block hover:underline underline-offset-4">{business.phoneDisplay}</a>
              <p className="mt-2 inline-flex items-center gap-2 text-[0.85rem] font-semibold text-black/70"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />{c.hablamos}</p>
            </Reveal>
            <Reveal delay={60} className="rounded-3xl bg-marble p-7 ring-1 ring-black/10">
              <Mail className="text-black/60" />
              <h2 className="t-h4 mt-4">{p.emailHeading}</h2>
              <a href={`mailto:${business.email}?subject=Contact%20Form`} className="mt-2 block break-all font-semibold hover:underline underline-offset-4">{business.email}</a>
              <a href={`mailto:${business.admissionsEmail}`} className="mt-1 block break-all text-[0.9rem] text-black/65 hover:underline underline-offset-4">{business.admissionsEmail}</a>
            </Reveal>
            <Reveal delay={120} className="rounded-3xl bg-marble p-7 ring-1 ring-black/10">
              <Pin className="text-black/60" />
              <h2 className="t-h4 mt-4">{p.visitHeading}</h2>
              <address className="mt-2 not-italic text-black/80">{business.address.street}<br />{business.address.city}, {business.address.region} {business.address.postalCode}</address>
              <div className="mt-4"><Button href={business.mapsUrl} variant="link" external>{c.directions}</Button></div>
            </Reveal>
            <Reveal delay={180} className="on-dark rounded-3xl bg-black p-7 text-white">
              <h2 className="t-h4">{p.hoursHeading}</h2>
              <dl className="mt-3 space-y-2 text-[0.9rem]">
                <div><dt className="t-eyebrow text-lavender">{c.classHours}</dt><dd className="mt-1 text-white/85">{c.monFri} 9am to 9pm<br />{c.satSun} 10am to 7pm</dd></div>
                <div><dt className="t-eyebrow text-lavender">{c.officeHours}</dt><dd className="mt-1 text-white/85">{c.monFri} 9am to 6pm<br />{c.satSun} {c.closed}</dd></div>
              </dl>
              <h3 className="t-eyebrow mt-6 text-lavender">{p.socialHeading}</h3>
              <ul className="mt-3 flex gap-2">
                {[{ href: business.social.instagram, label: "Instagram", Icon: Instagram }, { href: business.social.tiktok, label: "TikTok", Icon: TikTok }, { href: business.social.facebook, label: "Facebook", Icon: Facebook }].map(({ href: h, label, Icon }) => (
                  <li key={label}><a href={h} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full ring-1 ring-white/25 hover:bg-lavender hover:text-black"><Icon width={18} height={18} /></a></li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={100} className="lg:col-span-6">
            <div className="h-full min-h-[22rem] overflow-hidden rounded-3xl ring-1 ring-black/10 grayscale">
              <iframe title={p.mapTitle} src={mapSrc} className="h-full min-h-[22rem] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </Reveal>
        </Container>
      </Section>
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
    </>
  );
}
