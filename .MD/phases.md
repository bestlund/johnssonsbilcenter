# Johnssons Bilcenter — Byggfaser (Build Phases)

> **Nuläge (2026-07-23):** Phase 0–1 klara, Phase 2–4 i praktiken genomförda
> (startsida med hero + slumpade bilkort, "Besök oss" med karta, omdömen, Simon,
> tjänster, FAQ, kontaktformulär, footer — allt i mörkt designsystem; widgeten på
> `/bilar` stylad via CSS-hack). Kvar: lås hero-variant, bygg ut undersidorna,
> deploy. **Full status, arkitektur och Nextlease-detaljer: se [STATE.md](STATE.md).**

## Ny inriktning (viktigt)

Det ursprungliga målet var att **ersätta både Framer och Nextlease** och publicera
bilannonser direkt mot Blockets API, med egen databas och admin-panel. Det är
**pausat** eftersom:

- **Blocket** svarar inte på begäran om API-token.
- **Car.info** kostar ~2000 kr/mån för 500 uppslag — för dyrt för regnr-autofyll.
- Handlaren använder redan **Nextlease**, som sköter bilregister *och* publicering
  till Blocket, och som erbjuder en **inbäddningsbar widget** för bilobjekten.

**Nuvarande mål:** flytta webbplatsen **bort från Framer** till en egen Next.js-sida
som **bäddar in Nextlease-widgeten**. Nextlease förblir hela backend:et — ingen egen
databas, inget Blocket-API, ingen admin-panel.

> Den gamla planen (Supabase + Blocket + admin) finns kvar i git-historiken och kan
> återupptas om Blocket-token blir tillgänglig och en billig regnr-källa hittas.

## Hur det hänger ihop

```
Handlaren  ──lägger upp bilar──►  Nextlease  ──publicerar──►  Blocket
                                     │
                                     ▼
                          embedded.js-widget
                                     │
                                     ▼
                 Vår Next.js-sida (bäddar in widgeten)
```

- Widgeten laddas via `https://embedded.nextlease.se/embedded.js` in i en
  `<div id="nextlease" data-uid="...">`. UID (nya sajtens config):
  `1fb18af2-7317-4074-811d-e3eef824a073`. (Gamla Framer-configen:
  `f8b9805f-…` — rör ej.)
- Widgeten renderar både listning och detaljvy (klient-SPA, egna typsnitt/CSS).
  Detaljvy nås via hash-route `#/details/{uid}` — våra egna bilkort länkar dit.

## Teknik

- **Next.js 16 (App Router) + TypeScript + Tailwind v4** — behålls från scaffoldet.
- **Vercel** — hosting (beslut om host kan tas vid deploy).
- Inget backend. Widgeten är ren klient-JS.

Varje fas: **Goal · Tasks · Deliverable · Verify**.

---

## Phase 0 — Scaffold & rensning ✅ (klar)

- **Goal:** Ett rent Next.js-skal utan de gamla backend-delarna.
- **Gjort:**
  - Next.js 16 + TS + Tailwind scaffoldat.
  - Borttaget: `app/api/`, `app/admin/`, `lib/supabase.ts`, `lib/blocket.ts`,
    `app/bilar/[id]/`, test-`index.html`, `@supabase/supabase-js`.
  - Env rensat till `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_NEXTLEASE_UID`.
- **Verify:** `npm run build` kompilerar rent.

---

## Phase 1 — Bädda in Nextlease-widgeten ✅ (klar, ska verifieras i webbläsare)

- **Goal:** Bilarna visas på `/bilar` via widgeten, i Next istället för test-HTML.
- **Tasks:**
  - `app/components/NextleaseWidget.tsx` — klientkomponent som laddar embed-scriptet
    och renderar `<div data-uid>` (redan gjort).
  - `/bilar` använder komponenten (redan gjort).
- **Verify (NÄSTA STEG):** `npm run dev` → öppna `/bilar` → bekräfta att bilarna
  laddar, att man kan klicka in på en enskild bil, och notera **hur** widgeten
  hanterar detaljvyn (samma URL/SPA eller egen URL). Det avgör om vi behöver en
  egen route eller inte.

---

