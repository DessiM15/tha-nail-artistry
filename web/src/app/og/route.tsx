import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NextRequest } from "next/server";


const serif = readFile(join(process.cwd(), "src/assets/fonts/InstrumentSerif-Regular.ttf"));
const sans = readFile(join(process.cwd(), "src/assets/fonts/Manrope-Medium.ttf"));
const logo = readFile(join(process.cwd(), "public/images/logo-white-trim.png"));

/** Branded Open Graph card: black field, white serif title, lavender kicker, one lime accent. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const title = (sp.get("title") ?? "Nail School in Houston, TX").slice(0, 120);
  const locale = sp.get("locale") === "es" ? "es" : "en";
  const kicker = (sp.get("kicker") ?? (locale === "es" ? "Escuela de Uñas en Houston · Hablamos Español" : "Nail School in Houston · Hablamos Español")).slice(0, 80);
  const [serifData, sansData, logoData] = await Promise.all([serif, sans, logo]);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;
  const size = title.length > 70 ? 56 : title.length > 40 ? 68 : 84;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000000", color: "#ffffff", padding: 72, fontFamily: "Manrope" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={380} height={87} style={{ objectFit: "contain" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#b0a1ea" }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#c7f37d" }} />
            Houston, TX
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#b0a1ea" }}>{kicker}</div>
          <div style={{ fontFamily: "Instrument Serif", fontSize: size, lineHeight: 1.02, letterSpacing: -1, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "rgba(255,255,255,0.7)" }}>
          <div>thanailartistry.com</div>
          <div>(346) 724-7565</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Instrument Serif", data: serifData, style: "normal", weight: 400 },
        { name: "Manrope", data: sansData, style: "normal", weight: 500 },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" },
    },
  );
}
