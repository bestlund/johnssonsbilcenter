"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroSok from "./HeroSok";
import type { SokBil } from "./heroVal";

type Flik = "kopa" | "salja";

// Delad "ingen ful fokus-ring"-hook (regel i globals.css). Fokus visas i stället
// via border-highlight / aktiv-underline.
const UTAN_RING = "hero-sok-input";
const FALT =
  "w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-linen outline-none transition-colors placeholder:text-fog focus:border-highlight";

// Svensk registreringsskylt-emblem (EU-band: blått fullhöjds-band med gula
// stjärnor + "S"). Bandet är ett div-element (blå bg fyller höjden via CSS);
// stjärnringen är en fast-storleks-SVG ovanpå så inget stretchas. Samma grepp
// som Riddermark/Kamux — signalerar att ett svenskt reg.nr ska anges.
function SvenskPlatBricka({ className = "" }: { className?: string }) {
  const stjarnor = Array.from({ length: 12 }, (_, i) => {
    const a = ((-90 + i * 30) * Math.PI) / 180;
    return { x: 8 + 6 * Math.cos(a), y: 8 + 6 * Math.sin(a) };
  });
  return (
    <span
      className={`flex flex-col items-center justify-center gap-0.5 bg-[#003399] ${className}`}
    >
      <svg viewBox="0 0 16 16" className="w-3.5" aria-hidden="true">
        {stjarnor.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r="1" fill="#FFCC00" />
        ))}
      </svg>
      <span className="text-[9px] font-bold leading-none text-white">S</span>
    </span>
  );
}

/**
 * Hero-högerkolumnens flik-widget: Köpa bil / Sälja bil.
 *  - Köpa  = typeahead-sök (HeroSok) + "Se alla bilar".
 *  - Sälja = reg.nr + önskat pris (valfritt) + telefon → värdering.
 * Aktiv flik markeras med cobalt-underline. Ingen overflow-hidden (sök-dropdownen
 * måste kunna svämma ut).
 */
export default function HeroFlikar({
  totalt,
  sokBilar,
}: {
  totalt: number;
  sokBilar: SokBil[];
}) {
  const router = useRouter();
  const [flik, setFlik] = useState<Flik>("kopa");
  const [regnr, setRegnr] = useState("");
  const [pris, setPris] = useState("");
  const [tel, setTel] = useState("");

  function submitSalj(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    const r = regnr.trim().toUpperCase().replace(/\s+/g, "");
    if (r) p.set("reg", r);
    if (pris.trim()) p.set("pris", pris.trim());
    if (tel.trim()) p.set("tel", tel.trim());
    const qs = p.toString();
    router.push(qs ? `/salj-din-bil?${qs}` : "/salj-din-bil");
  }

  return (
    <div className="rounded-lg border border-line-strong bg-card">
      {/* Flikar — aktiv markeras med cobalt-underline */}
      <div
        className="grid grid-cols-2 border-b border-line"
        role="tablist"
        aria-label="Köpa eller sälja"
      >
        {(
          [
            ["kopa", "Köpa bil"],
            ["salja", "Sälja bil"],
          ] as const
        ).map(([id, label]) => {
          const aktiv = flik === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={aktiv}
              onClick={() => setFlik(id)}
              className={`${UTAN_RING} -mb-px border-b-2 py-4 text-sm font-semibold transition-colors focus-visible:text-linen ${
                aktiv
                  ? "border-cobalt-500 text-linen"
                  : "border-transparent text-mist hover:text-linen"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="rounded-b-lg bg-elevated p-6">
        {flik === "kopa" ? (
          <div>
            <HeroSok bilar={sokBilar} />
            <Link href="/bilar" className="btn btn-secondary mt-4 w-full">
              Se alla bilar{totalt ? ` (${totalt})` : ""}
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold text-linen">
              Vad är din bil värd?
            </p>
            <p className="small mt-1 text-mist">
              Kostnadsfri värdering, rättvist bud direkt eller via förmedling.
            </p>

            <form onSubmit={submitSalj} className="mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="salj-regnr" className="field-label">
                    Registreringsnummer
                  </label>
                  <div className="relative">
                    <SvenskPlatBricka className="pointer-events-none absolute inset-y-px left-px w-7 overflow-hidden rounded-l-[7px]" />
                    <input
                      id="salj-regnr"
                      type="text"
                      required
                      value={regnr}
                      onChange={(e) => setRegnr(e.target.value.toUpperCase())}
                      placeholder="ABC 12X"
                      maxLength={8}
                      className={`${UTAN_RING} w-full rounded-md border border-line-strong bg-card py-2.5 pl-11 pr-3 text-linen outline-none transition-colors placeholder:text-fog focus:border-highlight`}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="salj-pris" className="field-label">
                    Ditt önskade pris{" "}
                    <span className="text-fog">· valfritt</span>
                  </label>
                  <div className="relative">
                    <input
                      id="salj-pris"
                      type="text"
                      inputMode="numeric"
                      value={pris}
                      onChange={(e) => setPris(e.target.value)}
                      placeholder="185 000"
                      className={`${UTAN_RING} ${FALT} pr-9`}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fog">
                      kr
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="salj-tel" className="field-label">
                  Telefonnummer
                </label>
                <input
                  id="salj-tel"
                  type="tel"
                  required
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="073-000 00 00"
                  className={`${UTAN_RING} ${FALT}`}
                />
              </div>

              <button type="submit" className="btn btn-primary mt-4 w-full">
                Få en värdering
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-fog">
              Vi återkommer samma dag · ingen förpliktelse
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
