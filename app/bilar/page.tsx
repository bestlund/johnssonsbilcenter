import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import BilarBrowse from "./BilarBrowse";
import { hamtaAllaFordon } from "@/lib/nextlease";
import {
  filterFranParams,
  arSortering,
  type Sortering,
} from "@/lib/bilfilter";

export const metadata: Metadata = {
  title: "Våra bilar — Johnsson Bilcenter",
  description:
    "Bläddra bland alla bilar i lager hos Johnsson Bilcenter i Helsingborg. Filtrera på biltyp, drivmedel och växellåda.",
};

/**
 * Vår egen browse-sida. Servern hämtar hela lagret och förfiltrerar via
 * URL-query (t.ex. /bilar?drivmedel=Diesel från heron). Detaljvy + köp sker på
 * /objekt (Nextlease-widgeten), dit korten länkar.
 */
export default async function BilarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { fordon, totalt } = await hamtaAllaFordon();
  const sp = await searchParams;
  const start = filterFranParams(sp);
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const startSort: Sortering =
    sortParam && arSortering(sortParam) ? sortParam : "rekommenderad";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell pt-16 pb-10 lg:pt-24 lg:pb-14">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h1>Våra bilar</h1>
            <p className="text-mist">{totalt} bilar i lager</p>
          </div>
          <BilarBrowse bilar={fordon} start={start} startSort={startSort} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
