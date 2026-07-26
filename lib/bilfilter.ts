import type { Fordon } from "./nextlease";

/**
 * Datadriven filtrering för vår egen /bilar-browse. Alla facett-alternativ
 * genereras från lagret (aldrig hårdkodat) med antal — tomma värden finns helt
 * enkelt inte, så filtren speglar alltid verkligheten och underhåller sig själva.
 */

export type Facettgrupp = "bodyType" | "fuelType" | "gearBoxType";

export type Filter = {
  sok: string;
  bodyType: string[];
  fuelType: string[];
  gearBoxType: string[];
};

export const TOM_FILTER: Filter = {
  sok: "",
  bodyType: [],
  fuelType: [],
  gearBoxType: [],
};

// Facett-grupper med svenska rubriker + URL-parameternamn.
export const FACETTER: {
  grupp: Facettgrupp;
  rubrik: string;
  param: string;
}[] = [
  { grupp: "bodyType", rubrik: "Biltyp", param: "biltyp" },
  { grupp: "fuelType", rubrik: "Drivmedel", param: "drivmedel" },
  { grupp: "gearBoxType", rubrik: "Växellåda", param: "vaxellada" },
];

/** Matchar en bil mot filtret: sök AND, inom grupp OR, mellan grupper AND. */
export function matchar(f: Fordon, filter: Filter): boolean {
  const s = filter.sok.trim().toLowerCase();
  if (s) {
    const hoStack =
      `${f.brand} ${f.model} ${f.modelDescription} ${f.modelYear}`.toLowerCase();
    if (!s.split(/\s+/).every((ord) => hoStack.includes(ord))) return false;
  }
  for (const { grupp } of FACETTER) {
    const valda = filter[grupp];
    if (valda.length > 0 && !valda.includes(f[grupp])) return false;
  }
  return true;
}

export function filtrera(bilar: Fordon[], filter: Filter): Fordon[] {
  return bilar.filter((f) => matchar(f, filter));
}

export type Alternativ = { varde: string; antal: number };

/**
 * Facett-alternativ för en grupp, med antal räknat mot filtret EXKL. den egna
 * gruppen — så antalet visar vad valet faktiskt skulle ge (klassisk facetterad
 * sök). Värden med 0 finns inte i mängden och renderas därför aldrig.
 */
export function facettAlternativ(
  bilar: Fordon[],
  filter: Filter,
  grupp: Facettgrupp,
): Alternativ[] {
  const utanEgen: Filter = { ...filter, [grupp]: [] };
  const bas = filtrera(bilar, utanEgen);
  const m = new Map<string, number>();
  for (const f of bas) {
    const v = f[grupp];
    if (!v) continue;
    m.set(v, (m.get(v) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([varde, antal]) => ({ varde, antal }))
    .sort((a, b) => b.antal - a.antal || a.varde.localeCompare(b.varde, "sv"));
}

/** Antal aktiva filterval (för "Rensa"-knapp och liknande). */
export function aktivaVal(filter: Filter): number {
  return (
    (filter.sok.trim() ? 1 : 0) +
    filter.bodyType.length +
    filter.fuelType.length +
    filter.gearBoxType.length
  );
}

type Params = Record<string, string | string[] | undefined>;

/** URL-query → Filter (för hero-deep-links och delbara/tillbaka-URL:er). */
export function filterFranParams(params: Params): Filter {
  const lista = (v: string | string[] | undefined): string[] =>
    v == null ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);
  const text = (v: string | string[] | undefined): string =>
    v == null ? "" : Array.isArray(v) ? (v[0] ?? "") : v;
  return {
    sok: text(params.sok),
    bodyType: lista(params.biltyp),
    fuelType: lista(params.drivmedel),
    gearBoxType: lista(params.vaxellada),
  };
}

/** Filter → query-object (för URL-sync). */
export function paramsFranFilter(filter: Filter): Record<string, string> {
  const p: Record<string, string> = {};
  if (filter.sok.trim()) p.sok = filter.sok.trim();
  if (filter.bodyType.length) p.biltyp = filter.bodyType.join(",");
  if (filter.fuelType.length) p.drivmedel = filter.fuelType.join(",");
  if (filter.gearBoxType.length) p.vaxellada = filter.gearBoxType.join(",");
  return p;
}
