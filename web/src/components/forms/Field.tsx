import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes } from "react";

const base =
  "w-full rounded-2xl border border-black/15 bg-white px-4 py-3.5 text-[0.95rem] text-black placeholder:text-black/40 transition-colors focus:border-black focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-lavender";

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-[0.85rem] font-semibold text-black">{children}</span>
      {hint && <span className="mt-1 block text-[0.8rem] text-black/60">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} mt-2 ${props.className ?? ""}`} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className="relative mt-2">
      <select {...props} className={`${base} appearance-none pr-11 ${props.className ?? ""}`}>
        {children}
      </select>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/60">
        <path d="M3 6l5 5 5-5" />
      </svg>
    </div>
  );
}

/** Invisible honeypot. Bots fill it, people never see it, Web3Forms drops the submission. */
export function Honeypot() {
  return <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />;
}

export function SubmitButton({ children, busy }: { children: ReactNode; busy: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender px-6 py-3.5 text-[0.95rem] font-semibold text-black transition-[background-color,transform] duration-300 ease-out-expo hover:bg-lime active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
    >
      {children}
    </button>
  );
}
