import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Sälj din bil — Johnsson Bilcenter",
};

/**
 * Placeholder-sida för sälj-flödet. Hero-flikens reg.nr-fält skickar hit
 * (?reg=…). Det riktiga värderingsflödet byggs senare — den här sidan
 * kvitterar bara reg.nr så länken inte 404:ar.
 */
export default async function SaljDinBil({
  searchParams,
}: {
  searchParams: Promise<{ reg?: string }>;
}) {
  const reg = (await searchParams).reg?.trim();

  return (
    <>
      <SiteHeader />
      <main className="shell flex-1 py-20 lg:py-28">
        <h1 className="max-w-2xl">Sälj din bil till Johnsson Bilcenter</h1>
        <p className="body-lg mt-5 max-w-xl text-mist">
          Vi köper och förmedlar begagnade bilar — rättvist bud, kostnadsfri
          värdering.
        </p>

        {reg ? (
          <p className="mt-8 inline-flex items-center gap-3 rounded-md border border-line-strong bg-card px-4 py-3">
            <span className="text-mist">Registreringsnummer:</span>
            <span className="data font-semibold text-linen">{reg}</span>
          </p>
        ) : null}

        <p className="mt-6 max-w-xl text-mist">
          Vårt digitala värderingsflöde byggs just nu. Under tiden — hör av dig så
          återkommer vi snabbt med en värdering
          {reg ? ` för ${reg}` : ""}.
        </p>

        <Link href="/" className="btn btn-secondary mt-8">
          Till startsidan
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
