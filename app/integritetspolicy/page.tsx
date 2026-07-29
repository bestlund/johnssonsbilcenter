import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Integritetspolicy — Johnsson Bilcenter",
  description:
    "Så behandlar Johnsson Bilcenter AB dina personuppgifter när du kontaktar oss eller använder våra formulär.",
};

/**
 * Integritetspolicy (GDPR). UTKAST — strukturen är på plats med kända uppgifter;
 * platshållare inom [hakparenteser] behöver fyllas i / granskas (org.nr,
 * kontaktmejl, ev. jurist). Behövs eftersom formulären samlar personuppgifter.
 */
export default function Integritetspolicy() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell py-16 lg:py-24">
          <div className="max-w-2xl">
          <h1>Integritetspolicy</h1>
          <p className="mt-4 text-sm text-fog">
            Senast uppdaterad: [datum]
          </p>

          <div className="prose-sektioner mt-10 space-y-8 text-mist">
            <div>
              <h2 className="text-linen">Personuppgiftsansvarig</h2>
              <p className="mt-3">
                Johnsson Bilcenter AB, org.nr [org.nr], Florettgatan 8, 254 67
                Helsingborg, ansvarar för behandlingen av dina personuppgifter.
                Vid frågor om denna policy når du oss på{" "}
                <a href="tel:+46733029019" className="link data">
                  073-302 90 19
                </a>{" "}
                eller [kontaktmejl].
              </p>
            </div>

            <div>
              <h2 className="text-linen">Vilka uppgifter vi samlar in</h2>
              <p className="mt-3">
                När du fyller i ett formulär på webbplatsen (kontakt, sälj din
                bil eller förmedling) samlar vi in de uppgifter du lämnar, till
                exempel namn, telefonnummer, e-postadress samt information om din
                bil (registreringsnummer, mätarställning och önskat pris).
              </p>
            </div>

            <div>
              <h2 className="text-linen">Varför vi behandlar dem</h2>
              <p className="mt-3">
                Vi behandlar uppgifterna för att kunna svara på din förfrågan,
                lämna en värdering och genomföra en eventuell affär. Den rättsliga
                grunden är ditt samtycke samt vårt berättigade intresse av att
                besvara och hantera din förfrågan.
              </p>
            </div>

            <div>
              <h2 className="text-linen">Hur länge vi sparar dem</h2>
              <p className="mt-3">
                Vi sparar dina uppgifter så länge det behövs för att hantera din
                förfrågan eller affär, och därefter enligt gällande lagkrav
                (t.ex. bokförings­lagen). [Se över konkreta lagringstider.]
              </p>
            </div>

            <div>
              <h2 className="text-linen">Vem vi delar dem med</h2>
              <p className="mt-3">
                Vi delar inte dina uppgifter med någon utomstående för
                marknadsföring. Uppgifter kan behandlas av våra leverantörer av
                t.ex. e-post och webbhotell, i egenskap av
                personuppgiftsbiträden. [Lista aktuella biträden, t.ex.
                e-postleverantör.]
              </p>
            </div>

            <div>
              <h2 className="text-linen">Dina rättigheter</h2>
              <p className="mt-3">
                Du har rätt att begära tillgång till, rättelse eller radering av
                dina personuppgifter, samt att invända mot eller begränsa
                behandlingen. Du kan när som helst återkalla ett lämnat samtycke.
                Om du anser att vi behandlar dina uppgifter felaktigt kan du
                vända dig till Integritetsskyddsmyndigheten (IMY).
              </p>
            </div>
          </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
