"use client";

import { useMemo, useState } from "react";
import Bilkort from "@/app/components/Bilkort";
import type { Fordon } from "@/lib/nextlease";
import {
  type Filter,
  type Facettgrupp,
  TOM_FILTER,
  FACETTER,
  filtrera,
  facettAlternativ,
  aktivaVal,
  paramsFranFilter,
} from "@/lib/bilfilter";

function SokIkon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Vår egen browse över lagret (Nextlease-API-data). Filtren är datadrivna
 * (lib/bilfilter) — facetter genereras från bilarna med live-antal. Varje kort
 * länkar till Nextlease-detaljvyn (/objekt#/details/{uid}). Init-filtret kommer
 * från URL-query (server-parsat) så hero-deep-links landar förfiltrerade.
 */
export default function BilarBrowse({
  bilar,
  start,
}: {
  bilar: Fordon[];
  start: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(start);
  const resultat = useMemo(() => filtrera(bilar, filter), [bilar, filter]);
  const antalAktiva = aktivaVal(filter);

  function uppdatera(nytt: Filter) {
    setFilter(nytt);
    // Delbar URL utan Next-navigering (ingen server-omrendering).
    const qs = new URLSearchParams(paramsFranFilter(nytt)).toString();
    window.history.replaceState(null, "", qs ? `/bilar?${qs}` : "/bilar");
  }

  function toggle(grupp: Facettgrupp, varde: string) {
    const nu = filter[grupp];
    const ny = nu.includes(varde)
      ? nu.filter((v) => v !== varde)
      : [...nu, varde];
    uppdatera({ ...filter, [grupp]: ny });
  }

  return (
    <div>
      {/* Filterpanel */}
      <div className="rounded-lg border border-line bg-card p-5">
        {/* Sök */}
        <div className="flex h-12 items-center gap-3 rounded-lg border border-line-strong bg-page px-4 transition-colors focus-within:border-highlight">
          <SokIkon className="h-5 w-5 shrink-0 text-fog" />
          <input
            type="text"
            value={filter.sok}
            onChange={(e) => uppdatera({ ...filter, sok: e.target.value })}
            placeholder="Sök märke, modell eller utrustning"
            aria-label="Sök bland våra bilar"
            className="hero-sok-input w-full bg-transparent text-base text-linen outline-none placeholder:text-fog"
          />
        </div>

        {/* Facetter (datadrivna, med antal) */}
        <div className="mt-5 space-y-4">
          {FACETTER.map(({ grupp, rubrik }) => {
            const alt = facettAlternativ(bilar, filter, grupp);
            if (alt.length === 0) return null;
            return (
              <div key={grupp}>
                <p className="caption text-fog">{rubrik}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {alt.map(({ varde, antal }) => {
                    const vald = filter[grupp].includes(varde);
                    return (
                      <button
                        key={varde}
                        type="button"
                        aria-pressed={vald}
                        onClick={() => toggle(grupp, varde)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          vald
                            ? "border-cobalt-500 bg-cobalt-500 text-[#0b0d11]"
                            : "border-line-strong text-mist hover:border-highlight hover:text-linen"
                        }`}
                      >
                        {varde}
                        <span className={vald ? "opacity-70" : "text-fog"}>
                          {antal}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Räknare + rensa */}
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <p className="text-sm text-mist">
            <span className="font-semibold text-linen">{resultat.length}</span>{" "}
            {resultat.length === 1 ? "bil" : "bilar"}
          </p>
          {antalAktiva > 0 && (
            <button
              type="button"
              onClick={() => uppdatera(TOM_FILTER)}
              className="link text-sm"
            >
              Rensa filter ({antalAktiva})
            </button>
          )}
        </div>
      </div>

      {/* Resultat */}
      {resultat.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resultat.map((f) => (
            <Bilkort key={f.uid} fordon={f} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-line bg-card p-10 text-center">
          <p className="text-mist">Inga bilar matchar ditt filter.</p>
          <button
            type="button"
            onClick={() => uppdatera(TOM_FILTER)}
            className="btn btn-secondary mt-4"
          >
            Rensa filter
          </button>
        </div>
      )}
    </div>
  );
}
