import { business } from "@/config/site";
import type { SiteContent } from "@/content/types";
import { Phone, Mail, ArrowUpRight } from "@/components/ui/Icons";

/** Thumb-reach actions on phones. Hidden from md up. */
export function MobileCallBar({ common, applyHref }: { common: SiteContent["common"]; applyHref: string }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur md:hidden" role="region" aria-label="Quick actions">
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <a href={business.phoneHref} className="inline-flex items-center justify-center gap-1.5 rounded-full py-3 text-[0.85rem] font-semibold ring-1 ring-black/15"><Phone width={16} height={16} />{common.callUs}</a>
        <a href={business.smsHref} className="inline-flex items-center justify-center gap-1.5 rounded-full py-3 text-[0.85rem] font-semibold ring-1 ring-black/15"><Mail width={16} height={16} />{common.textUs}</a>
        <a href={applyHref} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-lavender py-3 text-[0.85rem] font-semibold text-black">{common.applyNow}<ArrowUpRight width={14} height={14} /></a>
      </div>
    </div>
  );
}
