import Link from "next/link";
import { enrollment } from "@/config/site";
import { formatDate } from "@/lib/format";
import { localeHref, type Locale } from "@/i18n/config";
import type { SiteContent } from "@/content/types";
import { ArrowRight } from "@/components/ui/Icons";

export function AnnouncementBar({ locale, common }: { locale: Locale; common: SiteContent["common"] }) {
  const start = formatDate(enrollment.nextClassStart, locale);
  const deadline = formatDate(enrollment.enrollmentDeadline, locale);
  return (
    <div className="on-dark bg-black text-white" role="region" aria-label={common.nowEnrolling}>
      <div className="container-x flex min-h-10 flex-wrap items-center justify-center gap-x-5 gap-y-1 py-2 text-center text-[0.8rem] sm:text-[0.85rem]">
        <span className="inline-flex items-center gap-2 font-semibold">
          <span aria-hidden="true" className="size-2 rounded-full bg-lime" />
          {common.nowEnrolling}
        </span>
        <span className="text-white/85">
          {common.nextClassBegins} <strong className="font-semibold text-white">{start}</strong>
        </span>
        <span className="hidden text-white/70 md:inline">
          {common.enrollmentDeadline}: {deadline}
        </span>
        <Link href={localeHref(locale, "/apply")} className="inline-flex items-center gap-1 font-semibold text-lavender underline-offset-4 hover:underline">
          {common.applyNow}
          <ArrowRight width={14} height={14} />
        </Link>
      </div>
    </div>
  );
}
