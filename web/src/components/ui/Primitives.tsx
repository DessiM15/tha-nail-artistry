import type { ReactNode, ElementType } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-x ${className}`}>{children}</div>;
}

type Tone = "white" | "marble" | "black" | "lavender" | "soft" | "lavenderTint" | "limeTint";
const tones: Record<Tone, string> = {
  white: "bg-white text-black",
  marble: "bg-marble text-black",
  soft: "bg-marble-soft text-black",
  black: "bg-black text-white on-dark",
  lavender: "bg-lavender text-black",
  lavenderTint: "bg-lavender/15 text-black",
  limeTint: "bg-lime/20 text-black",
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
      <span aria-hidden="true" className="inline-flex items-center gap-1"><span className="inline-block h-px w-5 bg-lavender" /><span className="inline-block size-1.5 rounded-full bg-lime" /></span>
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

/**
 * Organic lavender and lime shapes echoing the academy's lobby wall. Decorative, sits behind content.
 * variant "hero": large shapes on both sides. "band": one lime shape top-right, one lavender bottom-left. "corner": single lavender shape.
 */
export function BrandBlobs({ variant = "hero", className = "", opacity = 0.55 }: { variant?: "hero" | "band" | "corner"; className?: string; opacity?: number }) {
  const lav = "#b0a1ea", lime = "#c7f37d";
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ opacity }}>
      {variant === "hero" && (
        <>
          <svg className="blob -left-[16%] -top-[22%] w-[38%] min-w-[18rem]" viewBox="0 0 400 400"><path fill={lav} d="M58 142c20-62 96-96 158-78 50 15 60 72 108 98 48 25 54 92 12 126-44 36-124 20-176 46-56 28-124 6-142-50-16-52 24-90 40-142Z" /></svg>
          <svg className="blob -right-[12%] -bottom-[24%] w-[36%] min-w-[17rem]" viewBox="0 0 400 400"><path fill={lime} d="M120 60c62-32 142-10 170 48 24 50-4 96 20 146 22 46-12 102-66 108-58 6-96-40-150-56C40 290 6 236 20 184c12-46 50-96 100-124Z" /></svg>
        </>
      )}
      {variant === "band" && (
        <>
          <svg className="blob -right-[8%] -top-[30%] w-[34%] min-w-[16rem]" viewBox="0 0 400 400"><path fill={lime} d="M120 60c62-32 142-10 170 48 24 50-4 96 20 146 22 46-12 102-66 108-58 6-96-40-150-56C40 290 6 236 20 184c12-46 50-96 100-124Z" /></svg>
          <svg className="blob -left-[8%] -bottom-[40%] w-[30%] min-w-[14rem]" viewBox="0 0 400 400"><path fill={lav} d="M58 142c20-62 96-96 158-78 50 15 60 72 108 98 48 25 54 92 12 126-44 36-124 20-176 46-56 28-124 6-142-50-16-52 24-90 40-142Z" /></svg>
        </>
      )}
      {variant === "corner" && (
        <svg className="blob -right-[6%] -top-[20%] w-[28%] min-w-[12rem]" viewBox="0 0 400 400"><path fill={lav} d="M58 142c20-62 96-96 158-78 50 15 60 72 108 98 48 25 54 92 12 126-44 36-124 20-176 46-56 28-124 6-142-50-16-52 24-90 40-142Z" /></svg>
      )}
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
