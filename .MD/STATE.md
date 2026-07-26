# STATE — Johnsson Bilcenter (handoff / projektstatus)

**Uppdaterad:** 2026-07-23
**Syfte:** Ett ställe som fångar det som INTE syns direkt i koden — arkitektur,
beslut, Nextlease-hackens hållpunkter, och öppna punkter. Läs den här först vid
ny session eller efter en context-compaction.

---

## 1. Vad vi bygger (arkitektur)

En **egen Next.js-webbplats** som ersätter handlarens gamla **Framer**-sajt.
Fordonslagret drivs av en inbäddad **Nextlease-widget** — Nextlease är kvar som
hela backend:et (bilregister + publicering till Blocket/Bytbil).

**Pausat (se `Project-plan.md`):** den ursprungliga planen att bygga eget
Blocket-API + Supabase + admin-panel. Blocket svarade aldrig på API-token, och
Nextlease sköter redan Blocket-publiceringen. Kan återupptas — koden för det finns
i git-historiken (togs bort i pivoten).

- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · deploy tänkt Vercel
- **Inget eget backend.** Ingen databas. Kontaktformuläret är mockup (ej kopplat).

---

## 2. Nextlease-integrationen (viktigast att förstå)

### Två UID (publiceringskonfigurationer)
| UID | Vad |
|---|---|
| `1fb18af2-7317-4074-811d-e3eef824a073` | **NYA sajtens config** — den vi bygger mot. Egna stilinställningar. |
| `f8b9805f-64ec-4705-91ad-889fd9d9eef5` | Gamla Framer-sajtens config. **Rör ej** — ändringar där påverkar live-sajten. |

UID:t ligger i `NEXT_PUBLIC_NEXTLEASE_UID` (env) + fallback i `lib/nextlease.ts`.
Skapades av handlaren via Nextlease admin → Webbplats → "Lägg till". Inställningar
är per-UID (separata), verifierat.

### Widgeten (på `/bilar`)
- Bäddas in via `https://embedded.nextlease.se/embedded.js`, monteras i
  `<div id="nextlease" data-uid=…>` (vanlig DOM, ingen shadow DOM).
- Widgeten blandar **TRE UI-bibliotek** — därför olika klasser för olika delar:
  - **Egna klasser** (`nextlease-*`) — korten, filtren
  - **PrimeVue** (`.p-*`) — dropdowns, checkboxar, sökruta
  - **Element Plus** (`.el-*`) — pagineringen

### Nextlease-API (odokumenterat, upptäckt i widgetens bundle)
- Lager: `GET https://api.nextlease.se/api/v1/export-vehicles/{uid}?pageSize=50`
  → `{ totalCount, items[] }`. Fält per bil: brand, model, modelDescription,
  modelYear, mileage, price, monthlyPrice, fuelType, gearBoxType, bodyType,
  registrationNumber, vehicleImage, vehicleImages[].
- Bilder: `https://dattd4s4rdse4.cloudfront.net/Vehicles/{900x600|320x210}/{id}`
  (endast dessa två storlekar verifierade).
- Klienten: `lib/nextlease.ts` (`hamtaFordon`, `hamtaSlumpadeFordon`, cachat 1h).
- **Risk:** odokumenterat API — kan sluta fungera utan förvarning. Vi har INTE
  frågat Nextlease om det är tillåtet (medvetet, låg prioritet — bilarna syns
  ändå via Blocket för SEO).

### CSS-hack mot widgeten (`app/globals.css`, scope `#nextlease`)
Vi stylar widgeten genom att skriva över dess klasser. **Bräckligt** — ändrar
Nextlease sin markup slutar det gälla tyst (syns som "ser fel ut igen").

| Hållpunkt | Vad | Stabilitet |
|---|---|---|
| `.nextlease-vehicle` (+ `__title`, `__model-description`, `__features`, `__prices`) | Bilkorten | Semantiska BEM — hyfsat stabila |
| `.nextlease-filters` | Filterkolumnen (flex-col) | Semantisk |
| `.yaer-filter` / `.price-filter` / `.mileage-filter` | Intervallfiltren (Modellår/Pris/Miltal). **OBS: "yaer" är felstavat i widgeten** | Semantiska |
| `.p-dropdown`, `.p-checkbox-box`, `.p-inputtext`, `.p-dropdown-panel` | PrimeVue-kontroller | Bibliotek — stabila |
| `.el-pagination`, `.el-pager li`, `.btn-prev/.btn-next` | Paginering (Element Plus) | Bibliotek — stabila |
| `--nextlease_*` (12 CSS-vars) | Widgetens tema-variabler | Vi överskriver bara **typsnitt** numera |

**Konkreta hack som ligger inne:** bild kant-till-kant (cover), textpadding,
mörk styling av PrimeVue-kontroller + Element Plus-paginering, hover-highlight,
och **omordning av intervallfiltren till toppen** via CSS `order`
(Sök → Modellår → Pris → Miltal → resten).

