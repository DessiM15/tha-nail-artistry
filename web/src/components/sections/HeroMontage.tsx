import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { enrollment } from "@/config/site";
import { formatDate } from "@/lib/format";
import { wixLinks } from "@/lib/wix";
import { localeHref, type Locale } from "@/i18n/config";
import type { SiteContent } from "@/content/types";
import { allSets, workImages } from "@/content/work";

/** Option B: full-bleed montage of student work with centered copy over a dark wash. */
export function HeroMontage({ locale, t }: { locale: Locale; t: SiteContent }) {
  const h = t.home.hero;
  const c = t.common;
  return (
    <section className="on-dark relative isolate flex min-h-[calc(100svh-var(--header-h)-2.5rem)] items-center overflow-hidden bg-black text-white" aria-labelledby="hero-heading">
      <ul className="absolute inset-0 grid grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2" aria-label={t.home.gallery.kicker}>
        {allSets.map((i) => (
          <li key={workImages[i].src} className="relative">
            <Image src={workImages[i].src} alt={h.imageAlts[i]} fill priority={i < 4} className="drift object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),rgba(0,0,0,0.15)_55%,transparent_80%)]" />
      <Container className="relative py-16 text-center lg:py-20">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-[0.9rem] font-semibold tracking-[0.04em] text-black">
            <span aria-hidden="true" className="size-2 rounded-full bg-black" />
            {c.nowEnrolling} · {formatDate(enrollment.nextClassStart, locale, { month: "short", day: "numeric" })}
          </p>
        </Reveal>
        <p className="t-eyebrow mt-7 text-lavender">{h.kicker}</p>
        <h1 id="hero-heading" className="t-display mx-auto mt-4 max-w-5xl">
          {h.h1}
          <br />
          <span className="t-italic text-lavender">{h.h1Accent}</span>
        </h1>
        <p className="t-lede mx-auto mt-6 max-w-2xl text-white/85">{h.lede}</p>
        <Reveal delay={120} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={wixLinks.apply} variant="lime" size="lg" external title={c.opensWix}>{h.primary}</Button>
          <Button href={localeHref(locale, "/courses")} variant="onDarkOutline" size="lg">{h.secondary}</Button>
        </Reveal>
        <ul className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[0.95rem] font-semibold text-white/85">
          <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />TDLR</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-lavender" />{c.paymentPlans}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />{c.hablamos}</li>
        </ul>
      </Container>
    </section>
  );
}
