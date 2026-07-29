import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Förmedla din bil — Johnsson Bilcenter i Helsingborg",
  description:
    "Vill du sälja din bil krångelfritt och ofta få mer betalt än vid privat försäljning? Vi sköter hela förmedlingen åt dig: foto, annonsering, visningar och pappersarbete.",
};

const STEG = [
  "Vi kommer överens om ett lämpligt pris för din bil.",
  "Vi gör en kontroll av bilen så köparen slipper otrevliga överraskningar.",
  "Vi tar professionella foton och skriver en säljande annons.",
  "Bilen annonseras på de kanaler där vi bedömer att den säljer bäst.",
  "Vi visar bilen för potentiella köpare och sköter hela affären.",
  "När affären är klar betalar vi ut köpesumman till ditt konto.",
];

const FORDELAR = [
  "Vi erbjuder finansiering, vilket gör att din bil når en bredare målgrupp.",
  "Köparen kan lämna sin egen bil i inbyte oavsett märke och modell, vilket underlättar affären.",
  "Du slipper fotografera och annonsera bilen själv.",
  "Du slipper alla samtal och mejl från påflugna köpare och oseriösa uppköpare.",
];

const INGAR = [
  "Professionell fotografering",
  "Annonsering på relevanta kanaler",
  "Visningar för potentiella köpare",
  "Allt pappersarbete",
  "Hantering av prutning och leads",
];

function Punkt({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-mist">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt-400" />
      <span>{text}</span>
    </li>
  );
}

export default function Formedling() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell py-16 lg:py-24">
          <div className="max-w-2xl">
            <h1>Förmedla din bil hos oss</h1>
            <p className="body-lg mt-6 text-mist">
              Går du i tankarna att sälja din bil? Då kan vår bilförmedling vara
              något för dig. Oftast får du som säljare mer betalt än om du säljer
              bilen privat, dels för att vi når fler köpare, dels för att vi ger
              köparen en trygghet med garanti.
            </p>

            {/* Så går det till */}
            <h2 className="mt-14">Så går det till</h2>
            <ol className="mt-6 space-y-4">
              {STEG.map((steg, i) => (
                <li key={steg} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-sm font-semibold text-cobalt-400">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-mist">{steg}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-mist">Svårare än så är det inte.</p>

            {/* Pris — uppflyttat och synligt */}
            <div className="card mt-12 p-6">
              <h3 className="text-lg font-semibold">Pris</h3>
              {/* TODO (Simon): fyll i den faktiska prismodellen (t.ex. fast
                  avgift + % över viss prisnivå). Inga siffror påhittade här. */}
              <p className="mt-3 text-mist">
                Priset sätts utifrån bilens försäljningspris. Hör av dig så går vi
                igenom upplägget och vad det innebär för just din bil.
              </p>
              <p className="mt-3 text-xs text-fog">
                [Prismodell och avgifter]
              </p>
            </div>

            {/* Formulär — uppflyttat, före Fördelar */}
            <div className="card mt-6 p-6 lg:p-8">
              <h3 className="text-lg font-semibold">
                Vill du att vi förmedlar din bil?
              </h3>
              <p className="mt-2 text-mist">
                Fyll i formuläret nedan så kontaktar vi dig inom 24 timmar.
              </p>

              {/* Mockup — backend (leads till Gmail) + validering kopplas i M2 */}
              <form className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="regnr" className="field-label">
                    Registreringsnummer *
                  </label>
                  <input
                    id="regnr"
                    className="field-input data uppercase"
                    placeholder="ABC 12X"
                    maxLength={8}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="miltal" className="field-label">
                    Miltal *
                  </label>
                  <input
                    id="miltal"
                    inputMode="numeric"
                    className="field-input data"
                    placeholder="t.ex. 12 500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="telefon" className="field-label">
                    Telefon *
                  </label>
                  <input
                    id="telefon"
                    type="tel"
                    className="field-input data"
                    placeholder="073 000 00 00"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="epost" className="field-label">
                    E-post
                  </label>
                  <input
                    id="epost"
                    type="email"
                    className="field-input"
                    placeholder="Din e-post"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn btn-primary w-full">
                    Skicka →
                  </button>
                </div>
              </form>
            </div>

            {/* Fördelar */}
            <h2 className="mt-14">Fördelar med att förmedla hos oss</h2>
            <ul className="mt-6 space-y-3">
              {FORDELAR.map((f) => (
                <Punkt key={f} text={f} />
              ))}
            </ul>

            {/* Detta ingår */}
            <h2 className="mt-14">Detta ingår</h2>
            <ul className="mt-6 space-y-3">
              {INGAR.map((i) => (
                <Punkt key={i} text={i} />
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
