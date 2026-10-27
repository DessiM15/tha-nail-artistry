import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BrandBlobs, Container } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { enrollment } from "@/config/site";
import { formatDate } from "@/lib/format";
import { wixLinks } from "@/lib/wix";
import { localeHref, type Locale } from "@/i18n/config";
import type { SiteContent } from "@/content/types";

import { heroSet, workImages } from "@/content/work";

const strip = heroSet.map((i) => workImages[i].src);

/**
 * Full-bleed marble hero. The texture is vector so it stays crisp at any width;
 * student work sits in arched frames at the right. Swap in a video or hi-res photo
 * later by replacing the right column.
 */
export function Hero({ locale, t }: { locale: Locale; t: SiteContent }) {
  const h = t.home.hero;
  const c = t.common;
  return (
    <section className="bg-marble relative overflow-hidden" aria-labelledby="hero-heading">
      <BrandBlobs variant="hero" opacity={0.42} />
      <Container className="relative grid min-h-[calc(100svh-var(--header-h)-2.5rem)] items-center gap-10 py-12 lg:grid-cols-12 lg:gap-6 lg:py-14">
        <div className="lg:col-span-7 xl:col-span-6">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full bg-black px-5 py-2.5 text-[0.95rem] font-semibold tracking-[0.03em] text-white">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-lime" />
              {c.nowEnrolling} · {formatDate(enrollment.nextClassStart, locale, { month: "short", day: "numeric" })}
            </p>
          </Reveal>
          <div>
            <p className="t-eyebrow mt-7 text-black/70">{h.kicker}</p>
            <h1 id="hero-heading" className="t-display mt-4">
              {h.h1}
              <br />
              <span className="t-italic text-black/80">{h.h1Accent}</span>
            </h1>
            <p className="t-lede mt-7 max-w-xl text-black/70">{h.lede}</p>
          </div>
          <Reveal delay={120} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={wixLinks.apply} size="lg" external title={c.opensWix}>{h.primary}</Button>
            <Button href={localeHref(locale, "/courses")} variant="secondary" size="lg">{h.secondary}</Button>
          </Reveal>
          <Reveal delay={200}>
            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-[1rem] font-semibold text-black/75">
              <li className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-lime ring-2 ring-black/10" />TDLR</li>
              <li className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-lavender" />{c.paymentPlans}</li>
              <li className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-lime ring-2 ring-black/10" />{c.hablamos}</li>
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-5 xl:col-span-6">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2" aria-label={t.home.gallery.kicker}>
            {strip.map((src, i) => (
              <Reveal as="li" key={src} delay={120 + i * 90} className={i % 2 === 1 ? "mt-8 sm:mt-10" : ""}>
                <div className={`relative overflow-hidden ${i % 2 === 0 ? "arch" : "rounded-3xl"} aspect-[4/5] bg-black/5 lg:aspect-square`}>
                  <Image src={src} alt={h.imageAlts[i]} fill priority={i < 2} className="drift object-cover" sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 20vw, 45vw" />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
