# Launch-plan — Johnsson Bilcenter (väg till publicering)

**Skapad:** 2026-07-28
**Syfte:** Den *arbetande* punch-listan från nuläge till live sajt. Milstolpar →
delmål (bockas av) → huvudmål. Kompletterar (ersätter inte) `STATE.md`
(arkitektur/beslut) och `phases.md`/`Project-plan.md` (historik).

**Legend:** `[ ]` kvar · `[x]` klart · **P0** = launch-blockerare · **P1** =
bör vara med till launch · **P2** = efter launch / nice-to-have ·
🔒 = beslut/uppgift behövs från Jacob · 🔗 = beroende på extern part.

---

## 🎯 Huvudmål
En publicerad, användbar sajt på **johnssonsbilcenter.se** som ersätter Framer —
inga döda länkar, formulär som faktiskt tar emot leads, live-data, korrekt SEO.

**Hero-beslut:** Variant **A** är default. B/C behålls i koden för framtida
A/B-test, men väljaren (`HeroValjare`) får inte synas i produktion.

---

## Milstolpe 0 — Klart hittills (progress)
Från dina notes + arbetet den här veckan:
- [x] Automatisk uppdatering av bilar på framsidan
- [x] Ta bort pills
- [x] Byt plats: "Allt du behöver för en trygg affär" ↔ karta/vägbeskrivning
- [x] Enhetlighet på objektkort (radius)
- [x] Google reviews i hero
- [x] Google Places API (New) inkopplat (live betyg/recensioner)
- [x] /bilar: egen browse (sidebar + topbar), datadrivna filter, "antal bilar i lager"
- [x] "Läs mer" i kort → tydligare
- [x] "Köpa bil": dynamiskt antal bilar (ej statiskt)
- [x] Filter- och hero-hopp (layout shift) åtgärdat
- [x] Hero-widget: Köpa/Sälja-flikar
- [x] Navbar omgjord (spacing, telefon, ren)

---

## Milstolpe 1 — Inga döda länkar (sidor & innehåll)  · **P0**
Länkar i nav/footer/kort pekar idag på sidor som ger 404.
- [x] **P0** `/om-oss` (+ ankare `#grundaren`) — byggd med Framer-copy (Varför oss / Vad vi erbjuder / Träffa grundaren)
- [x] **P0** `/kontakt` — samlad kontakt-hub (telefon, sociala, öppettider+karta, formulär). Vital info kvar på startsidan.
- [x] **P0** `/formedling` = **"Förmedla din bil"** — berikad (så går det till,
  fördelar, pris + "detta ingår", formulär). Egen copy inspirerad av JBA Motor.
  ⚠️ Prismodell/avgifter = platshållare tills Simon bekräftar.
- [x] **P0** **Sälj/Förmedla uppdelat i två sidor** + nav: "Sälj bil" som primärt
  val med **dropdown** (Sälj din bil till oss / Förmedla din bil). *(Beslut 2026-07-28)*
- [x] **P1** `/tjanster/finansiering` — byggd med Framer-copy (350 000 kr, prova-på-helförsäkring)
- [x] **P1** `/tjanster/garanti` — byggd med Framer-copy (6–24 mån) — ⚠️ villkor ska stämmas av med Simon (2 mån/2000 km på startsidans kort krockar)
- [x] **P0** **Integritetspolicy/GDPR-sida** — utkast byggt + länkad i footer.
  ⚠️ **Lagkrav** (formulär samlar personuppgifter) → måste **finslipas/granskas
  juridiskt före launch** (org.nr, kontaktmejl, lagringstider, biträden). Senare skede.
- [x] Hero-underlänk "Sälj via förmedling" → `/formedling` (var död knapp, nu länk)
- [ ] **P1** "Byta bil" (hero-underlänk) — 🔒 eget mål? (Jacob kollar med Simon + research)
- [ ] **P0** `/salj-din-bil` = **"Sälj bil"** (fokus: sälj till oss) — idag stub;
  riktigt värderingsflöde byggs i M2
- [ ] **P1** Tjänster-copy: bekräfta **riktiga** siffror/villkor med Simon (garantivillkor, finansiering)
- [ ] **P2** Rensa död `app/components/Hero.tsx` (ej importerad) — 🔒 bekräfta borttag

---

## Milstolpe 2 — Formulär & leads funkar (funktionalitet)  · **P0**
Idag skickas inget någonstans. **Beslut (2026-07-28):** ingen CRM nu (framtida
projekt) — leads ska landa i **Gmail** som strukturerade mejl.
- [ ] **P0** Lead-leverans utan CRM: en **server-side route/Server Action** (Vercel)
  tar emot POST, validerar, och skickar **strukturerat mejl till Gmail-inkorgen**.
  Avsändartjänst: rek. **Resend** (gratis-tier räcker; pålitlig leverans på Vercel).
  Alt: Gmail SMTP via app-lösenord (skickar *från* Gmail) eller Formspree/Web3Forms.
  **Test-mottagare (tills Simons adress):** `jv222ur@student.lnu.se`.
  **Publik kontaktmejl (visas på /kontakt):** `Johnssonsbilcenter@gmail.com` —
  trolig skarp lead-mottagare.
- [ ] **P0** Enhetlig mejlmall (systematisk, lättläst, felsäker):
    - Ämnesprefix per formtyp → Gmail-**filter + etiketter** sorterar automatiskt
      (t.ex. `[Sälj] ABC12X · 073-…`, `[Kontakt] Namn · ämne`)
    - Tydlig fält-för-fält-body (regnr, önskat pris, telefon, tid, källsida) —
      både plaintext + enkel HTML-tabell
