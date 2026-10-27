"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { localeHref, stripLocale, type Locale } from "@/i18n/config";
import type { NavGroup, SiteContent } from "@/content/types";
import { Chevron, Close, Menu, Phone, ArrowUpRight } from "@/components/ui/Icons";

interface Props {
  locale: Locale;
  nav: NavGroup[];
  common: SiteContent["common"];
  phoneDisplay: string;
  phoneHref: string;
  applyHref: string;
  loginHref: string;
}

export function Header({ locale, nav, common, phoneDisplay, phoneHref, applyHref, loginHref }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const otherLocale: Locale = locale === "en" ? "es" : "en";
  const switchHref = localeHref(otherLocale, stripLocale(pathname));
  const basePath = stripLocale(pathname);

  // Close everything on navigation (state adjusted during render, per React guidance)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(false); setOpenGroup(null); }

  // Escape closes; lock body scroll while the drawer is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setOpenGroup(null); menuBtn.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  // Click outside closes desktop dropdowns
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const onLogoClick = useCallback(() => {
    if (basePath === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [basePath]);

  const isActive = (href: string) => (href === "/" ? basePath === "/" : basePath === href || basePath.startsWith(href + "/"));

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href={localeHref(locale, "/")} onClick={onLogoClick} className="flex shrink-0 items-center rounded-sm" aria-label={`Tha Nail Artistry Academy, ${common.home}`}>
          <Image src="/images/logo-trim.png" alt="Tha Nail Artistry Academy" width={1679} height={386} priority className="h-9 w-auto sm:h-10 lg:h-11" sizes="(min-width: 1024px) 230px, 190px" />
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((group, i) =>
              group.children ? (
                <li key={group.label} className="group relative">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[0.9rem] font-semibold transition-colors hover:bg-black/5 ${group.children.some((c) => isActive(c.href)) ? "text-black" : "text-black/75"}`}
                    aria-expanded={openGroup === i}
                    aria-controls={`menu-${i}`}
                    onClick={() => setOpenGroup(openGroup === i ? null : i)}
                  >
                    {group.label}
                    <Chevron width={14} height={14} className="transition-transform group-hover:rotate-180" />
                  </button>
                  <div
                    id={`menu-${i}`}
                    className={`absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3 ${openGroup === i ? "block" : "hidden group-hover:block group-focus-within:block"}`}
                  >
                    <ul className="rounded-2xl border border-black/10 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]">
                      {group.children.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={localeHref(locale, item.href)}
                            className={`block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-black/[0.04] ${isActive(item.href) ? "bg-black/[0.04]" : ""}`}
                            aria-current={isActive(item.href) ? "page" : undefined}
                          >
                            <span className="block text-[0.9rem] font-semibold">{item.label}</span>
                            {item.description && <span className="block text-[0.78rem] text-black/65">{item.description}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={group.label}>
                  <Link
                    href={localeHref(locale, group.href!)}
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-2 text-[0.9rem] font-semibold transition-colors hover:bg-black/5 ${isActive(group.href!) ? "text-black underline decoration-lavender decoration-2 underline-offset-8" : "text-black/75"}`}
                    aria-current={isActive(group.href!) ? "page" : undefined}
                  >
                    {group.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href={switchHref} hrefLang={otherLocale} lang={otherLocale} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[0.8rem] font-semibold tracking-[0.08em] ring-1 ring-black/15 hover:ring-black/40" aria-label={`${common.switchLanguageShort}: ${common.switchLanguage}`} title={common.switchLanguage}>
            {common.switchLanguageShort}
          </Link>
          <a href={phoneHref} className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[0.85rem] font-semibold hover:bg-black/5 md:inline-flex" aria-label={`${common.callUs} ${phoneDisplay}`}>
            <Phone width={16} height={16} />
            <span className="hidden 2xl:inline">{phoneDisplay}</span>
          </a>
          <a href={loginHref} className="hidden items-center whitespace-nowrap rounded-full px-3 py-2 text-[0.85rem] font-semibold text-black/70 hover:bg-black/5 2xl:inline-flex" title={common.opensWix}>
            {common.login}
          </a>
          <a href={applyHref} className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-lavender px-4 py-2.5 text-[0.85rem] font-semibold text-black transition-colors hover:bg-lime sm:inline-flex" title={common.opensWix}>
            {common.applyNow}
            <ArrowUpRight width={14} height={14} />
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full ring-1 ring-black/15 hover:bg-black/5 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? common.closeMenu : common.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={common.openMenu}
        className={`fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-white xl:hidden ${open ? "block" : "hidden"}`}
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col py-4">
          <ul className="divide-y divide-black/10 border-b border-black/10">
            {nav.map((group) =>
              group.children ? (
                <li key={group.label}>
                  <details className="group/d">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
                      {group.label}
                      <Chevron className="transition-transform group-open/d:rotate-180" />
                    </summary>
                    <ul className="-mt-1 pb-3 pl-1">
                      {group.children.map((item) => (
                        <li key={item.href}>
                          <Link href={localeHref(locale, item.href)} className="block rounded-lg py-2.5 pl-3 text-[0.95rem] text-black/80 hover:bg-black/[0.04]" aria-current={isActive(item.href) ? "page" : undefined}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={group.label}>
                  <Link href={localeHref(locale, group.href!)} className="block py-4 text-[1.05rem] font-semibold" aria-current={isActive(group.href!) ? "page" : undefined}>
                    {group.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="mt-6 grid gap-3">
            <a href={applyHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender px-5 py-3.5 font-semibold text-black">{common.applyNow}<ArrowUpRight width={16} height={16} /></a>
            <Link href={localeHref(locale, "/book-a-tour")} className="inline-flex items-center justify-center rounded-full px-5 py-3.5 font-semibold ring-1 ring-black/20">{common.bookTour}</Link>
            <a href={loginHref} className="inline-flex items-center justify-center rounded-full px-5 py-3 text-[0.9rem] font-semibold text-black/70">{common.login}</a>
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 py-6 text-[0.85rem] text-black/60">
            <a href={phoneHref} className="inline-flex items-center gap-2 font-semibold text-black"><Phone width={16} height={16} />{phoneDisplay}</a>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-lime" />{common.hablamos}</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
