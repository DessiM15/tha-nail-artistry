"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Review-only toggle between the two hero concepts. Add ?hero=montage to the URL to see option B.
 * Remove this component (and render one hero directly) once a direction is chosen.
 */
export function HeroSwitch({ marble, montage, labels, basePath }: { marble: ReactNode; montage: ReactNode; labels: { title: string; marble: string; montage: string }; basePath: string }) {
  const params = useSearchParams();
  const isMontage = params.get("hero") === "montage";
  const pill = (active: boolean) => `rounded-full px-3 py-1.5 text-[0.78rem] font-semibold transition-colors ${active ? "bg-lime text-black" : "text-white/80 hover:text-white"}`;
  return (
    <>
      {isMontage ? montage : marble}
      <div className="fixed bottom-[5.25rem] right-3 z-40 flex items-center gap-1 rounded-full bg-black/90 p-1 pl-3 text-white shadow-lg ring-1 ring-white/15 backdrop-blur md:bottom-5 md:left-4 md:right-auto" role="group" aria-label={labels.title}>
        <span className="mr-1 text-[0.72rem] uppercase tracking-[0.12em] text-white/60">{labels.title}</span>
        <Link href={basePath} scroll={false} className={pill(!isMontage)} aria-current={!isMontage ? "true" : undefined}>{labels.marble}</Link>
        <Link href={`${basePath}?hero=montage`} scroll={false} className={pill(isMontage)} aria-current={isMontage ? "true" : undefined}>{labels.montage}</Link>
      </div>
    </>
  );
}
