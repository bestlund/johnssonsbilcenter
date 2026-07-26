import Link from "next/link";
import { hamtaFordon } from "@/lib/nextlease";
import { byggVal, RUBRIK, BRODTEXT, Pil } from "./heroVal";

/**
 * Variant C (rekommenderad) — full-bleed hero utan kortram, ~78dvh.
 * Höjden är vald så att nästa sektions bilkort precis skär vikningen:
 * heron får närvaro, men man ser toppen av bilarna och lockas att scrolla.
 */
export default async function HeroC() {
  const { totalt } = await hamtaFordon(1);
  const val = byggVal(totalt);

  return (
    <section className="shell flex min-h-[65dvh] items-center py-10">
      <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
        <div>
          <h1 className="text-[clamp(2.25rem,5.5vw,3.5rem)]">{RUBRIK}</h1>
          <p className="body-lg mt-7 max-w-md text-mist">{BRODTEXT}</p>
        </div>

        <ul className="border-t border-line">
          {val.map((v) => (
            <li key={v.href} className="border-b border-line">
              <Link
                href={v.href}
                className="group flex items-center gap-4 py-5 transition-colors"
              >
                <span className="shrink-0 text-cobalt-400">{v.ikon}</span>
                <span className="flex-1">
                  <span className="block font-semibold transition-colors group-hover:text-cobalt-400">
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
    </section>
  );
}
