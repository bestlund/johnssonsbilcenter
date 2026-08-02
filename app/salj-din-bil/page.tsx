import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import SaljFormular from "@/app/components/SaljFormular";

export const metadata = {
  title: "Sälj din bil i Helsingborg — kostnadsfri värdering",
  alternates: { canonical: "/salj-din-bil" },
  description:
    "Sälj din bil till Johnsson Bilcenter i Helsingborg. Rättvist bud och kostnadsfri värdering, oftast samma dag. Fyll i registreringsnummer så återkommer vi.",
};

/**
 * Sälj din bil till oss. Hero-flikens reg.nr-fält skickar hit (?reg=&pris=&tel=)
 * och förifyller formuläret. Leads går som strukturerat mejl (M2).
 */
export default async function SaljDinBil({
  searchParams,
}: {
  searchParams: Promise<{ reg?: string; pris?: string; tel?: string }>;
}) {
  const sp = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="shell flex-1 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-2xl">
          <h1>Sälj din bil till Johnsson Bilcenter</h1>
          <p className="body-lg mt-5 text-mist">
            Vi köper och förmedlar begagnade bilar. Rättvist bud och kostnadsfri
            värdering, oftast samma dag. Vill du hellre att vi säljer bilen åt dig
            mot att du kan få mer betalt? Läs om vår{" "}
            <a href="/formedling" className="link">
              bilförmedling
            </a>
            .
          </p>

          <SaljFormular
            start={{
              regnr: sp.reg ?? "",
              pris: sp.pris ?? "",
              telefon: sp.tel ?? "",
            }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
