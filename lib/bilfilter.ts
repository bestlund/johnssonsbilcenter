import type { Fordon } from "./nextlease";

/**
 * Datadriven filtrering + sortering för vår egen /bilar-browse. Facett-alternativ
 * genereras från lagret (aldrig hårdkodat) med antal — tomma värden finns helt
 * enkelt inte, så filtren speglar alltid verkligheten och underhåller sig själva.
 */

export type Facettgrupp = "brand" | "bodyType" | "fuelType" | "gearBoxType";

export type Filter = {
  sok: string;
  brand: string[];
  bodyType: string[];
  fuelType: string[];
  gearBoxType: string[];
  // Intervall — tom sträng = ingen gräns.
  prisMin: string;
  prisMax: string;
  milMin: string;
  milMax: string;
  arMin: string;
  arMax: string;
};

export const TOM_FILTER: Filter = {
  sok: "",
  brand: [],
  bodyType: [],
  fuelType: [],
  gearBoxType: [],
  prisMin: "",
  prisMax: "",
  milMin: "",
  milMax: "",
  arMin: "",
  arMax: "",
};

// Synliga facett-grupper (checkboxar) med rubrik + URL-parameternamn.
export const FACETTER: {
  grupp: Facettgrupp;
  rubrik: string;
  param: string;
}[] = [
  { grupp: "brand", rubrik: "Märke", param: "marke" },
  { grupp: "bodyType", rubrik: "Biltyp", param: "biltyp" },
  { grupp: "fuelType", rubrik: "Drivmedel", param: "drivmedel" },
  { grupp: "gearBoxType", rubrik: "Växellåda", param: "vaxellada" },
];

// Intervallfilter (bakom "Fler filter"). falt = fält på Fordon; min/max = nycklar
// i Filter (sträng-fält).
export type IntervallNyckel =
  | "prisMin"
  | "prisMax"
  | "milMin"
  | "milMax"
  | "arMin"
  | "arMax";

export const INTERVALL: {
  falt: "price" | "mileage" | "modelYear";
  rubrik: string;
  min: IntervallNyckel;
  max: IntervallNyckel;
  paramMin: string;
  paramMax: string;
  suffix?: string;
}[] = [
  {
    falt: "modelYear",
    rubrik: "Modellår",
    min: "arMin",
    max: "arMax",
    paramMin: "armin",
    paramMax: "armax",
  },
  {
    falt: "price",
    rubrik: "Pris",
    min: "prisMin",
    max: "prisMax",
    paramMin: "prismin",
    paramMax: "prismax",
    suffix: "kr",
  },
  {
    falt: "mileage",
    rubrik: "Miltal",
    min: "milMin",
    max: "milMax",
    paramMin: "milmin",
    paramMax: "milmax",
    suffix: "mil",
  },
];

function inomIntervall(v: number, min: string, max: string): boolean {
  const lo = min.trim() === "" ? -Infinity : Number(min);
  const hi = max.trim() === "" ? Infinity : Number(max);
  if (Number.isNaN(lo) || Number.isNaN(hi)) return true; // ogiltig input ignoreras
  return v >= lo && v <= hi;
}

/** Matchar en bil mot filtret: sök AND, inom facett OR, mellan grupper AND, intervall AND. */
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
  if (!inomIntervall(f.price, filter.prisMin, filter.prisMax)) return false;
  if (!inomIntervall(f.mileage, filter.milMin, filter.milMax)) return false;
  if (!inomIntervall(f.modelYear, filter.arMin, filter.arMax)) return false;
  return true;
}

export function filtrera(bilar: Fordon[], filter: Filter): Fordon[] {
  return bilar.filter((f) => matchar(f, filter));
}

export type Alternativ = { varde: string; antal: number };

