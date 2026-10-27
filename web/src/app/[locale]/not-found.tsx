import Link from "next/link";
import { Container } from "@/components/ui/Primitives";

/** Rendered inside the locale layout. Copy is bilingual since the locale may be unknown here. */
export default function NotFound() {
  return (
    <section className="bg-marble">
      <Container className="section text-center">
        <p className="t-eyebrow text-black/65">404</p>
        <h1 className="t-h1 mt-4">Page not found <span className="t-italic text-black/60">· Página no encontrada</span></h1>
        <p className="t-lede mx-auto mt-5 max-w-xl text-black/70">The page you were looking for has moved or never existed. La página que buscas cambió de lugar o no existe.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-black px-6 py-3.5 font-semibold text-white">Back to homepage</Link>
          <Link href="/es" className="rounded-full px-6 py-3.5 font-semibold ring-1 ring-black/20">Volver al inicio</Link>
        </div>
      </Container>
    </section>
  );
}
