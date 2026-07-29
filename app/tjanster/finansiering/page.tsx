import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Finansiering — Johnsson Bilcenter i Helsingborg",
  description:
    "Finansiering för alla våra fordon utan krav på kontantinsats, för belopp upp till 350 000 kronor. Vi anpassar betalningsplanen efter din månadskostnad.",
};

export default function Finansiering() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell py-16 lg:py-24">
          <div className="max-w-2xl">
          <h1>Finansiering hos Johnsson Bilcenter AB</h1>

          <div className="mt-8 space-y-5 text-mist">
            <p className="body-lg">
              Vi erbjuder finansiering för alla våra fordon utan krav på
              kontantinsats, för belopp upp till 350 000 kronor.
            </p>
            <p>
              Vi förstår vikten av att hitta en betalningsplan som passar just
              din ekonomi, och därför anpassar vi oss efter din månadskostnad.
            </p>
            <p>
              För att göra bilköpet ännu mer bekymmersfritt erbjuder vi även en
              kostnadsfri prova-på-helförsäkring i samband med ditt köp. Vi
              strävar efter att göra bilägandet så enkelt och ekonomiskt
              fördelaktigt som möjligt för dig.
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
