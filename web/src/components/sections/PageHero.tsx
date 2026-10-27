import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandBlobs, Container, Eyebrow } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { localeHref, type Locale } from "@/i18n/config";

interface Crumb { name: string; path: string }

export function Breadcrumbs({ locale, crumbs, tone = "dark" }: { locale: Locale; crumbs: Crumb[]; tone?: "dark" | "light" }) {
  const c = tone === "light" ? "text-white/70" : "text-black/65";
  return (
    <nav aria-label="Breadcrumb" className={`text-[0.8rem] ${c}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="inline-flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={tone === "light" ? "text-white" : "text-black"}>{crumb.name}</span>
              ) : (
                <Link href={localeHref(locale, crumb.path)} className="hover:underline underline-offset-4">{crumb.name}</Link>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface Props {
  locale: Locale;
  eyebrow?: string;
  h1: string;
  lede?: string;
  crumbs: Crumb[];
  image?: { src: string; alt: string; priority?: boolean; landscape?: boolean };
  children?: ReactNode;
  tone?: "marble" | "black";
}

/** Consistent top-of-page block: breadcrumbs, eyebrow, SEO H1 and lede on marble (or black). */
export function PageHero({ locale, eyebrow, h1, lede, crumbs, image, children, tone = "marble" }: Props) {
  const dark = tone === "black";
  return (
    <section className={`${dark ? "on-dark bg-black text-white" : "bg-marble text-black"} relative overflow-hidden`}>
      {!dark && <BrandBlobs variant="hero" opacity={0.38} />}
      <Container className="relative flex flex-col items-center pb-10 pt-8 text-center sm:pb-12 sm:pt-10">
        <Breadcrumbs locale={locale} crumbs={crumbs} tone={dark ? "light" : "dark"} />
        <div className="mt-8 flex max-w-3xl flex-col items-center sm:mt-10">
          {eyebrow && <Eyebrow tone={dark ? "lavender" : "dark"} className="justify-center">{eyebrow}</Eyebrow>}
          <h1 className="t-h1 mt-4">{h1}</h1>
          {lede && <p className={`t-lede mt-5 max-w-2xl ${dark ? "text-white/80" : "text-black/70"}`}>{lede}</p>}
          {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
        </div>
        {image && (
          <Reveal delay={120} className={`mt-10 w-full ${image.landscape ? "max-w-4xl" : "max-w-sm"}`}>
            <div className={`relative w-full ${image.landscape ? "aspect-[2/1] overflow-hidden rounded-3xl" : "arch aspect-[4/5]"}`}>
              <Image src={image.src} alt={image.alt} fill priority={image.priority} className="object-cover" sizes={image.landscape ? "(min-width: 1024px) 896px, 100vw" : "384px"} />
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
