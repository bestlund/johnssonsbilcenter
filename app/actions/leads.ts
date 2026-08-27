"use server";

import { headers } from "next/headers";
import { skickaLead, type Lead, type Bilaga } from "@/lib/leads";
import { processaBilder } from "@/lib/bilder";
import type { LeadState } from "@/lib/leadstate";
import { forSnabb, rateLimitad } from "@/lib/spam";
import {
  sanera,
  saneraRegnr,
  saneraTelefon,
  valideraEpost,
  valideraMiltal,
  valideraObligatorisk,
  valideraRegnr,
  valideraTelefon,
} from "@/lib/leadvalidering";

const FEL_ALLMANT =
  "Något gick fel när meddelandet skulle skickas. Ring oss gärna på 073-302 90 19 så hjälper vi dig.";
const FEL_FALT = "Kontrollera de markerade fälten och försök igen.";
const FEL_RATE =
  "Du har skickat flera förfrågningar nyss. Vänta en liten stund och försök igen, eller ring oss på 073-302 90 19.";

/** Bästa gissning på klientens IP bakom Vercels proxy. */
async function hamtaIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "";
  return xff.split(",")[0]?.trim() || "okand";
}

/**
 * En enda action för alla lead-formulär. Diskriminerar på det dolda
 * `formtyp`-fältet, validerar per typ (auktoritativt på servern) och skickar
 * ett strukturerat mejl. Returnerar `LeadState` som formulären renderar.
 */
export async function skickaLeadAction(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  // Honeypot: dolt fält som bara bots fyller i. Kvittera som "ok" utan att
  // skicka så att boten inte får veta att den blockerats.
  if (String(formData.get("webbplats") ?? "").trim()) {
    return { ok: true, fel: {}, meddelande: "Tack! Vi hör av oss snart." };
  }

  // Min-ifyllnadstid: misstänkt snabb submit = bot. Kvittera tyst som honeypot.
  if (forSnabb(formData.get("dt"))) {
    return { ok: true, fel: {}, meddelande: "Tack! Vi hör av oss snart." };
  }

  const g = (n: string) => String(formData.get(n) ?? "");
  const typ = g("formtyp");
  const fel: Record<string, string> = {};
  const samtyckt = g("samtycke") === "on";

  let lead: Lead;

  if (typ === "kontakt") {
    const fornamn = sanera(g("fornamn"));
    const telefon = sanera(g("telefon"));
    const epost = g("epost").trim();
    const arende = g("arende").trim();

    let e: string | null;
    if ((e = valideraObligatorisk(fornamn, "förnamn"))) fel.fornamn = e;
    if ((e = valideraTelefon(telefon))) fel.telefon = e;
    if ((e = valideraEpost(epost))) fel.epost = e;
    if ((e = valideraObligatorisk(arende, "ditt ärende"))) fel.arende = e;
    if (!samtyckt) fel.samtycke = "Du behöver godkänna att vi sparar dina uppgifter.";

    lead = { typ: "kontakt", fornamn, telefon, epost, arende };
  } else if (typ === "formedling") {
    const regnr = saneraRegnr(g("regnr"));
    const miltal = g("miltal").replace(/[^\d]/g, "");
    const telefon = sanera(g("telefon"));
    const epost = g("epost").trim();

    let e: string | null;
    if ((e = valideraRegnr(regnr))) fel.regnr = e;
    if ((e = valideraMiltal(miltal))) fel.miltal = e;
    if ((e = valideraTelefon(telefon))) fel.telefon = e;
    if (epost && (e = valideraEpost(epost))) fel.epost = e;
    if (!samtyckt) fel.samtycke = "Du behöver godkänna att vi sparar dina uppgifter.";

    lead = {
      typ: "formedling",
      regnr,
      miltal,
      telefon,
      ...(epost ? { epost } : {}),
    };
  } else if (typ === "salj") {
    const regnr = saneraRegnr(g("regnr"));
    const miltal = g("miltal").replace(/[^\d]/g, "");
    const onskatPris = g("pris").replace(/[^\d]/g, "");
    const telefon = sanera(g("telefon"));
    const namn = sanera(g("namn"));
    const epost = g("epost").trim();
    const meddelande = g("meddelande").trim();

    let e: string | null;
    if ((e = valideraRegnr(regnr))) fel.regnr = e;
    if (miltal && (e = valideraMiltal(miltal))) fel.miltal = e;
    if ((e = valideraTelefon(telefon))) fel.telefon = e;
    if (epost && (e = valideraEpost(epost))) fel.epost = e;
    if (!samtyckt) fel.samtycke = "Du behöver godkänna att vi sparar dina uppgifter.";

    lead = {
      typ: "salj",
      regnr,
      telefon,
      ...(miltal ? { miltal } : {}),
      ...(onskatPris ? { onskatPris } : {}),
      ...(namn ? { namn } : {}),
      ...(epost ? { epost } : {}),
      ...(meddelande ? { meddelande } : {}),
    };
  } else {
    return { ok: false, fel: {}, meddelande: FEL_ALLMANT };
  }

  if (Object.keys(fel).length > 0) {
    return { ok: false, fel, meddelande: FEL_FALT };
  }

  // Rate-limit räknar bara giltiga inskickningar (så en kund som rättar fel inte
  // straffas). Best-effort per instans — se lib/spam.ts.
  if (rateLimitad(await hamtaIp())) {
    return { ok: false, fel: {}, meddelande: FEL_RATE };
  }

  // Bilder (endast sälj) → mejlbilagor. Best-effort: en misslyckad bild eller
  // hela processningen får aldrig fälla leaden.
  let bilagor: Bilaga[] = [];
  if (lead.typ === "salj") {
    try {
      const filer = formData
        .getAll("bilder")
        .filter((x): x is File => x instanceof File);
      bilagor = await processaBilder(filer);
    } catch (err) {
      console.error("Bildprocessning misslyckades:", err);
    }
  }

  try {
    await skickaLead(lead, bilagor);
  } catch (err) {
    console.error("Lead misslyckades:", err);
    return { ok: false, fel: {}, meddelande: FEL_ALLMANT };
  }

  return {
    ok: true,
    fel: {},
    meddelande: "Tack! Vi har tagit emot din förfrågan och återkommer så snart vi kan.",
  };
}
