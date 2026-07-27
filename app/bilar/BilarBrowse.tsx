"use client";

import { useMemo, useState } from "react";
import Bilkort from "@/app/components/Bilkort";
import type { Fordon } from "@/lib/nextlease";
import {
  type Filter,
  type Facettgrupp,
  type Sortering,
  type IntervallNyckel,
  TOM_FILTER,
  FACETTER,
  INTERVALL,
  SORTERINGAR,
  filtrera,
  sortera,
  facettAlternativ,
  aktivaVal,
  paramsFranFilter,
} from "@/lib/bilfilter";

const MARKE_GRANS = 6; // visa så många märken innan "Visa alla"

function SokIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function CheckIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="2.5" className={className} aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Kryssruta({ vald }: { vald: boolean }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border transition-colors ${
        vald ? "border-cobalt-500 bg-cobalt-500" : "border-line-strong"
      }`}
    >
      {vald && <CheckIkon className="h-3 w-3 text-[#0b0d11]" />}
    </span>
  );
}

/**
 * Vår egen browse: sidebar (facetter + "Fler filter"-intervall) + toppbar (sök,
 * antal, sortering) + grid. Datadrivet (lib/bilfilter) — allt filtrerbart via URL
 * så hero-deep-links landar förfiltrerade. Kort → Nextlease-detalj på /objekt.
 */
export default function BilarBrowse({
  bilar,
  start,
  startSort,
}: {
  bilar: Fordon[];
  start: Filter;
  startSort: Sortering;
}) {
  const [filter, setFilter] = useState<Filter>(start);
  const [sort, setSort] = useState<Sortering>(startSort);
  const [visaFler, setVisaFler] = useState(
    INTERVALL.some((iv) => String(filter[iv.min]) || String(filter[iv.max])),
  );
  const [visaMobil, setVisaMobil] = useState(false);
  const [visaAllaMarken, setVisaAllaMarken] = useState(false);

  const resultat = useMemo(
    () => sortera(filtrera(bilar, filter), sort),
    [bilar, filter, sort],
  );
  const antalAktiva = aktivaVal(filter);

  function synka(nyttFilter: Filter, nySort: Sortering) {
    const qs = new URLSearchParams(paramsFranFilter(nyttFilter, nySort)).toString();
    window.history.replaceState(null, "", qs ? `/bilar?${qs}` : "/bilar");
  }
  function uppdatera(nyttFilter: Filter) {
    setFilter(nyttFilter);
    synka(nyttFilter, sort);
  }
  function bytSort(ny: Sortering) {
    setSort(ny);
    synka(filter, ny);
  }
  function toggleFacett(grupp: Facettgrupp, varde: string) {
    const nu = filter[grupp];
    const ny = nu.includes(varde) ? nu.filter((v) => v !== varde) : [...nu, varde];
    uppdatera({ ...filter, [grupp]: ny });
  }
  function sattIntervall(nyckel: IntervallNyckel, varde: string) {
    uppdatera({ ...filter, [nyckel]: varde.replace(/[^\d]/g, "") });
  }

  return (
    <div className="lg:grid lg:grid-cols-[264px_1fr] lg:gap-8">
      {/* Mobil: filter-toggle. Wrappern (vanlig div) bär lg:hidden — .btn är
          olagrad i globals och skulle annars slå lg:hidden och visa knappen på
          desktop (då tar den en grid-cell och bryter layouten). */}
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setVisaMobil((v) => !v)}
          className="btn btn-secondary w-full"
        >
          {visaMobil ? "Dölj filter" : "Filter"}
          {antalAktiva > 0 ? ` (${antalAktiva})` : ""}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${visaMobil ? "block" : "hidden"} mb-6 lg:mb-0 lg:block`}>
        <div className="rounded-lg border border-line bg-card p-5 lg:sticky lg:top-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold">Filter</h2>
            {antalAktiva > 0 && (
              <button
                type="button"
                onClick={() => uppdatera(TOM_FILTER)}
                className="link text-sm"
              >
                Rensa ({antalAktiva})
              </button>
            )}
          </div>

          {/* Facetter */}
          {FACETTER.map(({ grupp, rubrik }) => {
            let alt = facettAlternativ(bilar, filter, grupp);
            if (alt.length === 0) return null;
            const valda = filter[grupp];
            // Kapa märkeslistan men behåll alltid valda värden synliga.
            const kanKorta = grupp === "brand" && alt.length > MARKE_GRANS;
            if (kanKorta && !visaAllaMarken) {
              alt = alt.filter((a, i) => i < MARKE_GRANS || valda.includes(a.varde));
            }
            return (
              <div key={grupp} className="mt-5 border-t border-line pt-4">
                <p className="text-sm font-semibold text-linen">{rubrik}</p>
                <div className="mt-2 space-y-0.5">
                  {alt.map(({ varde, antal }) => {
                    const vald = valda.includes(varde);
                    // 0 träffar och inte redan vald → gråtonad + ej klickbar,
                    // men raden blir kvar (stabil layout, inget hopp).
                    const inaktiv = antal === 0 && !vald;
                    return (
                      <button
                        key={varde}
                        type="button"
                        disabled={inaktiv}
                        aria-pressed={vald}
                        onClick={() => toggleFacett(grupp, varde)}
                        className={`flex w-full items-center gap-2.5 py-1 text-left ${
                          inaktiv
                            ? "cursor-not-allowed opacity-40"
                            : "cursor-pointer"
                        }`}
                      >
                        <Kryssruta vald={vald} />
                        <span className="flex-1 truncate text-sm text-mist">
                          {varde}
                        </span>
                        <span className="text-xs text-fog">{antal}</span>
                      </button>
                    );
                  })}
                </div>
                {kanKorta && (
                  <button
                    type="button"
                    onClick={() => setVisaAllaMarken((v) => !v)}
                    className="link mt-1 text-sm"
                  >
                    {visaAllaMarken ? "Visa färre" : `Visa alla`}
                  </button>
                )}
              </div>
            );
          })}

          {/* Fler filter — intervall */}
          <div className="mt-5 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => setVisaFler((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-between text-sm font-semibold text-linen"
            >
              Fler filter
              <span
                className={`text-fog transition-transform ${visaFler ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                ⌄
              </span>
            </button>
            {visaFler && (
              <div className="mt-3 space-y-4">
                {INTERVALL.map((iv) => (
                  <div key={iv.rubrik}>
                    <p className="text-sm text-mist">{iv.rubrik}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <IntervallFalt
                        value={filter[iv.min]}
                        onChange={(v) => sattIntervall(iv.min, v)}
                        placeholder="Från"
                        suffix={iv.suffix}
                      />
                      <span className="text-fog">–</span>
                      <IntervallFalt
                        value={filter[iv.max]}
                        onChange={(v) => sattIntervall(iv.max, v)}
                        placeholder="Till"
                        suffix={iv.suffix}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Huvudspalt */}
      <div>
        {/* Toppbar: sök + antal + sortering */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SokIkon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-fog" />
            <input
              type="text"
              value={filter.sok}
              onChange={(e) => uppdatera({ ...filter, sok: e.target.value })}
              placeholder="Sök på märke, modell eller utrustning"
              aria-label="Sök bland våra bilar"
              className="hero-sok-input h-11 w-full rounded-lg border border-line-strong bg-card pl-11 pr-4 text-base text-linen outline-none transition-colors placeholder:text-fog focus:border-highlight"
            />
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="whitespace-nowrap text-sm text-mist">
              <span className="font-semibold text-linen">{resultat.length}</span>{" "}
              {resultat.length === 1 ? "bil" : "bilar"}
            </span>
            <label className="sr-only" htmlFor="sortering">
              Sortera
            </label>
            <select
              id="sortering"
              value={sort}
              onChange={(e) => bytSort(e.target.value as Sortering)}
              className="hero-sok-input h-11 cursor-pointer rounded-lg border border-line-strong bg-card px-3 text-sm text-linen outline-none transition-colors focus:border-highlight"
            >
              {SORTERINGAR.map((s) => (
                <option key={s.varde} value={s.varde}>
                  {s.etikett}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {resultat.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resultat.map((f) => (
              <Bilkort key={f.uid} fordon={f} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-card p-10 text-center">
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
    </div>
  );
}

function IntervallFalt({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  suffix?: string;
}) {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`hero-sok-input w-full rounded-md border border-line-strong bg-page py-2 pl-2.5 text-sm text-linen outline-none transition-colors placeholder:text-fog focus:border-highlight ${
          suffix ? "pr-8" : "pr-2.5"
        }`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-fog">
          {suffix}
        </span>
      )}
    </div>
  );
}