## Phase 2 — Sidstruktur & navigation ✅ (i huvudsak klar)

- **Goal:** En riktig webbplats runt widgeten, fortfarande ostajlad.
- **Status:** Header + footer + startsidans sektioner byggda. Undersidorna
  (`/om-oss`, `/kontakt`, `/salj-din-bil` m.fl.) är länkade men saknar egna sidor
  än — se STATE.md §6.
- **Tasks:**
  - Gemensam layout i `app/layout.tsx`: header/nav + footer.
  - Sidor: `/` (start), `/bilar` (widget), `/om-oss`, `/kontakt` (justeras efter
    vad Framer-sidan har idag).
  - Startsidan: hero + **utvalda bilar** (om widgeten stödjer att begränsa antal —
    verifieras; annars en CTA-sektion som länkar till `/bilar`).
- **Deliverable:** Klickbar sajt med alla sidor, ostajlad.
- **Verify:** Navigera mellan alla sidor; widgeten fungerar även efter
  klient-navigering (fram och tillbaka till `/bilar`).

---

## Phase 3 — Innehåll & migrering från Framer ✅ (i huvudsak klar)

- **Status:** All copy migrerad från `content.md`. Bilder nedladdade, optimerade
  (WebP) och lokala i `public/bilder/` — Framer-CDN-beroendet borttaget. Riktiga
  loggan inlagd. Kvar: SEO-detaljer (sitemap/robots/OG), undersidornas innehåll.
- **Goal:** Allt innehåll från nuvarande Framer-sida finns i den nya sajten.
- **Tasks:**
  - Inventera Framer-sidan: texter, kontaktuppgifter, öppettider, bilder, logotyp.
  - Flytta över innehållet + bilder (använd `inspo bilder/` som referens).
  - SEO-grunder: sidtitlar, meta-beskrivningar, favicon, `sitemap`/`robots`.
- **Deliverable:** Funktionellt komplett sajt med rätt innehåll.
- **Verify:** Ingenting viktigt från Framer saknas.

---

## Phase 4 — Design ✅ (startsidan klar, iteration pågår)

- **Status:** Mörkt designsystem implementerat (se `design-system.md` +
  `app/globals.css`). Startsidans alla sektioner formgivna. Widgeten på `/bilar`
  stylad via CSS-hack (kort, filter, dropdowns, paginering). Kvar: finslip +
  designa undersidorna.
- **Goal:** Snygg, responsiv sajt som matchar varumärket.
- **Tasks:**
  - Formge start, `/bilar`, om-oss, kontakt utifrån `inspo bilder/`.
  - Se till att widgetens utseende harmonierar med sidans design (styla runt den;
    kolla vilka konfig-/stilmöjligheter Nextlease erbjuder).
  - Responsivt (mobil/desktop), tillgänglighet, prestanda.
- **Deliverable:** Designfärdig sajt.
- **Verify:** Visuell granskning på mobil + desktop.

---

## Phase 5 — Deploy & domän

- **Goal:** Sajten live på handlarens domän, Framer avvecklad.
- **Tasks:**
  - Deploy till Vercel (env-vars).
  - Peka domänen (`johnssonsbilcenter.se`?) till nya sajten.
  - Kontrollera att Nextlease-widgeten funkar på produktionsdomänen (ev. behöver
    domänen tillåtas hos Nextlease).
- **Deliverable:** Live sajt utan Framer.
- **Verify:** Bilarna laddar i produktion; alla sidor + domän fungerar.

---

## Öppna frågor / att verifiera — status

- **Detaljvy:** ✅ Löst — widgeten använder hash-route `#/details/{uid}` i sin SPA.
  Våra egna kort länkar till `/bilar#/details/{uid}`. Ingen egen route behövs.
- **Utvalda bilar:** ✅ Löst annorlunda — vi hämtar lagret via Nextlease-API:et och
  renderar **egna** kort (4 slumpade) på startsidan istället för att begränsa widgeten.
- **Domän hos Nextlease:** ❓ Kvar — verifiera vid deploy om produktionsdomänen
  behöver vitlistas.
- **Innehåll:** ✅ Inventerat i `content.md`. Övriga öppna punkter: se
  [STATE.md](STATE.md) §6.
