/**
 * Google Places API (New) — hämtar företagets betyg + recensioner SERVER-SIDE.
 *
 * Nyckeln (GOOGLE_PLACES_API_KEY) läses bara här, på servern — den når aldrig
 * webbläsaren (inget NEXT_PUBLIC_-prefix). "Alla nycklar dolda."
 *
 * Begränsningar (Googles API, inte vår kod):
 *  - Max 5 recensioner returneras, Google väljer vilka. Aggregatet (betyg/antal)
 *    är däremot komplett.
 *  - `reviews` är Googles dyraste fält-tier → vi cachar 1 gång/dygn (revalidate),
 *    så det blir ~1 anrop/dygn oavsett trafik.
 *  - Attribuering krävs: visa författarnamn + foto och länka till Google, ändra
 *    inte texten. Det gör badge-komponenten.
 *
 * Vid fel/utan nyckel returneras RESERV (kända riktiga siffror, tomma citat) så
 * att heron alltid renderar.
 */

const PLACE_ID =
  process.env.GOOGLE_PLACES_ID ?? "ChIJT3F6RsslUkYRQ9aWTcPTrB0";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Kanonisk länk till alla omdömen på Google (samma som omdömessektionen).
const ALLA_OMDOMEN_LANK =
  "https://www.google.com/search?q=Johnsson+Bilcenter+AB&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_11SUEp8b3UmJ2sLe5p3rRKlVGo433jCuR7mzMgyS5ZKWbxCTw2Wtey4q63o4c9tyFxXfL0%3D";

export type GoogleRecension = {
  forfattare: string;
  avatarUrl: string | null;
  betyg: number;
  text: string;
  nar: string;
  lank: string;
};

export type GoogleOmdomen = {
  betyg: number; // 4.9
  antal: number; // 61
  lank: string; // till alla omdömen
  recensioner: GoogleRecension[];
};

// Kända riktiga aggregatsiffror (verifierade mot API 2026-07) som fallback.
const RESERV: GoogleOmdomen = {
  betyg: 4.9,
  antal: 61,
  lank: ALLA_OMDOMEN_LANK,
  recensioner: [],
};

type PlacesReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
  googleMapsUri?: string;
};

type PlacesSvar = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

export async function hamtaGoogleOmdomen(): Promise<GoogleOmdomen> {
  if (!API_KEY) return RESERV;
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=sv`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "rating,userRatingCount,googleMapsUri,reviews",
        },
        // 1 gång/dygn — håller kostnad nere och betyget färskt.
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return RESERV;
    const d: PlacesSvar = await res.json();

    const recensioner: GoogleRecension[] = (d.reviews ?? []).map((r) => ({
      forfattare: r.authorAttribution?.displayName ?? "Google-användare",
      avatarUrl: r.authorAttribution?.photoUri ?? null,
      betyg: r.rating ?? 5,
      // Svenska originalet i första hand (sajten är svensk).
      text: r.originalText?.text ?? r.text?.text ?? "",
      nar: r.relativePublishTimeDescription ?? "",
      lank: r.googleMapsUri ?? d.googleMapsUri ?? ALLA_OMDOMEN_LANK,
    }));

    return {
      betyg: d.rating ?? RESERV.betyg,
      antal: d.userRatingCount ?? RESERV.antal,
      lank: ALLA_OMDOMEN_LANK,
      recensioner,
    };
  } catch {
    return RESERV;
  }
}
