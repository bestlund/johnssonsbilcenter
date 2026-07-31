import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Finansiering — Johnsson Bilcenter i Helsingborg",
  description:
    "Vi hjälper dig hitta ett finansieringsupplägg som passar din ekonomi. I samarbete med flera finansieringspartners får du valmöjligheter: äga direkt, leasa eller betala av i egen takt.",
};

const PARTNERS = [
  {
    namn: "Santander Consumer Bank",
    text: "En av Sveriges största aktörer inom billån. Bilen fungerar som säkerhet för lånet, vilket ofta ger dig en lägre ränta och en tryggare månadskostnad.",
  },
  {
    namn: "Wasa Kredit",
    text: "Flexibel finansiering genom avbetalning eller leasing, som passar dig som vill betala av bilen i din egen takt, privat eller genom företaget.",
  },
  {
    namn: "MyMoney",
    text: "Lån utan krav på säkerhet i bilen. Snabb ansökan och besked direkt hos oss.",
  },
];

export default function Finansiering() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell py-16 lg:py-24">
          <div className="max-w-2xl">
            <h1>Finansiering hos Johnsson Bilcenter AB</h1>
            <p className="body-lg mt-6 text-mist">
              Vi hjälper dig hitta ett finansieringsupplägg som passar din
              ekonomi. Oavsett om du vill äga bilen direkt, leasa den eller
              betala av den i din egen takt, samarbetar vi med flera
              finansieringspartners så att du har valmöjligheter.
            </p>
          </div>

          {/* Partners */}
          <h2 className="mt-14">Våra finansieringspartners</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PARTNERS.map((p) => (
              <article key={p.namn} className="card p-6">
                <h3 className="text-lg font-semibold">{p.namn}</h3>
                <p className="small mt-2 text-mist">{p.text}</p>
              </article>
            ))}
          </div>

          {/* Försäkring */}
          <div className="mt-14 max-w-2xl">
            <h2>Testa försäkringen kostnadsfritt i 14 dagar</h2>
            <p className="mt-4 text-mist">
              Vi samarbetar med ICA Försäkringar. Tecknar du bilförsäkring hos
              oss i samband med köpet ingår 14 dagars kostnadsfri helförsäkring,
              så att du känner dig trygg redan från första dagen bakom ratten.
            </p>
          </div>

          <Link href="/kontakt" className="btn btn-primary mt-10">
            Kontakta oss
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
