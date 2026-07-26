/**
 * Nextlease API-klient.
 *
 * Endpointen upptäcktes i widgetens klientbundle (embedded.nextlease.se).
 * Den är odokumenterad men publik — samma anrop som widgeten själv gör.
 * Om Nextlease ändrar den slutar den här sektionen fungera; se felhanteringen
 * i BilarILager-komponenten.
 */

const API_BAS = "https://api.nextlease.se/api/v1";
const BILD_BAS = "https://dattd4s4rdse4.cloudfront.net/Vehicles";

/** Enda verifierade bildstorlekarna är 320x210 och 900x600. */
export const bildUrl = (id: string, storlek: "320x210" | "900x600" = "900x600") =>
  `${BILD_BAS}/${storlek}/${id}`;

export type Fordon = {
  uid: string;
  brand: string;
  model: string;
  modelDescription: string;
  modelYear: number;
  mileage: number;
  price: number;
  monthlyPrice: number;
  fuelType: string;
  gearBoxType: string;
  bodyType: string;
  registrationNumber: string;
  vehicleImage: string | null;
  vehicleImages: string[];
};

type Svar = {
  totalCount: number;
  items: Fordon[];
};

// Egen publiceringskonfig för nya sajten (skild från Framer-sajtens UID), så att
// Simons stilinställningar för utvecklingssajten inte påverkar live-sajten.
export const DEALER_UID =
  process.env.NEXT_PUBLIC_NEXTLEASE_UID ??
  "1fb18af2-7317-4074-811d-e3eef824a073";

type HamtResultat = { fordon: Fordon[]; totalt: number };

/**
 * Internt: hämtar HELA lagret (pageSize=50) cachat en timme. Delas av alla
 * publika funktioner nedan så att bara ett API-anrop görs per rendering.
 * Returnerar tom lista vid fel så att sidan ändå renderar (sektionen döljs).
 */
async function hamtaAlla(): Promise<HamtResultat> {
  try {
    const res = await fetch(
      `${API_BAS}/export-vehicles/${DEALER_UID}?pageSize=50`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return { fordon: [], totalt: 0 };
    const data: Svar = await res.json();
    return { fordon: data.items ?? [], totalt: data.totalCount ?? 0 };
  } catch {
    return { fordon: [], totalt: 0 };
  }
}

/** De första `antal` fordonen ur lagret (t.ex. för lagerantal i heron). */
export async function hamtaFordon(antal = 4): Promise<HamtResultat> {
  const { fordon, totalt } = await hamtaAlla();
  return { fordon: fordon.slice(0, antal), totalt };
}

/** Hela lagret — för hero-typeahead som filtrerar på klientsidan. */
export async function hamtaAllaFordon(): Promise<HamtResultat> {
  return hamtaAlla();
}

/**
 * `antal` slumpvis valda fordon ur hela lagret. Blandas per anrop — på en
 * dynamiskt renderad sida blir det nya bilar vid varje besök, och sålda/
 * borttagna bilar försvinner automatiskt (inom cache-fönstret på 1h). Inga
 * hårdkodade bilar.
 */
export async function hamtaSlumpadeFordon(antal = 5): Promise<HamtResultat> {
  const { fordon, totalt } = await hamtaAlla();
  return { fordon: blanda(fordon).slice(0, antal), totalt };
}

/** Fisher–Yates — opartisk blandning (till skillnad från sort(()=>Math.random())). */
function blanda<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 15958 → "15 958 mil" osv. Svensk tusenavgränsare. */
export const formatTal = (n: number) => n.toLocaleString("sv-SE");
