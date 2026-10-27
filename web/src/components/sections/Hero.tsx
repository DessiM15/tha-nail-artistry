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
      <Container className="relative flex min-h-[calc(100svh-var(--header-h)-2.5rem)] flex-col items-center justify-center py-10 text-center lg:py-12">
        <Reveal>
          <p className="inline-flex items-center gap-2.5 rounded-full bg-black px-5 py-2.5 text-[0.95rem] font-semibold tracking-[0.03em] text-white">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-lime" />
            {c.nowEnrolling} · {formatDate(enrollment.nextClassStart, locale, { month: "short", day: "numeric" })}
          </p>
        </Reveal>
        <p className="t-eyebrow mt-6 text-black/70">{h.kicker}</p>
        <h1 id="hero-heading" className="t-display mx-auto mt-4 max-w-5xl">
          {h.h1}{" "}
          <span className="t-italic text-black/80">{h.h1Accent}</span>
        </h1>
        <p className="t-lede mx-auto mt-5 max-w-2xl text-black/70">{h.lede}</p>
        <Reveal delay={120} className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href={wixLinks.apply} size="lg" external title={c.opensWix}>{h.primary}</Button>
          <Button href={localeHref(locale, "/courses")} variant="secondary" size="lg">{h.secondary}</Button>
        </Reveal>
        <Reveal delay={200}>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[0.95rem] font-semibold text-black/75">
            <li className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-lime ring-2 ring-black/10" />TDLR</li>
            <li className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-lavender" />{c.paymentPlans}</li>
            <li className="inline-flex items-center gap-2.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-lime ring-2 ring-black/10" />{c.hablamos}</li>
          </ul>
        </Reveal>
        <ul className="mt-10 grid w-full max-w-4xl grid-cols-4 gap-3 sm:gap-4" aria-label={t.home.gallery.kicker}>
          {strip.map((src, i) => (
            <Reveal as="li" key={src} delay={160 + i * 80} className={i % 2 === 1 ? "mt-4 sm:mt-6" : ""}>
              <div className={`relative overflow-hidden ${i % 2 === 0 ? "arch" : "rounded-2xl sm:rounded-3xl"} aspect-[4/5] bg-black/5`}>
                <Image src={src} alt={h.imageAlts[i]} fill priority={i < 2} className="drift object-cover" sizes="(min-width: 1024px) 220px, 22vw" />
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
