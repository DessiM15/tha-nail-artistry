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
  /** Two or three photos: the first leads in a tall arch, the rest stack beside it. */
  images?: { src: string; alt: string }[];
  children?: ReactNode;
  tone?: "marble" | "black";
}

/** Consistent top-of-page block: breadcrumbs, eyebrow, SEO H1 and lede on marble (or black). */
export function PageHero({ locale, eyebrow, h1, lede, crumbs, image, images, children, tone = "marble" }: Props) {
  const dark = tone === "black";
  const hasMedia = Boolean(image || (images && images.length));
  return (
    <section className={`${dark ? "on-dark bg-black text-white" : "bg-marble text-black"} relative overflow-hidden`}>
      {!dark && <BrandBlobs variant="hero" opacity={0.38} />}
      <Container className={`relative pb-12 pt-8 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-10 ${hasMedia ? "grid items-center gap-10 lg:grid-cols-12" : ""}`}>
        <div className={hasMedia ? "lg:col-span-7" : "max-w-4xl"}>
          <Breadcrumbs locale={locale} crumbs={crumbs} tone={dark ? "light" : "dark"} />
          <div className="mt-8 sm:mt-10">
            {eyebrow && <Eyebrow tone={dark ? "lavender" : "dark"}>{eyebrow}</Eyebrow>}
            <h1 className="t-h1 mt-4">{h1}</h1>
            {lede && <p className={`t-lede mt-5 max-w-2xl ${dark ? "text-white/80" : "text-black/70"}`}>{lede}</p>}
            {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
          </div>
        </div>
        {!image && images && images.length > 0 && (
          <Reveal delay={120} className="lg:col-span-5">
            <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4">
              <div className="arch relative col-span-2 row-span-2 aspect-[4/5] overflow-hidden">
                <Image src={images[0].src} alt={images[0].alt} fill priority className="drift object-cover" sizes="(min-width: 1024px) 28vw, 66vw" />
              </div>
              {images.slice(1, 3).map((img, i) => (
                <div key={img.src} className={`relative min-h-0 overflow-hidden ${i === 0 ? "rounded-t-3xl rounded-b-2xl" : "rounded-b-3xl rounded-t-2xl"}`}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(min-width: 1024px) 14vw, 33vw" />
                </div>
              ))}
            </div>
          </Reveal>
        )}
        {image && (
          <Reveal delay={120} className="lg:col-span-5">
            <div className={`relative w-full ${image.landscape ? "aspect-[4/3] overflow-hidden rounded-3xl" : "arch aspect-[4/5] max-h-[26rem] lg:max-h-none"}`}>
              <Image src={image.src} alt={image.alt} fill priority={image.priority} className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
