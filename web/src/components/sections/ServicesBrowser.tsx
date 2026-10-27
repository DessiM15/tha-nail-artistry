"use client";

import Image from "next/image";
import { useState } from "react";
import type { Service } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { fill } from "@/lib/format";

type Cat = Service["category"];
const order: Cat[] = ["manipedi", "enhancements", "repairs"];

interface Props {
  items: Service[];
  categories: Record<Cat, string>;
  allLabel: string;
  filterLabel: string;
  countLabel: string;
  bookLabel: string;
  opensWix: string;
  /** Wix base URL; the service page path is appended per item */
  wixBase: string;
}

/** Filter pills at the top; "All" keeps the grouped list, a category shows only its services. Every item is in the HTML for SEO. */
export function ServicesBrowser({ items, categories, allLabel, filterLabel, countLabel, bookLabel, opensWix, wixBase }: Props) {
  const bookHref = (slug: string) => `${wixBase}/service-page/${slug}`;
  const [active, setActive] = useState<Cat | "all">("all");
  const groups = active === "all" ? order : [active];
  const count = (c: Cat) => items.filter((s) => s.category === c).length;

  const Card = ({ s }: { s: Service }) => (
    <li className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-lavender">
      <div className="relative aspect-[5/4]">
        <Image src={s.image} alt={s.imageAlt} fill className="object-cover" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
        <span className="absolute left-4 top-4 rounded-full bg-lime px-3 py-1 text-[0.8rem] font-semibold text-black">{s.price}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="t-h4">{s.name}</h3>
        <p className="mt-0.5 text-[0.8rem] text-black/65">{s.duration}</p>
        <p className="t-body mt-2 flex-1 text-black/70">{s.description}</p>
        <div className="mt-4"><Button href={bookHref(s.slug)} size="sm" external title={opensWix}>{bookLabel}</Button></div>
      </div>
    </li>
  );

  const pill = (on: boolean) => `whitespace-nowrap rounded-full px-4 py-2.5 text-[0.9rem] font-semibold transition-colors ${on ? "bg-black text-white" : "bg-white text-black ring-1 ring-black/15 hover:bg-lavender hover:ring-lavender"}`;

  return (
    <div>
      <div className="sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] bg-white/90 px-[var(--gutter)] py-3 backdrop-blur">
        <p className="t-eyebrow mb-2 text-black/65">{filterLabel}</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label={filterLabel}>
          <button type="button" className={pill(active === "all")} aria-pressed={active === "all"} onClick={() => setActive("all")}>
            {allLabel} <span className="ml-1 text-[0.75rem] opacity-70">{items.length}</span>
          </button>
          {order.map((c) => (
            <button key={c} type="button" className={pill(active === c)} aria-pressed={active === c} onClick={() => setActive(c)}>
              {categories[c]} <span className="ml-1 text-[0.75rem] opacity-70">{count(c)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-14" aria-live="polite">
        {groups.map((c) => (
          <section key={c} aria-labelledby={`cat-${c}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`cat-${c}`} className="t-h3">{categories[c]}</h2>
              <span className="text-[0.85rem] text-black/65">{fill(countLabel, { n: count(c) })}</span>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.filter((s) => s.category === c).map((s) => <Card key={s.slug} s={s} />)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
