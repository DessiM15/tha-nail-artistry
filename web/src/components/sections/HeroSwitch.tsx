"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Review-only toggle between the hero concepts. ?hero=montage or ?hero=slideshow shows the alternatives.
 * Remove this component (and render one hero directly) once a direction is chosen.
 */
export function HeroSwitch({ marble, montage, slideshow, labels, basePath }: { marble: ReactNode; montage: ReactNode; slideshow: ReactNode; labels: { title: string; marble: string; montage: string; slideshow: string }; basePath: string }) {
  const params = useSearchParams();
  const mode = params.get("hero");
  const pill = (active: boolean) => `rounded-full px-3 py-1.5 text-[0.78rem] font-semibold transition-colors ${active ? "bg-lime text-black" : "text-white/80 hover:text-white"}`;
  const options: { key: string | null; label: string; node: ReactNode }[] = [
    { key: null, label: labels.marble, node: marble },
    { key: "montage", label: labels.montage, node: montage },
    { key: "slideshow", label: labels.slideshow, node: slideshow },
  ];
  const current = options.find((o) => o.key === mode) ?? options[0];
  return (
    <>
      {current.node}
      <div className="fixed bottom-[5.25rem] right-3 z-40 flex items-center gap-1 rounded-full bg-black/90 p-1 pl-3 text-white shadow-lg ring-1 ring-white/15 backdrop-blur md:bottom-5 md:left-4 md:right-auto" role="group" aria-label={labels.title}>
        <span className="mr-1 hidden text-[0.72rem] uppercase tracking-[0.12em] text-white/60 sm:inline">{labels.title}</span>
        {options.map((o) => (
          <Link key={o.label} href={o.key ? `${basePath}?hero=${o.key}` : basePath} scroll={false} className={pill(current.key === o.key)} aria-current={current.key === o.key ? "true" : undefined}>{o.label}</Link>
        ))}
      </div>
    </>
  );
}
