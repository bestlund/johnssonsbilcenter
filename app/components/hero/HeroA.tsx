import Link from "next/link";
import { hamtaFordon } from "@/lib/nextlease";
import Bilkort from "@/app/components/Bilkort";
import { byggVal, RUBRIK, BRODTEXT, Pil } from "./heroVal";

/**
 * Variant A — hero + lagerurval i samma vy.
 *
 * Layout/placering som variant C: hero-blocket centreras i tillgängligt utrymme
 * (C:s kolumnförhållande + centrering + gap), men A:s egna storlekar behålls
 * (större rubrik, val-rader py-6, ikoner). Bilkorten ligger kvar längst ned och
 * skär vikningen så att continuation-principen lockar till scroll.
 */
export default async function HeroA() {
  const { fordon, totalt } = await hamtaFordon(4);
  const val = byggVal(totalt);

  return (
    <section className="shell flex flex-col pb-12">
      {/* Hero-block — centreras i exakt 65dvh, identisk spacing som variant C */}
      <div className="flex min-h-[65dvh] items-center py-10">
        <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
          <div>
            <h1 className="text-[clamp(2.25rem,5vw,3.25rem)]">{RUBRIK}</h1>
            <p className="body-lg mt-7 max-w-md text-mist">{BRODTEXT}</p>
          </div>

          <ul className="border-t border-line">
            {val.map((v) => (
              <li key={v.href} className="border-b border-line">
                <Link
                  href={v.href}
                  className="group flex items-center gap-5 py-6 transition-colors"
                >
                  <span className="shrink-0 text-cobalt-400 [&>svg]:h-6 [&>svg]:w-6">
                    {v.ikon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-base font-semibold transition-colors group-hover:text-cobalt-400">
                      {v.titel}
                    </span>
                    <span className="small block text-mist">{v.text}</span>
                  </span>
                  <span className="shrink-0 text-mist transition-transform group-hover:translate-x-1 group-hover:text-cobalt-400">
                    {Pil}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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

          {/* Högerställd så knappen alignar med sista bilkortets högerkant */}
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
