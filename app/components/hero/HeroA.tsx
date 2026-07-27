import Link from "next/link";
import { hamtaAllaFordon } from "@/lib/nextlease";
import { hamtaGoogleOmdomen } from "@/lib/googleReviews";
import Bilkort from "@/app/components/Bilkort";
import GoogleOmdomeBadge from "@/app/components/GoogleOmdomeBadge";
import HeroFlikar from "./HeroFlikar";
import { tillSokBilar, RUBRIK, BRODTEXT } from "./heroVal";

/**
 * Variant A — hero + lagerurval i samma vy.
 *
 * Layout/placering som variant C: hero-blocket centreras i tillgängligt utrymme
 * (C:s kolumnförhållande + centrering + gap), men A:s egna storlekar behålls
 * (större rubrik, val-rader py-6, ikoner). Bilkorten ligger kvar längst ned och
 * skär vikningen så att continuation-principen lockar till scroll.
 */
export default async function HeroA() {
  const { fordon: alla, totalt } = await hamtaAllaFordon();
  const omdomen = await hamtaGoogleOmdomen();
  const fordon = alla.slice(0, 4);
  const sokBilar = tillSokBilar(alla);

  return (
    <section className="shell flex flex-col pb-12">
      {/* Hero-block — centreras i exakt 65dvh, identisk spacing som variant C */}
      <div className="flex min-h-[65dvh] items-center py-10">
        <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-20">
          <div>
            <h1 className="text-[clamp(2.25rem,5vw,3.25rem)]">{RUBRIK}</h1>
            <p className="body-lg mt-7 max-w-md text-mist">{BRODTEXT}</p>
            <GoogleOmdomeBadge data={omdomen} />
          </div>

          {/* Flik-widget: Köpa (sök) / Sälja (reg.nr → värdering).
              Kolumnen reserverar Sälja-lägets höjd (det högsta) på lg så att
              flikbytet inte ändrar kolumnhöjden och trycker ner bilrutnätet.
              Reserven ligger på den transparenta kolumnen — inte inuti kortet —
              så kortet behåller sin naturliga höjd (ingen skev tomrum). */}
          <div className="lg:min-h-[460px]">
            <HeroFlikar totalt={totalt} sokBilar={sokBilar} />

            {/* Subtila sekundärtjänster. Destinationer ej bestämda än. */}
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <button
                type="button"
                className="hero-sok-input text-cobalt-400 transition-colors hover:underline focus-visible:underline"
              >
                Byta bil
              </button>
              <span className="text-fog" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="hero-sok-input text-cobalt-400 transition-colors hover:underline focus-visible:underline"
              >
                Sälj via förmedling
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lagerurval — längst ned, skär vikningen */}
      {fordon.length > 0 && (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fordon.map((f) => (
              <Bilkort key={f.uid} fordon={f} />
            ))}
          </div>

          {/* Se alla — under rutnätet, högerställd (alignar sista kortets kant) */}
          <div className="mt-6 flex justify-end">
            <Link href="/bilar" className="btn btn-secondary">
              Se alla bilar{totalt ? ` (${totalt})` : ""}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
