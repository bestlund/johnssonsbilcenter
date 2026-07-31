import { formatTal, type Fordon } from "@/lib/nextlease";

/** Delas av alla hero-varianter så innehållet inte divergerar. */

/** Minimalt sök-index som skickas till klient-typeaheaden (HeroSok). */
export type SokBil = {
  uid: string;
  brand: string;
  model: string;
  modelDescription: string;
  modelYear: number;
  price: number;
};

export const tillSokBilar = (fordon: Fordon[]): SokBil[] =>
  fordon.map((b) => ({
    uid: b.uid,
    brand: b.brand,
    model: b.model,
    modelDescription: b.modelDescription,
    modelYear: b.modelYear,
    price: b.price,
  }));

export const BilIkon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5">
    <path
      d="M4 15h16M6.5 15V11l1.8-3.8A2 2 0 0 1 10.1 6h3.8a2 2 0 0 1 1.8 1.2L17.5 11v4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="16.5" r="1.4" stroke="currentColor" />
    <circle cx="16" cy="16.5" r="1.4" stroke="currentColor" />
  </svg>
);

export const PrislappIkon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5">
    <path
      d="M3.5 11.5V4.5a1 1 0 0 1 1-1h7l9 9-8 8-9-9Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1.3" stroke="currentColor" />
  </svg>
);

export const KlockIkon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" />
    <path
      d="M12 7.5V12l3 1.8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Pil = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-4 w-4">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type HeroVal = {
  titel: string;
  text: string;
  href: string;
  ikon: React.ReactNode;
};

export const byggVal = (totalt: number): HeroVal[] => [
  {
    titel: "Köpa bil",
    text: totalt
      ? `${formatTal(totalt)} bilar i lager, varudeklaration ingår`
      : "Se våra bilar i lager",
    href: "/bilar",
    ikon: BilIkon,
  },
  {
    titel: "Sälja bil",
    text: "Rättvist bud direkt eller via förmedling",
    href: "/salj-din-bil",
    ikon: PrislappIkon,
  },
];
// Boka tid borttaget ur heron (bokning sker naturligt i köp-/säljflödet — lägg
// ett "boka möte"-förslag längre in i flödet i stället). KlockIkon behålls för
// återanvändning där. Se STATE.md/öppna punkter.

export const RUBRIK = (
  <>
    Gör ett <em>smart</em> bilköp med Johnsson Bilcenter
  </>
);

export const BRODTEXT =
  "Vi säljer, köper, byter och förmedlar begagnade bilar, med varudeklaration på varje affär.";
