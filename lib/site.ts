/**
 * Central plats för sajt- och företagsfakta som används av metadata, robots,
 * sitemap, JSON-LD och llms.txt. En källa → konsekvent NAP (namn/adress/telefon)
 * för både Google och AI.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.johnssonsbilcenter.se";

export const FORETAG = {
  namn: "Johnsson Bilcenter AB",
  kortnamn: "Johnsson Bilcenter",
  orgnr: "559387-0537",
  slogan: "Bilhandlare i Helsingborg",
  beskrivning:
    "Johnsson Bilcenter i Helsingborg köper, säljer, byter och förmedlar begagnade bilar i hela Skåne. Kostnadsfri värdering, finansiering och garanti.",
  telefon: "+46733029019",
  telefonVisning: "073-302 90 19",
  epost: "Johnssonsbilcenter@gmail.com",
  adress: {
    gata: "Florettgatan 8",
    postnr: "254 67",
    ort: "Helsingborg",
    region: "Skåne",
    land: "SE",
  },
  /** openingHoursSpecification-underlag (schema.org). */
  oppettider: [
    { dagar: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], fran: "10:00", til: "18:00" },
    { dagar: ["Saturday"], fran: "11:00", til: "15:00" },
  ],
} as const;

/**
 * Smart Bilverkstad — fristående verkstad i samma hus som Johnsson (/verkstad).
 * Delar tills vidare adress och telefon (Simons) med FORETAG. E-post och
 * öppettider kommer från verkstadens flyer.
 * Får verkstaden eget nummer eller egen Google-profil: ändra HÄR så att sidan,
 * JSON-LD och llms följer med.
 */
export const VERKSTAD = {
  namn: "Smart Bilverkstad",
  beskrivning:
    "Bilverkstad i samma hus som Johnsson Bilcenter på Florettgatan 8 i Helsingborg. Kamremsbyte, felsökning, däckskifte och större reparationer.",
  telefon: FORETAG.telefon,
  telefonVisning: FORETAG.telefonVisning,
  epost: "verkstad@johnssonsbilcenter.se",
  adress: FORETAG.adress,
  /** Flyern visar bara vardagar. Helgen är obekräftad → utelämnad, hellre inget
   *  än fel tider i Google. */
  oppettider: [
    { dagar: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], fran: "10:00", til: "18:00" },
  ],
} as const;

/** Externa profiler → schema.org `sameAs` (bygger entiteten). */
export const SOCIALA = [
  "https://www.instagram.com/johnssonbilcenter/",
  "https://www.blocket.se/mobility/dealer/7323722/johnsson-bilcenter-ab",
];

/** Publika, indexerbara sidor (för sitemap). `/nextlease-embed` är noindex. */
export const SIDOR = [
  { path: "/", priority: 1.0 },
  { path: "/bilar", priority: 0.9 },
  { path: "/objekt", priority: 0.7 },
  { path: "/salj-din-bil", priority: 0.8 },
  { path: "/formedling", priority: 0.8 },
  { path: "/tjanster/finansiering", priority: 0.6 },
  { path: "/tjanster/garanti", priority: 0.6 },
  { path: "/verkstad", priority: 0.7 },
  { path: "/om-oss", priority: 0.6 },
  { path: "/kontakt", priority: 0.7 },
  { path: "/integritetspolicy", priority: 0.3 },
  { path: "/llms.html", priority: 0.3 },
];
