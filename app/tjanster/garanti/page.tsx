import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Garanti — Johnsson Bilcenter i Helsingborg",
  description:
    "Teckna garantier som sträcker sig från 6 till 24 månader beroende på bilens miltal och årsmodell. Välj den täckning som passar dina behov.",
};

export default function Garanti() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell py-16 lg:py-24">
          <div className="max-w-2xl">
          <h1>Trygghet som håller i sig</h1>

          <div className="mt-8 space-y-5 text-mist">
            <p className="body-lg">
              En bra bilaffär ska kännas lika bra ett år senare som den gjorde
              dagen du hämtade bilen. Därför kan du teckna garanti på varje
              fordon vi säljer, mellan 6 och 24 månader beroende på bilens miltal
              och årsmodell.
            </p>
            <p>
              Du väljer den täckning som passar din bil och din vardag, så en
              oväntad reparation aldrig behöver bli en oväntad kostnad.
            </p>
          </div>

          <Link href="/kontakt" className="btn btn-primary mt-8">
            Kontakta oss
          </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
