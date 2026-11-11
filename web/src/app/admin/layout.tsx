import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Manrope } from "next/font/google";
import "../globals.css";

const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "Referral tracker | Tha Nail Artistry Academy",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US" className={`${instrument.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-marble-soft">{children}</body>
    </html>
  );
}
