import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import NextleaseWidget from "@/app/components/NextleaseWidget";
import { DEALER_UID } from "@/lib/nextlease";

export const metadata: Metadata = {
  title: "Objekt — Johnsson Bilcenter",
  description:
    "Detaljvy och köp av Johnsson Bilcenters objekt via Nextlease. Bläddra i vårt urval på /bilar.",
};

/**
 * Hostar Nextlease-widgeten. Vår egen browse ligger på /bilar; hit länkas
 * enskilda bilars detaljvy (`/objekt#/details/{uid}`) eftersom köp-/detaljflödet
 * lever i Nextlease. Bar route (utan hash) visar Nextlease egna listning som
 * fallback.
 */
export default function ObjektPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell py-10 lg:py-14">
          <NextleaseWidget uid={DEALER_UID} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
