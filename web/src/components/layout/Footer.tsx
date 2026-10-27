import Image from "next/image";
import Link from "next/link";
import { agency, business } from "@/config/site";
import { wixLinks } from "@/lib/wix";
import { localeHref, type Locale } from "@/i18n/config";
import type { SiteContent } from "@/content/types";
import { Facebook, Instagram, TikTok, ArrowUpRight } from "@/components/ui/Icons";
import { Year } from "./Year";

export function Footer({ locale, t }: { locale: Locale; t: SiteContent }) {
  const c = t.common;
  const L = (p: string) => localeHref(locale, p);
  const programs = t.nav[0].children ?? [];
  const academy = t.nav[1].children ?? [];

  return (
    <footer className="on-dark bg-black text-white">
      <div className="hairline opacity-70" aria-hidden="true" />
      <div className="container-x section-sm pb-24 md:pb-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href={L("/")} className="inline-block rounded-sm" aria-label={`Tha Nail Artistry Academy, ${c.home}`}>
              <Image src="/images/logo-white-trim.png" alt="Tha Nail Artistry Academy" width={1679} height={386} className="h-11 w-auto" sizes="240px" />
            </Link>
            <p className="t-body mt-5 max-w-sm text-white/70">{c.footerTagline}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-[0.85rem] font-semibold"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />{c.hablamos}</p>
            <ul className="mt-6 flex gap-3" aria-label={c.footerFollow}>
              {[
                { href: business.social.instagram, label: "Instagram", Icon: Instagram },
                { href: business.social.tiktok, label: "TikTok", Icon: TikTok },
                { href: business.social.facebook, label: "Facebook", Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (${business.social.handle})`} className="grid size-11 place-items-center rounded-full ring-1 ring-white/25 transition-colors hover:bg-lavender hover:text-black hover:ring-lavender">
                    <Icon width={18} height={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5" aria-label="Footer">
            <div>
              <h2 className="t-eyebrow text-lavender">{c.footerPrograms}</h2>
              <ul className="mt-4 space-y-2.5 text-[0.9rem]">
                {programs.slice(0, 7).map((i) => (<li key={i.href}><Link href={L(i.href)} className="text-white/80 hover:text-white hover:underline underline-offset-4">{i.label}</Link></li>))}
              </ul>
            </div>
            <div>
              <h2 className="t-eyebrow text-lavender">{c.footerAcademy}</h2>
              <ul className="mt-4 space-y-2.5 text-[0.9rem]">
                {academy.map((i) => (<li key={i.href}><Link href={L(i.href)} className="text-white/80 hover:text-white hover:underline underline-offset-4">{i.label}</Link></li>))}
                <li><Link href={L("/workshops")} className="text-white/80 hover:text-white hover:underline underline-offset-4">{t.nav[2].label}</Link></li>
                <li><Link href={L("/services")} className="text-white/80 hover:text-white hover:underline underline-offset-4">{t.nav[3].label}</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="t-eyebrow text-lavender">{c.footerCustomerCare}</h2>
              <ul className="mt-4 space-y-2.5 text-[0.9rem]">
                <li><Link href={L("/contact")} className="text-white/80 hover:text-white hover:underline underline-offset-4">{t.nav[5].children?.[1].label}</Link></li>
                <li><Link href={L("/faqs")} className="text-white/80 hover:text-white hover:underline underline-offset-4">{t.nav[5].children?.[0].label}</Link></li>
                <li><Link href={L("/book-a-tour")} className="text-white/80 hover:text-white hover:underline underline-offset-4">{t.nav[4].label}</Link></li>
                <li><Link href={L("/refund-policy")} className="text-white/80 hover:text-white hover:underline underline-offset-4">{t.nav[5].children?.[6].label}</Link></li>
                <li><Link href={L("/privacy-policy")} className="text-white/80 hover:text-white hover:underline underline-offset-4">{t.nav[5].children?.[7].label}</Link></li>
                <li><a href={wixLinks.login} className="inline-flex items-center gap-1 text-white/80 hover:text-white hover:underline underline-offset-4" title={c.opensWix}>{c.login}<ArrowUpRight width={13} height={13} /></a></li>
              </ul>
            </div>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="t-eyebrow text-lavender">{c.footerLocation}</h2>
            <address className="mt-4 space-y-3 not-italic text-[0.9rem] text-white/80">
              <p><a href={business.phoneHref} className="font-semibold text-white hover:underline underline-offset-4">{business.phoneDisplay}</a></p>
              <p><a href={`mailto:${business.email}`} className="hover:text-white hover:underline underline-offset-4">{business.email}</a></p>
              <p>
                <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline underline-offset-4">
                  {business.address.street}<br />{business.address.city}, {business.address.region} {business.address.postalCode}
                </a>
              </p>
            </address>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.82rem] text-white/65">
              <dt className="font-semibold text-white/85">{c.classHours}</dt><dd>{c.monFri} 9am to 9pm · {c.satSun} 10am to 7pm</dd>
              <dt className="font-semibold text-white/85">{c.officeHours}</dt><dd>{c.monFri} 9am to 6pm</dd>
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.8rem] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© <Year /> {business.legalName}. {c.allRights}</p>
          <p>
            {c.designedBy}{" "}
            <a href={agency.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-white/80 underline-offset-4 hover:text-lavender hover:underline">
              {agency.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
