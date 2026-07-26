import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import NextleaseWidget from "@/app/components/NextleaseWidget";
import { DEALER_UID } from "@/lib/nextlease";

export const metadata: Metadata = {
  title: "Våra objekt — Johnsson Bilcenter",
  description:
    "Hitta din nästa bil hos Johnsson Bilcenter i Helsingborg. Bläddra bland alla våra objekt.",
};

export default function BilarPage() {
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
