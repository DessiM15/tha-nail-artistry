"use client";

import { useRef, type ReactNode } from "react";
import { ArrowRight } from "./Icons";

/**
 * One-row horizontal scroller with snap points and arrow buttons.
 * Keeps tall sections inside one viewport. Works with touch, trackpad, keyboard and the arrows.
 */
export function Strip({ children, ariaLabel, prevLabel, nextLabel, className = "" }: { children: ReactNode; ariaLabel: string; prevLabel: string; nextLabel: string; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <div className={`relative ${className}`}>
      <ul ref={ref} className="strip -mx-[var(--gutter)] px-[var(--gutter)]" aria-label={ariaLabel} tabIndex={0}>
        {children}
      </ul>
      <div className="mt-5 flex items-center justify-end gap-2">
        <button type="button" onClick={() => scroll(-1)} aria-label={prevLabel} className="grid size-11 place-items-center rounded-full bg-lavender text-black transition-colors hover:bg-lime">
          <ArrowRight className="rotate-180" />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={nextLabel} className="grid size-11 place-items-center rounded-full bg-lavender text-black transition-colors hover:bg-lime">
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
