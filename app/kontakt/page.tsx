import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import Oppettider from "@/app/components/Oppettider";
import Kontaktformular from "@/app/components/Kontaktformular";

export const metadata = {
  title: "Kontakta oss — Johnsson Bilcenter i Helsingborg",
  description:
    "Kontakta oss vid frågor angående din nya bil, våra begagnade bilar, tidsbokning eller annat. Ring oss på 073-302 90 19 eller besök oss på Florettgatan 8 i Helsingborg.",
};

export default function Kontakt() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Kontakt-hero — shell-bredd (som headern), ingen bakgrundsbild.
            Top-padding pt-16 lg:pt-24 = standard nav-gap (samma som Hero A/övriga). */}
        <section className="shell pt-16 lg:pt-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Vänster: rubrik + text */}
            <div>
              <h1 className="text-[clamp(2rem,4vw,3rem)]">
                Hör av dig på det sätt som passar dig bäst
              </h1>
              <p className="body-lg mt-5 max-w-md text-mist">
                Telefon, mejl eller på plats. Välj det som funkar för dig. De
                flesta frågor besvaras samma dag, ofta inom en timme.
              </p>
            </div>

            {/* Höger: kontaktkort — samma bredd som hero-widgeten i variant A
                (593.516px), högerställt i sin kolumn. */}
            <div className="card w-full p-6 lg:w-[593.516px] lg:justify-self-end">
              <a
                href="tel:+46733029019"
                className="data block text-xl font-semibold text-linen transition-colors hover:text-cobalt-400"
              >
                073-302 90 19
              </a>
              <p className="small mt-1 text-mist">
                Mån–fre 10:00–18:00 · Lör 11:00–15:00
              </p>

              <div className="my-5 border-t border-line" />

              <a
                href="mailto:Johnssonsbilcenter@gmail.com"
                className="block break-words text-xl font-semibold text-linen transition-colors hover:text-cobalt-400"
              >
                Johnssonsbilcenter@gmail.com
              </a>
              <p className="small mt-1 text-mist">
                Svar inom 24 timmar på vardagar
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href="#kontaktformular" className="btn btn-secondary">
                  Skicka ett meddelande
                </a>
                <a href="tel:+46733029019" className="btn btn-primary">
                  Ring oss
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Öppettider + karta (utan "Besök oss"-rubrik på kontaktsidan) */}
        <Oppettider visaRubrik={false} />

        {/* Kontaktformulär (ankarmål för "Skicka ett meddelande") */}
        <div id="kontaktformular" className="scroll-mt-24">
          <Kontaktformular />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