/**
 * Facett-alternativ för en grupp, med antal räknat mot filtret EXKL. den egna
 * gruppen (klassisk facetterad sök). Värden med 0 finns inte i mängden.
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

/** Antal aktiva filterval (för "Rensa" och räknare). */
export function aktivaVal(filter: Filter): number {
  let n =
    (filter.sok.trim() ? 1 : 0) +
    filter.brand.length +
    filter.bodyType.length +
    filter.fuelType.length +
    filter.gearBoxType.length;
  for (const iv of INTERVALL) {
    if (String(filter[iv.min]).trim()) n++;
    if (String(filter[iv.max]).trim()) n++;
  }
  return n;
}

/* ---------- Sortering ---------- */

export type Sortering =
  | "rekommenderad"
  | "pris-upp"
  | "pris-ner"
  | "ar-ny"
  | "mil-lag"
  | "marke";

export const SORTERINGAR: { varde: Sortering; etikett: string }[] = [
  { varde: "rekommenderad", etikett: "Rekommenderad" },
  { varde: "pris-upp", etikett: "Pris — lägst först" },
  { varde: "pris-ner", etikett: "Pris — högst först" },
  { varde: "ar-ny", etikett: "Årsmodell — nyast" },
  { varde: "mil-lag", etikett: "Miltal — lägst" },
  { varde: "marke", etikett: "Märke A–Ö" },
];

export function arSortering(v: string): v is Sortering {
  return SORTERINGAR.some((s) => s.varde === v);
}

export function sortera(bilar: Fordon[], s: Sortering): Fordon[] {
  const a = [...bilar];
  switch (s) {
    case "pris-upp":
      return a.sort((x, y) => x.price - y.price);
    case "pris-ner":
      return a.sort((x, y) => y.price - x.price);
    case "ar-ny":
      return a.sort((x, y) => y.modelYear - x.modelYear);
    case "mil-lag":
      return a.sort((x, y) => x.mileage - y.mileage);
    case "marke":
      return a.sort((x, y) =>
        `${x.brand} ${x.model}`.localeCompare(`${y.brand} ${y.model}`, "sv"),
      );
    default:
      return a; // rekommenderad = lagrets ordning
  }
}

/* ---------- URL <-> Filter ---------- */

type Params = Record<string, string | string[] | undefined>;

const lista = (v: string | string[] | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);
const text = (v: string | string[] | undefined): string =>
  v == null ? "" : Array.isArray(v) ? (v[0] ?? "") : v;

/** URL-query → Filter (för hero-deep-links och delbara/tillbaka-URL:er). */
export function filterFranParams(params: Params): Filter {
  return {
    sok: text(params.sok),
    brand: lista(params.marke),
    bodyType: lista(params.biltyp),
    fuelType: lista(params.drivmedel),
    gearBoxType: lista(params.vaxellada),
    prisMin: text(params.prismin),
    prisMax: text(params.prismax),
    milMin: text(params.milmin),
    milMax: text(params.milmax),
    arMin: text(params.armin),
    arMax: text(params.armax),
  };
}

/** Filter (+ sortering) → query-object för URL-sync. */
export function paramsFranFilter(
  filter: Filter,
  sort: Sortering = "rekommenderad",
): Record<string, string> {
  const p: Record<string, string> = {};
  if (filter.sok.trim()) p.sok = filter.sok.trim();
  if (filter.brand.length) p.marke = filter.brand.join(",");
  if (filter.bodyType.length) p.biltyp = filter.bodyType.join(",");
  if (filter.fuelType.length) p.drivmedel = filter.fuelType.join(",");
  if (filter.gearBoxType.length) p.vaxellada = filter.gearBoxType.join(",");
  if (filter.prisMin.trim()) p.prismin = filter.prisMin.trim();
  if (filter.prisMax.trim()) p.prismax = filter.prisMax.trim();
  if (filter.milMin.trim()) p.milmin = filter.milMin.trim();
  if (filter.milMax.trim()) p.milmax = filter.milMax.trim();
  if (filter.arMin.trim()) p.armin = filter.arMin.trim();
  if (filter.arMax.trim()) p.armax = filter.arMax.trim();
  if (sort !== "rekommenderad") p.sort = sort;
  return p;
}
