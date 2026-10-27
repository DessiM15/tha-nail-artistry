import type { ReactNode, ElementType } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-x ${className}`}>{children}</div>;
}

type Tone = "white" | "marble" | "black" | "lavender" | "soft";
const tones: Record<Tone, string> = {
  white: "bg-white text-black",
  marble: "bg-marble text-black",
  soft: "bg-marble-soft text-black",
  black: "bg-black text-white on-dark",
  lavender: "bg-lavender text-black",
};

export function Section({ children, tone = "white", className = "", id, size = "md", as: Tag = "section", labelledBy }: { children: ReactNode; tone?: Tone; className?: string; id?: string; size?: "md" | "sm"; as?: ElementType; labelledBy?: string }) {
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={`relative ${size === "sm" ? "section-sm" : "section"} ${tones[tone]} ${className}`}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, tone = "dark", className = "" }: { children: ReactNode; tone?: "dark" | "light" | "lavender"; className?: string }) {
  const c = tone === "light" ? "text-white/80" : tone === "lavender" ? "text-lavender" : "text-black/60";
  return (
    <p className={`t-eyebrow flex items-center gap-3 ${c} ${className}`}>
      <span aria-hidden="true" className={`inline-block h-px w-6 ${tone === "light" ? "bg-lavender" : tone === "lavender" ? "bg-lavender" : "bg-lavender"}`} />
      {children}
    </p>
  );
}

/** Thin lavender botanical sprig used as a section divider. Decorative only. */
export function LeafDivider({ className = "", tone = "lavender" }: { className?: string; tone?: "lavender" | "white" | "black" }) {
  const stroke = tone === "white" ? "#ffffff" : tone === "black" ? "#000000" : "#b0a1ea";
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 sm:w-28" style={{ background: `linear-gradient(90deg, transparent, ${stroke})` }} />
      <svg width="64" height="40" viewBox="0 0 64 40" fill="none" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 34C18 30 30 22 60 6" />
        <path d="M22 26c-2-7 1-12 7-14-1 7-4 11-7 14Z" />
        <path d="M34 19c-1-7 2-12 8-13-1 6-4 10-8 13Z" />
        <path d="M46 12c0-6 3-9 9-9-1 5-4 7-9 9Z" />
        <path d="M14 30c-5 1-9-1-11-5 5-1 9 1 11 5Z" />
        <path d="M27 24c-5 2-9 0-12-4 5-1 9 1 12 4Z" />
      </svg>
      <span className="h-px w-16 sm:w-28" style={{ background: `linear-gradient(90deg, ${stroke}, transparent)` }} />
    </div>
  );
}

export function Stars({ n = 5, className = "" }: { n?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5Z" /></svg>
      ))}
    </span>
  );
}
