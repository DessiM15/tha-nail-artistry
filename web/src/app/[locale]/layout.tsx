import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { SITE_URL, business } from "@/config/site";
import { getContent } from "@/content";
import { htmlLang, isLocale, locales } from "@/i18n/config";
import { wixLinks } from "@/lib/wix";
import { JsonLd, organizationJsonLd } from "@/lib/jsonld";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { template: t.meta.titleTemplate, default: t.meta.defaultTitle },
    description: t.meta.defaultDescription,
    applicationName: t.meta.siteName,
    keywords: locale === "es"
      ? ["escuela de uñas Houston", "manicurista Houston", "licencia de manicurista Texas", "curso de uñas Houston", "TDLR"]
      : ["nail school Houston", "nail tech school Houston", "manicurist program Houston", "Texas nail license", "TDLR nail school", "nail technician course Houston"],
    formatDetection: { telephone: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getContent(locale);

  return (
    <html lang={htmlLang[locale]} className={`${instrument.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">{t.common.skipToContent}</a>
        <ScrollToTop />
        <AnnouncementBar locale={locale} common={t.common} />
        <Header locale={locale} nav={t.nav} common={t.common} phoneDisplay={business.phoneDisplay} phoneHref={business.phoneHref} applyHref={wixLinks.apply} loginHref={wixLinks.login} />
        <main id="main" className="flex-1" tabIndex={-1}>{children}</main>
        <Footer locale={locale} t={t} />
        <MobileCallBar common={t.common} applyHref={wixLinks.apply} />
        <JsonLd data={organizationJsonLd(locale)} />
      </body>
    </html>
  );
}
