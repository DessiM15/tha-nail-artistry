"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => { const mq = window.matchMedia(reducedQuery); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb); };
const getReduced = () => window.matchMedia(reducedQuery).matches;
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";
import { enrollment } from "@/config/site";
import { fill, formatDate } from "@/lib/format";
import { wixLinks } from "@/lib/wix";
import { localeHref, type Locale } from "@/i18n/config";
import type { SiteContent } from "@/content/types";
import { allSets, workImages } from "@/content/work";

const INTERVAL = 5000;

/** Option C: full-bleed slideshow of student work, crossfading, with centered copy. Pauses on hover, focus and reduced motion. */
export function HeroSlideshow({ locale, t }: { locale: Locale; t: SiteContent }) {
  const h = t.home.hero;
  const c = t.common;
  const slides = allSets.map((i) => ({ src: workImages[i].src, alt: h.imageAlts[i] }));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, reduced, slides.length]);

  return (
    <section
      className="on-dark relative isolate flex min-h-[calc(100svh-var(--header-h)-2.5rem)] items-center overflow-hidden bg-black text-white"
      aria-labelledby="hero-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0" aria-live="off">
        {slides.map((s, i) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out-expo ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
            <Image src={s.src} alt={s.alt} fill priority={i === 0} className={i === index && !reduced ? "drift object-cover" : "object-cover"} sizes="100vw" />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),rgba(0,0,0,0.1)_60%,transparent_85%)]" />

      <Container className="relative py-16 text-center lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-[0.9rem] font-semibold tracking-[0.04em] text-black">
          <span aria-hidden="true" className="size-2 rounded-full bg-black" />
          {c.nowEnrolling} · {formatDate(enrollment.nextClassStart, locale, { month: "short", day: "numeric" })}
        </p>
        <p className="t-eyebrow mt-7 text-lavender">{h.kicker}</p>
        <h1 id="hero-heading" className="t-display mx-auto mt-4 max-w-5xl">
          {h.h1}{" "}
          <span className="t-italic text-lavender">{h.h1Accent}</span>
        </h1>
        <p className="t-lede mx-auto mt-6 max-w-2xl text-white/85">{h.lede}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={wixLinks.apply} variant="lime" size="lg" external title={c.opensWix}>{h.primary}</Button>
          <Button href={localeHref(locale, "/courses")} variant="onDarkOutline" size="lg">{h.secondary}</Button>
        </div>
        <ul className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[0.95rem] font-semibold text-white/85">
          <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />TDLR</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-lavender" />{c.paymentPlans}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />{c.hablamos}</li>
        </ul>
      </Container>

      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 px-4">
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? c.playSlideshow : c.pauseSlideshow} className="grid size-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-lavender hover:text-black">
          {paused ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>}
        </button>
        <div className="flex gap-1.5" role="group" aria-label={t.home.gallery.kicker}>
          {slides.map((s, i) => (
            <button key={s.src} type="button" onClick={() => setIndex(i)} aria-label={fill(c.slideOf, { n: i + 1 })} aria-current={i === index ? "true" : undefined} className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-lime" : "w-2 bg-white/50 hover:bg-white"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
