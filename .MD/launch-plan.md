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
- [x] **P0** `/salj-din-bil` = **"Sälj bil"** (fokus: sälj till oss) — riktigt
  värderingsformulär byggt (förifylls från hero `?reg=&pris=&tel=`), leads via M2
- [ ] **P1** Tjänster-copy: bekräfta **riktiga** siffror/villkor med Simon (garantivillkor, finansiering)
- [x] **P2** Rensa död `app/components/Hero.tsx` — borttagen (+ HeroB/C/HeroValjare, `BilarILager`, oanvända bilder/lib-funktioner)

---

## Milstolpe 2 — Formulär & leads funkar (funktionalitet)  · **P0**
Idag skickas inget någonstans. **Beslut (2026-07-28):** ingen CRM nu (framtida
projekt) — leads ska landa i **Gmail** som strukturerade mejl.
- [x] **P0** Lead-leverans utan CRM — **Server Action** (`app/actions/leads.ts`,
  en generisk action med `formtyp`-diskriminator) skickar **strukturerat mejl via
  Resend** (`lib/leads.ts`, HTTP-API via fetch, inga beroenden). Detaljerad
  arbetslogg i [`m2-plan.md`](m2-plan.md). ⚠️ Kvar: **RESEND_API_KEY** från Jacob +
  skarp mottagaradress (env `LEAD_TILL`, test = `jv222ur@student.lnu.se`).
- [x] **P0** Enhetlig mejlmall — ämnesprefix per typ (`[Kontakt]`/`[Förmedla]`/
  `[Sälj]`) + plaintext + HTML-tabell, fält-för-fält (`lib/leads.ts`).
- [x] **P0** **Constraints/validering** — `lib/leadvalidering.ts` (regnr ABC12X/
  ABC123 + versaler/trim, telefon 0/+46, e-post, miltal), klient (kontrollerade
  fält + HTML-attribut) + server (auktoritativ omvalidering i action).
- [x] **P0** **Spam-skydd** — honeypot + min-ifyllnadstid (`dt`) + best-effort
  in-memory per-IP rate-limit (`lib/spam.ts`). *(Durabel/distribuerad rate-limit
  via Upstash = P2, bara om spam blir verkligt.)*
- [x] **P1** Bekräftelse-UX — tack-läge (ersätter formuläret), felläge (`aria-live`
  + röd fältmarkering), pending ("Skickar…").
- [ ] **P1** Auto-svar till kund — **uppskjutet till M6** (kräver verifierad
  Resend-domän för att nå riktiga kunder). Se minnesnotering `auto-svar-uppskjutet`.
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
- [x] **P1** Per-sida metadata + canonical + keyword-tunade titlar (titelmall i
  layout, `%s | Johnsson Bilcenter`). Sökord förankrade i konkurrent-SERP:ar
  (Helsingborg primärt, Skåne sekundärt).
- [x] **P1** OG-bild (1200×630) + favicon + apple-icon (`app/apple-icon.png`).
- [x] **P1** `sitemap.ts` + `robots.ts` — robots tillåter AI-crawlers, blockerar
  bara `/nextlease-embed`.
- [x] **P1** Strukturerad data — `AutoDealer`/`LocalBusiness` + `AggregateRating`
  (live Google-betyg) + `FAQPage` (`app/components/StruktureradData.tsx`, på
  startsidan). *(`Vehicle`-schema ej möjligt — bilarna ligger i Nextlease-iframen,
  ej crawlbara på egen domän; strukturellt tak, se llms.txt-noten.)*
- [x] **P2** AI-SEO: `llms.txt` (`public/llms.txt`) — ren summering + länkar.
  ⚠️ Ingen stor AI konsumerar den officiellt ännu; billig framtidsförsäkring.
- [x] **P1** 301-redirects — `next.config.ts` → `OMDIRIGERINGAR` (308). Alla
  indexerade gamla sidor (bekräftat via `site:`-sökning) mappade: Kontakta-oss,
  Om-oss, Boka-ett-möte, Sälj-din-bil, Våra-objekt, Förmedling, Integritets-policy,
  finansiering→/tjanster/finansiering, garanti→/tjanster/garanti,
  värdering→/salj-din-bil, hemleverans→/ (ingen motsvarighet). Båda skiftlägen.
  Hoppade: `varukorg` (gammal kundvagn, ingen ny motsvarighet).
- [ ] **P1** 🔒 **Vercel-env `NEXT_PUBLIC_SITE_URL`** = `https://www.johnssonsbilcenter.se`
  vid deploy (annars blir OG/canonical/sitemap fel domän). Central i `lib/site.ts`.
- [ ] **P2** Google Business Profile — verifiera/putsa (störst lokal hävstång, på Jacob).

---

## Milstolpe 5 — UX-polish  · **P1/P2**
- [x] **P0** Hero låst till A — HeroB, HeroC och `HeroValjare` **raderade**; startsidan statisk igen (ingen `?hero`)
- [x] **P1** Fix: ojämnt mellanrum/separator i hero-badgen — middot bytt mot centrerad rund prick
- [x] **P1** Mobil-nav (hamburger) — slide-in-drawer från vänster (logga, platt
  menylista, samlad kontakt i botten: telefon → öppettider → adress; scroll-lock,
  Esc/backdrop stänger, stänger vid sidbyte)
- [x] **P2** Navbar: adress med ikon (i utility-baren, klickbar → maps)
- [x] Navbar-dropdown-mönster på plats ("Sälj bil" → Sälj/Förmedla, CSS-only hover/focus)
- [x] Navbar utbyggd: **utility-bar** (adress→maps, öppettider, e-post; döljs mobil),
  **sticky huvudnav** (solid bg + underkant), **active state** per sida (usePathname)
- [ ] **P2** Ev. "Våra objekt"-dropdown med filter-genvägar + fler mikrointeraktioner
  (Jacob vill ha, omfattning ej spikad)
- [ ] **P2** Utmärkelse-/förtroende-badgar i footern (t.ex. `hero-2.webp`
  "Länets Framgångsbolag 2024", ev. MRF) — Jacob vill lägga dem där
- [x] **P2** Press-/klick-feedback (mikrointeraktioner) — enhetligt system i
  `globals.css`: knappar `scale(0.98)`, textlänkar `opacity`, ytor `.pressable`
  (white/5), kort `scale(0.99)`; tap-highlight av på touch + reduced-motion-guard.
  Applicerat på header, hero, bilkort, FAQ, footer, /bilar-filter.
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