- [ ] **P0** **Constraints/validering på inputfält** *(ny note Jacob)* — klient + server:
    - **Regnr:** svenskt format (ABC12X / ABC123), versaler, trimma mellanslag, maxLength
    - **Telefon:** +46/0-hantering, endast siffror, längd-validering (ev. riktnummer-väljare)
    - Obligatoriska fält, honeypot + enkel rate-limit mot spam, server-side omvalidering
- [ ] **P1** Bekräftelse-UX (tack-/felläge) + ev. auto-svar till kund
- [x] **Regnr i hero:** "Köpa bil" prioriteras som nu — ingen omprioritering *(beslut)*
- [ ] **P1** Regnr → fordonsdata-autofyll vid "sälj din bil" — 🔗 beror på
  Nextlease-svar / alternativ källa (Car.info ~2000 kr/mån = dyrt). Utan detta:
  behåll manuellt regnr-fält.
- [ ] **P2** 🔒 Startsidans kontaktformulär — kan ev. slopas (oklart) — beslut senare

---

## Milstolpe 3 — Integrationer, nycklar & miljö  · **P0**
- [ ] **P0** Byt DEMO Places-nyckel → **produktionsnyckel** med restriktioner
  (HTTP-referrer/IP), billing aktiverat + budget-alert
- [ ] **P0** Env-variabler för prod: audit alla, säkerställ att inga hemligheter
  ligger i klient (`NEXT_PUBLIC_*`)
- [ ] **P1** Nextlease officiell/dokumenterad API-åtkomst — 🔗 (mejlutkast finns)
- [ ] **P2** 🔒 "Fler APIer?" — lista & besluta (regnr-källa, kartor, analytics …)

---

## Milstolpe 4 — SEO & discoverability  · **P1**
- [ ] **P1** Per-sida metadata (title/description) + canonical
- [ ] **P1** OG-bilder + favicon
- [ ] **P1** `sitemap.xml` + `robots.txt`
- [ ] **P1** Strukturerad data (schema.org: AutoDealer/LocalBusiness, Vehicle,
  AggregateRating från Google-betyget)
- [ ] **P2** AI-SEO: `llms.txt` (ev. `llms-full.txt`)
- [ ] **P1** 301-redirects från gamla Framer-URL:er (t.ex. `/Våra-objekt` → `/bilar`)

---

## Milstolpe 5 — UX-polish  · **P1/P2**
- [x] **P0** Hero låst till A — HeroB, HeroC och `HeroValjare` **raderade**; startsidan statisk igen (ingen `?hero`)
- [x] **P1** Fix: ojämnt mellanrum/separator i hero-badgen — middot bytt mot centrerad rund prick
- [ ] **P1** Mobil-nav (hamburger) — saknas
- [ ] **P2** Navbar: adress med ikon
- [x] Navbar-dropdown-mönster på plats ("Sälj bil" → Sälj/Förmedla, CSS-only hover/focus)
- [ ] **P2** Ev. "Våra objekt"-dropdown med filter-genvägar + fler mikrointeraktioner
  (Jacob vill ha, omfattning ej spikad)
- [ ] **P2** Utmärkelse-/förtroende-badgar i footern (t.ex. `hero-2.webp`
  "Länets Framgångsbolag 2024", ev. MRF) — Jacob vill lägga dem där
- [ ] **P2** Skeleton loaders + laddningsanimationer (bilkort, widget)
- [ ] **P2** Chatbot (AI eller statisk) — Jacob: "najs att ha", efter launch

---

## Milstolpe 6 — Pre-launch & deploy  · **P0**
- [ ] **P1** Flytta projektet ur OneDrive (fixar HMR permanent) — dev-hälsa
- [ ] **P0** Deploy till Vercel (env-vars satta)
- [ ] **P0** Peka domän `johnssonsbilcenter.se`; 🔗 vitlista prod-domän hos Nextlease vid behov
- [ ] **P1** Prestanda (Lighthouse), tillgänglighet (a11y), responsiv QA mobil+desktop
- [ ] **P1** Snygg 404-sida
- [ ] **P2** Analytics (val: Plausible/GA4) + ev. cookie/consent
- [ ] **P0** Slut-QA: alla länkar klickas, alla formulär testas skarpt

---

## Beslut — status
1. ✅ **Kontakt:** egen `/kontakt`-hub + vital info kvar på startsidan.
2. ✅ **Lead-mottagning:** ingen CRM nu → strukturerade mejl till Gmail (se M2).
   Kvar att ge: **vilken/vilka Gmail-adress(er)** leads ska till.
3. ⏳ **Tjänster-fakta:** Jacob kollar med Simon (ev. lista samarbetsbolag).
4. ⏳ **"Byta bil":** Jacob kollar med Simon + researchar andra bilfirmors flöden.
5. ✅ **Regnr i hero:** "Köpa bil" prioriteras som nu — ingen ändring.
6. ✅ **Chatbot:** ja, efter launch (P2). **Nav:** dropdown på Våra objekt +
   mikrointeraktioner (omfattning ej spikad).

**Öppet:** startsidans kontaktformulär kan ev. slopas (Jacob osäker).

## 🔗 Externa beroenden (blockerare)
- **Nextlease-svar** om API + regnr-uppslag → gate för M2-autofyll och M3-officiell API.
- **Simon (handlaren):** riktiga tjänste-/garantifakta, ev. GDPR-text.
- **Domän/DNS-åtkomst** för deploy (M6).

---

## Föreslagen ordning (kritisk väg)
**M1 (sidor) → M2 (formulär) → M3 (nycklar) → M6 (deploy)** är den hårda
launch-linjen. **M4 (SEO)** och **M5-polish** kan köras parallellt och delvis
efter launch, men M4:s metadata/redirects bör vara på plats till go-live.
