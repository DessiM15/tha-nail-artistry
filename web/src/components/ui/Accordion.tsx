import { Plus } from "./Icons";

/** Native <details> accordion: keyboard accessible, screen-reader friendly, no JS required. */
export function Accordion({ items, name }: { items: { q: string; a: string }[]; name?: string }) {
  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {items.map((item, i) => (
        <details key={i} className="faq group" name={name}>
          <summary className="flex w-full items-start justify-between gap-6 py-5 text-left sm:py-6">
            <span className="t-h4 pr-2">{item.q}</span>
            <span className="faq-icon mt-1 grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-black/15 group-open:bg-black group-open:text-white group-open:ring-black">
              <Plus width={16} height={16} />
            </span>
          </summary>
          <div className="t-body max-w-3xl pb-6 text-black/75">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
