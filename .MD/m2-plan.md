# M2 — Formulär & leads (metodisk plan)

**Mål:** Alla formulär på sajten tar emot data, validerar den, och levererar ett
**strukturerat mejl** till en Gmail-inkorg. Ingen CRM. Byggs med **React Server
Actions** (bekräftat som rätt mönster i den här Next-versionens `forms.md`).

**Formulär som ska kopplas:**
1. **Kontakt** (`Kontaktformular.tsx`) — förnamn, telefon, e-post, ärende, samtycke.
2. **Förmedling** (`formedling/page.tsx`) — regnr, miltal, telefon, e-post.
3. **Sälj din bil** (`salj-din-bil` — byggs nytt) — regnr, önskat pris, miltal,
   telefon, ev. namn/e-post, samtycke. Förifylls från hero (`?reg=&pris=&tel=`).

**Arkitektur (röd tråd):** en delad kärna (`lib/`) + **en** generisk Server Action
med `formtyp`-diskriminator + återanvändbara klient-UI-delar. Inga one-offs.

> **Status 2026-08-01:** Del 0–6 byggda och bygget grönt. Filer: `lib/leads.ts`,
> `lib/leadvalidering.ts`, `lib/leadstate.ts`, `app/actions/leads.ts`,
> `app/components/form/{Faltfel,SkickaKnapp}.tsx`, kopplade `Kontaktformular.tsx`,
> `FormedlingFormular.tsx`, `SaljFormular.tsx` + `/salj-din-bil`. **Kvar innan
> live-test:** RESEND_API_KEY (Del 0) + skarp mottagare. Rate-limit & auto-svar = P1.

---

## Del 0 — Grund, beslut & miljö  · **P0**
- [ ] **Leveransmetod** (beslut): **Resend HTTP-API via `fetch`** (noll nya
  beroenden, funkar på Vercel). *Alternativ:* Gmail SMTP via nodemailer
  (app-lösenord) — skickar från själva Gmailen, kräver ingen domänverifiering.
- [ ] **Env-variabler** (server-only, inget `NEXT_PUBLIC_`):
  `RESEND_API_KEY`, `LEAD_TILL` (mottagare), `LEAD_FRAN` (avsändare).
  Uppdatera `.env.example` + `.env.local`.
- [ ] ⚠️ **Resend-caveat (viktig):** utan verifierad domän skickar Resend bara
  från `onboarding@resend.dev` och kan **bara leverera till Resend-kontots egen
  e-post**. För test → skapa kontot med `jv222ur@student.lnu.se` (eller verifiera
  domän i M3/M6). Skarp mottagare blir `Johnssonsbilcenter@gmail.com`.

## Del 1 — Delad kärna (`lib/`)  · **P0**
- [ ] `lib/leads.ts`
    - Typer per leadtyp (`Kontaktlead`, `Formedlingslead`, `Saljlead`).
    - `byggMejl(typ, data)` → **ämnesprefix** (`[Kontakt] …`, `[Förmedla] REGNR …`,
      `[Sälj] REGNR · tel`) + **plaintext** + **enkel HTML-tabell** (fält-för-fält).
    - `skickaLead(...)` → POST till Resend, felsäker (kastar tydligt vid fel).
    - Mottagare/avsändare från env.
- [ ] `lib/leadvalidering.ts` (dependency-fritt; zod som ev. alternativ)
    - `regnr` (svenskt `ABC12X` / `ABC123`, versaler, trimma), `telefon`
      (0/+46, siffror, längd), `epost`, `obligatorisk`, sanering.
    - Returnerar `{ ok, fel: Record<fält, meddelande> }`.

## Del 2 — Server Action  · **P0**
- [ ] `app/actions/leads.ts` (`'use server'`)
    - **En** action: `skickaLeadAction(prevState, formData)`.
    - Läser dolt `formtyp`-fält → validerar per typ (server = auktoritativ) →
      `byggMejl` → `skickaLead`.
    - **Spam:** honeypot-fält (dolt, måste vara tomt) + min-ifyllnadstid.
      (Riktig rate-limit = P1, kräver ev. extern store — noteras.)
    - Returnerar `{ ok, fel, meddelande }` för `useActionState`.

## Del 3 — Återanvändbar form-UI (klient)  · **P0**
- [ ] `app/components/form/Faltfel.tsx` — visar fältfel (`aria-live`).
- [ ] `app/components/form/SkickaKnapp.tsx` — `useFormStatus`, pending/disabled.
- [ ] Koppla formulären via `useActionState`:
    - `Kontaktformular.tsx` → klientkomponent kopplad till action (`formtyp=kontakt`).
    - Bryt ut `formedling`-formuläret till `FormedlingFormular.tsx` (`formtyp=formedling`).
    - Sälj-formuläret (Del 4).

## Del 4 — `/salj-din-bil` riktigt flöde  · **P0**
- [ ] Ersätt platshållaren med riktigt värderingsformulär (`SaljFormular.tsx`),
  förifyllt från `?reg=&pris=&tel=`. Behåll sidans copy/ram.

## Del 5 — Validering (klient + server)  · **P0**
- [ ] **Klient:** HTML-attribut (`required`, `type`, `pattern`, `maxLength`,
  `inputMode`) + regnr-versaler/trim, telefon-format.
- [ ] **Server:** omvalidera i action (auktoritativt) via `lib/leadvalidering`.

## Del 6 — Bekräftelse-UX  · **P0 (grund) / P1 (auto-svar)**
- [ ] Tack-läge (ersätter formuläret vid `ok`), fel-läge (`aria-live`),
  pending (disabled + text). 
- [ ] **P1:** auto-svar till kunden (noteras, ev. senare).

## Del 7 — Gmail-sortering (leverabel, ej kod)  · **P1**
- [ ] Dokumentera ämnesprefix → föreslagna Gmail-filter/etiketter
  (`[Kontakt]`, `[Förmedla]`, `[Sälj]`).

## Del 8 — Test & verifiering  · **P0**
- [ ] `npm run build` rent.
- [ ] Manuellt: varje formulär med giltig + ogiltig data, bekräfta mottaget mejl,
  honeypot, förifyllning från hero.

---

## Ordning (beroenden)
**Del 0 → 1 → 2** (kärnan) **→ 3** (koppla Kontakt + Förmedling) **→ 4** (Sälj) **→
5–6** (validering + UX, delvis parallellt med 3–4) **→ 7 → 8**.

## Kvar hos Jacob
- Skapa Resend-konto + API-nyckel (eller välj Gmail SMTP).
- Bekräfta skarp mottagaradress (trol. `Johnssonsbilcenter@gmail.com`).
