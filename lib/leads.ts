/**
 * Lead-kärna (M2). Bygger strukturerade mejl (ämnesprefix + plaintext + enkel
 * HTML-tabell) och levererar dem via Resends HTTP-API. Anropas endast från
 * server (Server Action) — läser hemliga env-variabler.
 *
 * Ämnesprefixen ([Kontakt]/[Förmedla]/[Sälj]) är avsiktligt stabila så att
 * Gmail-filter kan sortera automatiskt till etiketter.
 */

import {
  formateraRegnr,
  formateraTal,
  formateraTelefon,
} from "./leadvalidering";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type Lead =
  | {
      typ: "kontakt";
      fornamn: string;
      telefon: string;
      epost: string;
      arende: string;
    }
  | {
      typ: "formedling";
      regnr: string;
      miltal: string;
      telefon: string;
      epost?: string;
      meddelande?: string;
    }
  | {
      typ: "salj";
      regnr: string;
      miltal?: string;
      onskatPris?: string;
      telefon: string;
      namn?: string;
      epost?: string;
      meddelande?: string;
    };

type Rad = [etikett: string, varde: string];

/** Mejlbilaga (bild) — base64-innehåll, som Resends attachments-format. */
export type Bilaga = { filename: string; content: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Ämnesrad per leadtyp — prefixet driver Gmail-filtren. */
function byggAmne(lead: Lead): string {
  switch (lead.typ) {
    case "kontakt":
      return `[Kontakt] ${lead.fornamn} · ${formateraTelefon(lead.telefon)}`;
    case "formedling":
      return `[Förmedla] ${formateraRegnr(lead.regnr)} · ${formateraTelefon(lead.telefon)}`;
    case "salj":
      return `[Sälj] ${formateraRegnr(lead.regnr)} · ${formateraTelefon(lead.telefon)}`;
  }
}

/** Fält-för-fält-rader per leadtyp (tomma valfria fält utelämnas). */
function byggRader(lead: Lead): Rad[] {
  switch (lead.typ) {
    case "kontakt":
      return [
        ["Förnamn", lead.fornamn],
        ["Telefon", formateraTelefon(lead.telefon)],
        ["E-post", lead.epost],
        ["Ärende", lead.arende],
      ];
    case "formedling":
      return [
        ["Registreringsnummer", formateraRegnr(lead.regnr)],
        ["Miltal", `${formateraTal(lead.miltal)} mil`],
        ["Telefon", formateraTelefon(lead.telefon)],
        ...(lead.epost ? ([["E-post", lead.epost]] as Rad[]) : []),
        ...(lead.meddelande
          ? ([["Meddelande", lead.meddelande]] as Rad[])
          : []),
      ];
    case "salj":
      return [
        ["Registreringsnummer", formateraRegnr(lead.regnr)],
        ...(lead.miltal
          ? ([["Miltal", `${formateraTal(lead.miltal)} mil`]] as Rad[])
          : []),
        ...(lead.onskatPris
          ? ([["Önskat pris", `${formateraTal(lead.onskatPris)} kr`]] as Rad[])
          : []),
        ["Telefon", formateraTelefon(lead.telefon)],
        ...(lead.namn ? ([["Namn", lead.namn]] as Rad[]) : []),
        ...(lead.epost ? ([["E-post", lead.epost]] as Rad[]) : []),
        ...(lead.meddelande
          ? ([["Meddelande", lead.meddelande]] as Rad[])
          : []),
      ];
  }
}

const TITEL: Record<Lead["typ"], string> = {
  kontakt: "Nytt kontaktmeddelande",
  formedling: "Ny förmedlingsförfrågan",
  salj: "Ny säljförfrågan",
};

function byggMejl(lead: Lead): { subject: string; text: string; html: string } {
  const rader = byggRader(lead);
  const tid = new Date().toLocaleString("sv-SE", {
    timeZone: "Europe/Stockholm",
  });

  const text =
    `${TITEL[lead.typ]}\n\n` +
    rader.map(([e, v]) => `${e}: ${v}`).join("\n") +
    `\n\nMottaget: ${tid}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;color:#1c1f26;max-width:560px">
      <h2 style="margin:0 0 16px;font-size:18px">${TITEL[lead.typ]}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rader
          .map(
            ([e, v]) => `
          <tr>
            <td style="padding:8px 12px;border:1px solid #e6e3db;background:#faf9f6;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(
              e,
            )}</td>
            <td style="padding:8px 12px;border:1px solid #e6e3db;white-space:pre-wrap">${escapeHtml(
              v,
            )}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#8b909c">Mottaget: ${tid}</p>
    </div>`;

  return { subject: byggAmne(lead), text, html };
}

/** Kundens e-post (om angiven) → Reply-To så handlaren kan svara direkt. */
function kundEpost(lead: Lead): string | undefined {
  return lead.typ === "kontakt" ? lead.epost : lead.epost || undefined;
}

/**
 * Skickar leaden som mejl via Resend. Kastar vid saknad konfiguration eller
 * icke-2xx-svar så att Server Action kan visa ett felläge.
 */
export async function skickaLead(
  lead: Lead,
  bilagor: Bilaga[] = [],
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const till = process.env.LEAD_TILL;
  const fran = process.env.LEAD_FRAN;
  if (!key || !till || !fran) {
    throw new Error(
      "Lead-konfiguration saknas (RESEND_API_KEY/LEAD_TILL/LEAD_FRAN).",
    );
  }

  const { subject, text, html } = byggMejl(lead);
  const replyTo = kundEpost(lead);

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fran,
      to: [till],
      subject,
      text,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(bilagor.length ? { attachments: bilagor } : {}),
    }),
  });

  if (!res.ok) {
    const info = await res.text().catch(() => "");
    throw new Error(`Resend-fel ${res.status}: ${info}`);
  }
}
