import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "./Icons";

type Variant = "primary" | "secondary" | "lime" | "onDark" | "onDarkOutline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

interface Props {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  icon?: boolean;
  ariaLabel?: string;
  title?: string;
}

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-black/85",
  secondary: "bg-white text-black ring-1 ring-black/15 hover:ring-black/40",
  lime: "bg-lime text-black hover:bg-lime/85",
  onDark: "bg-white text-black hover:bg-lavender",
  onDarkOutline: "bg-transparent text-white ring-1 ring-white/35 hover:ring-lavender hover:text-lavender",
  ghost: "bg-transparent text-black hover:bg-black/5",
  link: "bg-transparent text-black underline underline-offset-[0.25em] decoration-1 hover:decoration-lavender px-0",
};
const sizes: Record<Size, string> = {
  sm: "text-[0.8rem] px-4 py-2.5 gap-1.5",
  md: "text-[0.9rem] px-5 py-3 gap-2",
  lg: "text-[0.95rem] px-6 py-3.5 gap-2",
};

export function Button({ href, children, variant = "primary", size = "md", external, className = "", icon = true, ariaLabel, title }: Props) {
  const cls = `inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold tracking-[0.01em] transition-[background-color,color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.98] ${variants[variant]} ${variant === "link" ? "" : sizes[size]} ${className}`;
  const Icon = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      <span>{children}</span>
      {icon && <Icon width={16} height={16} className="shrink-0" />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} title={title}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel} title={title}>
      {inner}
    </Link>
  );
}