### Stilinställningar som görs i Nextlease admin (inte i kod)
Simon styr via ⚙-panelen (eller Admin → Webbplats): `Mörkt läge`, färger
(`colors.dark` osv.), radie, `images.mode` (contain/cover), filter på/av + ordning
(bara kryssrutefilter, INTE intervall), etikett-texter. Färg/typsnitt/radie som
vi tidigare CSS-överskrev är **återlämnade** till admin så Simon kan självbetjäna;
koden överskriver numera **bara typsnittet** (Hanken Grotesk), som panelen saknar.

---

## 3. Designsystem

**Auktoritativ spec:** `design-system.md`. **Implementation:** `app/globals.css` (`@theme`).
Mörkt läge är enda temat. Två typsnitt: **Hanken Grotesk** (rubriker/UI/brödtext)
+ **JetBrains Mono** (data: pris, miltal, telefon).

Tokens (utöver spec): `--color-amber: #fbbc04` (stjärnor, Googles guld),
`--color-highlight: #8c94a2` (gemensam hover-highlight — ändra på ETT ställe).

---

## 4. Sidstruktur (`app/page.tsx`)

Ordning: Header → **Hero** → BilarILager → **Besök oss** (Oppettider) → Omdömen →
Grundare (Simon) → Tjänster → FAQ → Kontaktformulär → Footer.

- **Hero: TILLFÄLLIG A/B/C-väljare** (`?hero=`, default `c`) via `HeroValjare`.
  **Favorit: A** (nu med C:s spacing). När valet låses: behåll en variant, ta bort
  de andra + väljaren + `searchParams` → sidan blir statisk igen.
- `BilarILager` visar **4 slumpade bilar** (`hamtaSlumpadeFordon(4)`), egna kort
  (`Bilkort`) i vårt designsystem, radie 6px, länkar till `/bilar#/details/{uid}`.
  Variant A har egna inline-kort och döljer BilarILager.
- **Omdömen:** kuraterade äkta recensioner (content.md Bilaga A). Betyg **statiskt**
  (4,9 · 61) — två konstanter i `Omdomen.tsx`. Badge + knapp länkar till Google.
- **`/bilar`:** bara widgeten (rubrik/beskrivning borttagna).
- **Kontaktformulär:** mockup, skickas inte.
- Ev. dött: `app/components/Hero.tsx` (gammal enkel-hero, ej importerad) — kan tas bort.

---

## 5. Innehåll & tillgångar

- **Adress (bekräftad):** Florettgatan 8, 254 67 Helsingborg. (Gevärsgatan 13 i
  gamla meta var FEL — löst.) Kartan/vägbeskrivningen geokodar på adress­strängen,
  inte koordinater (content.md:s koordinater pekade fel).
- **Bilder:** lokalt i `public/bilder/` (optimerade WebP, 29 MB → 2,9 MB). Riktiga
  loggan finns (`logo-johnsson-bilcenter-vit.webp`). Framer-CDN-beroendet borttaget.
- **Text:** all copy från `content.md` (skrapad Framer-sajt).

---

## 6. Öppna punkter / att göra

1. **Lås hero-variant** och ta bort väljaren + de andra varianterna.
2. **Places API** (om live-betyg önskas): aktivera "Places API (New)" i Google
   Cloud + fakturering + API-nyckel (server-side) + företagets Place ID. Ger live
   `rating`/`userRatingCount` (+ max 5 recensioner).
3. **Flytta projektet ur OneDrive** → fixar HMR permanent (se §7).
4. **Reda ut med Simon** (content.md Bilaga C): garantitext (2 mån/2000 km vs
   6–24 mån), tomma juridiksidor (GDPR — formulär samlar personuppgifter).
5. **Kontaktformulärets backend** (skickar inget än).
6. **Redirects** från gamla Framer-URL:er (`/Våra-objekt` → `/bilar`) om SEO-värde.
7. **Deploy** till Vercel + peka domänen (`johnssonsbilcenter.se`).
8. Bygg ut övriga sidor (`/salj-din-bil`, `/formedling`, `/om-oss`, `/kontakt`,
   `/boka-mote`, `/tjanster/*`) — länkas redan men saknar egna sidor.

---

## 7. Fallgropar

- **OneDrive bryter HMR.** Projektet ligger i en OneDrive-mapp; filsynken stör
  Turbopacks filbevakning → CSS-ändringar syns inte förrän dev-servern startas om.
  Tillfällig fix: `Ctrl+C` → `Remove-Item -Recurse -Force .next` → `npm run dev`.
  Permanent fix: flytta projektet till t.ex. `C:\dev\johnssonsbilcenter`.
- **Verifiera alltid mot dev-servern**, inte bara `npm run build` — de kompilerar
  separat.
- **Widget-hacken är bräckliga** (se §2). Håll dem scopeade till `#nextlease`.
