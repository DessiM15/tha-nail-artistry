import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * URL strategy
 *  - English is served at the root:      /courses   -> internally /en/courses
 *  - Spanish keeps its prefix:           /es/courses
 *  - /en/... is redirected to the root so there is exactly one URL per page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return NextResponse.next();
    }
  }

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API/OG routes and any file with an extension (images, fonts, sitemap.xml ...).
  matcher: ["/((?!_next|api|og|.*\\..*).*)"],
};
