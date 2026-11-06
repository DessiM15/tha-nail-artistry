import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import type { Program, SiteContent } from "@/content/types";
import { tuition, tuitionRange } from "@/config/tuition";
import { fill, usd } from "@/lib/format";

type Labels = SiteContent["pages"]["tuition"]["pricing"];

const cols = "sm:grid-cols-[1.3fr_repeat(4,1fr)]";

/** One installment cell. The label only shows on phones, where the header row is hidden. */
function Installment({ label, amount, count, l }: { label: string; amount: number; count: number; l: Labels }) {
  return (
    <div role="cell">
      <span className="t-eyebrow block text-black/55 sm:hidden">{label}</span>
      <span className="mt-1 block text-[1.05rem] font-semibold sm:mt-0">{usd(amount)}</span>
      <span className="block text-[0.8rem] text-black/60">{fill(l.payments, { n: count })}</span>
    </div>
  );
}

/* ---------- Tuition by program: range, pay in full and every payment plan ---------- */
export function TuitionTable({ programs, l }: { programs: Program[]; l: Labels }) {
  return (
    <ul className="grid gap-5">
      {programs.map((p, i) => {
        const t = tuition[p.slug];
        const { min, max } = tuitionRange(p.slug);
        return (
          <Reveal as="li" key={p.slug} delay={i * 80} className="grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-lavender sm:p-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Eyebrow>{p.shortName}</Eyebrow>
              <h3 className="t-h2 mt-4">{fill(l.range, { min: usd(min), max: usd(max) })}</h3>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[0.8rem] font-semibold text-white">
                <span aria-hidden="true" className="size-2 rounded-full bg-lime" />
                {l.plansAvailable}
              </p>
            </div>

            <div role="table" aria-label={p.name} className="lg:col-span-8">
              <div role="row" className={`hidden gap-4 border-b border-black/15 pb-3 sm:grid ${cols}`}>
                {[l.plan, l.total, l.monthly, l.biweekly, l.weekly].map((h) => (
                  <span role="columnheader" key={h} className="t-eyebrow text-black/55">{h}</span>
                ))}
              </div>

              <div role="row" className={`grid grid-cols-3 gap-x-4 gap-y-1 border-b border-black/10 py-4 sm:items-baseline ${cols}`}>
                <span role="rowheader" className="col-span-2 font-semibold sm:col-span-1">{l.payInFull}</span>
                <span role="cell" className="text-right text-[1.05rem] font-semibold sm:text-left">{usd(t.payInFull)}</span>
                <span role="cell" className="col-span-3 text-[0.85rem] text-black/60">{l.payInFullNote}</span>
              </div>

              {t.plans.map((plan) => (
                <div role="row" key={plan.months} className={`grid grid-cols-3 gap-x-4 gap-y-3 border-b border-black/10 py-4 last:border-b-0 last:pb-0 sm:items-baseline ${cols}`}>
                  <span role="rowheader" className="col-span-2 font-semibold sm:col-span-1">{fill(l.monthPlan, { n: plan.months })}</span>
                  <span role="cell" className="text-right text-[1.05rem] font-semibold sm:text-left">{usd(plan.total)}</span>
                  <Installment label={l.monthly} amount={plan.monthly} count={plan.months} l={l} />
                  <Installment label={l.biweekly} amount={plan.biweekly} count={plan.months * 2} l={l} />
                  <Installment label={l.weekly} amount={plan.weekly} count={plan.months * 4} l={l} />
                </div>
              ))}
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
