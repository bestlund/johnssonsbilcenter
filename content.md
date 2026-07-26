# content.md — Johnsson Bilcenter

**Källa:** Live-scrape av `johnssonsbilcenter.se` (Framer), utförd 2026-07-18
**Syfte:** Exakt textinnehåll per sida, insamlat för migrering Framer → Next.js. All copy nedan är hämtad ordagrant från den publicerade sajten om inget annat anges.
**Framer site-ID:** `ENc3FhswzdsPOSUXOiQHk`

### Statusflaggor som används i dokumentet
- ✅ Bekräftat innehåll, hämtat direkt från live-sidan
- ⚠️ Kvalitetsproblem på källsidan — läs anmärkningen innan du migrerar
- ❓ Innehåll som inte gick att fastställa fullt ut via statisk hämtning (JS-styrt) — verifiera live innan implementation

Fält i formulär markeras `*` = obligatoriskt enligt originalsajten.

---

## 0. Globala element (återkommer på alla sidor)

### 0.1 Huvudnavigation
| Etikett | Länk (Framer, original) |
|---|---|
| Logo/Hem | `/` |
| Tjänster | *(dropdown-rubrik, ej egen länk — innehåller sannolikt Finansiering/Garanti/Hemleverans, se avsnitt 7–9)* |
| Förmedling | `/Förmedling` |
| Våra objekt | `/Våra-objekt` |
| Sälj din bil | `/Sälj-din-bil` |
| Kontakta oss | `/Kontakta-oss` |
| Om oss | `/Om-oss` |

### 0.2 Kontaktuppgifter (visas i footer + kontaktsektioner)
- **Adress:** Florettgatan 8, 254 67 Helsingborg
- **Telefon:** 073-302 90 19 (skrivs `+46 73 302 90 19` på Kontakta oss-sidan)
- **E-post:** Johnssonsbilcenter@gmail.com

✅ **LÖST (2026-07-23):** **Florettgatan 8, 254 67 Helsingborg** är den korrekta adressen (bekräftad av handlaren). "Gevärsgatan 13" i gamla meta-descriptions var ett kvarglömt fragment och ska INTE användas. Kartan/vägbeskrivningen på nya sajten geokodar på adress­strängen (content.md:s koordinater pekade fel — på Bilkanalen AB/Gevärsgatan 13).

### 0.3 Öppettider
- Mån–fre: 10:00–18:00
- Lördag: 11:00–15:00
- Söndag: Endast bokad tid

### 0.4 Sociala länkar (från `/Kontakta-oss`)
- Instagram: `https://www.instagram.com/sjohnssonbilcenter/`
- Facebook: `https://www.facebook.com/profile.php?id=61555954300776`
- Blocket-butik: `https://www.blocket.se/butik/sjohnsson-bilcenter-ab`

### 0.5 Footer — länkstruktur
**Kolumn "Tjänster":**
| Etikett | Länk |
|---|---|
| Sälj din bil idag | `/Sälj-din-bil` |
| Värdera din bil | `/Sälj-din-bil` *(samma mål som ovan — duplicerad CTA till samma sida)* |
| Finansiering | `/Tjänster/finansiering` |
| Hemleverans | `/Tjänster/hemleverans` ⚠️ **trasig — se avsnitt 9** |

**Kolumn "Johnsson Bilcenter":**
- Våra objekt → `/Våra-objekt`
- Kontakta oss → `/Kontakta-oss`
- Om oss → `/Om-oss`
- Träffa grundaren → `/Om-oss#grundaren`

**Kolumn "Garantier och villkor":**
| Etikett | Länk | Status |
|---|---|---|
| Integritetspolicy | `/Integritets-policy/integritetspolicy` | ⚠️ TOM |
| Garantier | `/Tjänster/garanti` | ✅ |
| Konsumentköplagen | `/Integritets-policy/konsumentköplagen` | ⚠️ TOM |
| Varudeklaration | `/Integritets-policy/varudeklaration-vid-bilköp` | ⚠️ TOM |

Plus: adress, telefon, e-post, öppettider och "Boka ett möte här ->" upprepas i footer på varje sida.

---

## 1. Startsida — `/`

**SEO:** Title: "Johnsson Bilcenter - Bilfirma i Helsingborg" · Meta description: "Johnsson Bilcenter i Helsingborg, Berga säljer och köper begagnade bilar, men även byter och förmedlar begagnade bilar." · OG-bild: `https://framerusercontent.com/assets/DlWky9b6R07E9RbQtLLjZQPUs.png`

### 1.1 Hero
- **H1:** "Gör ett smart bilköp med Johnsson Bilcenter"
- Fyra värdeord (visas som kort/etiketter): **Omtanke · Service · Trygghet · Passion**
- CTA 1: "Fordon i lager" → `/Våra-objekt`
- CTA 2: "Boka ett möte idag" → `/Boka-ett-möte`

### 1.2 Fördelar (4 kort)
| Rubrik | Text |
|---|---|
| Lättare | Vi har förberett hela vårat företag för att det ska vara enkelt för dig. |
| Trygghet | Att köpa en bil av oss innebär att du har ett bra skyddsnät. |
| Varudeklaration | Innehåller information om bilens skick. Fås med vid varje affär. |
| Inbyte | Du kan lämna din gamla bil som en del av betalningen. |

### 1.3 Tjänstekort (karusell, 3 kort)
1. **Sälj din bil till oss!** — "Vi är experter på begagnade bilar och erbjuder rättvisa priser samt smidig hantering av pappersarbete. Byt även in din bil mot en annan modell med attraktiva inbytespriser." → CTA "Sälj din bil nu" → `/Sälj-din-bil`
2. **Finansiering** — "Få förmånlig finansiering genom ledande banker inom bilbranschen med oss! Vi gör det enkelt för dig att köpa din drömbil genom att erbjuda konkurrenskraftiga finansiella lösningar." → CTA "Läs mer här" → `/Tjänster/finansiering`
3. **Garanti** — "Vi erbjuder en trygg affär med vår trafiksäkerhetsgaranti från köpdatumet, gällande i två månader eller 2000 kilometer." → CTA "Läs mer här" → `/Tjänster/garanti`

⚠️ Garantitexten här ("två månader eller 2000 kilometer") skiljer sig från texten på själva `/Tjänster/garanti`-sidan ("6 till 24 månader") — se avsnitt 8.

### 1.4 Öppettider-sektion (mittblock)
Samma öppettider som 0.3, plus "Vägbeskrivning"-länk till Google Maps och CTA "Boka ett möte idag ->".

### 1.5 Kundomdömen
Se **Bilaga A — Kundomdömen** (samma 8 recensioner används här och på `/Sälj-din-bil`).

### 1.6 Grundaren-sektion
- Namn: **Simon Johnsson**
- Titel: Grundare & ägare
- Citat (kort variant): "Från en ung ålder har bilar varit min passion. Med åren har min vision att starta ett eget bilföretag vuxit starkare."
- CTA: "Läs mer om Simon" → `/Om-oss#grundaren`

### 1.7 FAQ
| Fråga | Svar |
|---|---|
| Hur kan jag veta om min bil är redo för försäljning eller inbyte? | Vi rekommenderar att du genomför en noggrann inspektion av din bil för att bedöma dess skick och värde. Du kan också kontakta oss för en kostnadsfri bedömning och rådgivning om försäljning eller inbyte. |
| Vad är fördelarna med att köpa en begagnad bil från S. Johnsson Bilcenter? | Vi erbjuder ett brett utbud av högkvalitativa begagnade bilar som har genomgått noggrann inspektion och reparation vid behov. Dessutom erbjuder vi konkurrenskraftiga priser och flexibel bilfinansiering för att göra bilköpet så enkelt och prisvärt som möjligt för våra kunder. |
| Vilka åtgärder bör jag vidta innan jag besöker er för att köpa en bil? | Innan ditt besök hos oss rekommenderar vi att du forskar om olika bilmodeller och priser, samt att du fastställer din budget och dina behov. Dessutom är det en bra idé att kontakta oss i förväg för att boka en provkörning och få personlig rådgivning baserat på dina önskemål och preferenser. |

### 1.8 Kontaktformulär — "Vi kontaktar dig!"
| Fält | Typ | Obligatorisk |
|---|---|---|
| Förnamn | text | ✔ |
| Telefonnummer | text | ✔ |
| E-post | email | ✔ |
| Ärende | textarea | ✔ |
| Samtycke | checkbox — "Jag samtycker till att Johnsson Bilcenter AB får spara och lagra mina uppgifter." | ✔ |

Knapp: "Skicka →" · Disclaimer under formuläret: "Vi delar inte din information med någon."

---

## 2. Om oss — `/Om-oss`

**SEO:** Title: "Om oss - Johnsson Bilcenter i Helsingborg" · Meta description: "Vi siktar på att bli Sveriges största märkesoberoende bilfirma. Hos oss får privatpersoner bästa möjligheten att köpa, sälja, byta och värdera sina begagnade bilar." *(+ "Gevärsgatan 13..." — se adressvarningen i 0.2)*

### 2.1 Innehåll
- USP-rad upprepas: Omtanke / Service / Trygghet / Passion
- **H2:** "Varför oss?"
  "Vi på Johnsson vet att det är avgörande att lyssna på våra kunders behov för att skapa så bra relationer som möjligt. Vår bilfirma har lång erfarenhet inom fordonshandel och med vår kunskap kan vi erbjuda pålitliga bilar som passar perfekt för varje kund."
- **H2:** "Vad vi erbjuder"
  "Vi prioriterar våra kunders unika behov genom att lyssna och erbjuda skräddarsydda lösningar. Med högkvalitativa begagnade bilar, flexibel finansiering och trygghet genom garantier och servicepaket gör vi bilköp till en smidig upplevelse."
  CTA: "Se våra objekt" → `/Våra-objekt`

### 2.2 Grundarsektion (anchor: `#grundaren`)
**H2:** "Träffa grundaren"

Fyra korta rubrikrader (visas troligen som separata highlight-textrader ovanför/kring huvudtexten):
- "Det är viktigt för mig att skapa en personlig bilköpsupplevelse för varje kund och vill att hela processen från början till slut är så trygg och säker för dig."
- "Med passion och engagemang strävar jag efter att erbjuda de mest tillförlitliga bilarna på svenska marknaden."
- "Efter att ha arbetat ett flertal år för stora aktörer i bilbranschen i olika priskategorier har jag samlat på mig en stor kunskap om branschen och dess utveckling mot framtiden."

Huvudtext (längre version än startsidans citat):
> "Från en ung ålder har bilar varit min passion. Med åren har min vision att starta ett eget bilföretag vuxit starkare. Efter att ha arbetat på stora aktörer inom bilbranschen och offrat mycket för att förverkliga min dröm är mitt mål nu att bli Sveriges största märkesoberoende bilhandlare. Med passion och engagemang strävar jag efter att erbjuda våra kunder den bästa möjliga upplevelsen och de mest tillförlitliga bilarna på marknaden."

---

## 3. Förmedling — `/Förmedling`

**SEO:** Title: "Johnsson Bilcenter AB - Bilfirma i Helsingborg" · Meta description: "Vi är en bilfirma i Helsingborg, Berga. Hos oss får privatpersoner möjlighet till Gratis Värdering och säkra bilaffärer. Besök vår webbplats och upptäck din nya bilhandlare idag."

### 3.1 Innehåll
- **H1:** "Förmedla din bil hos oss."
- Underrubrik (två varianter fanns i källan — ⚠️ flagga adressen igen): "Fyll i formuläret nedan så svarar vi så snabbt som möjligt. Du kan också besöka oss på Florettgatan 8 i Helsingborg!"

### 3.2 Formulär
| Fält | Typ | Obligatorisk |
|---|---|---|
| Namn | text | ✔ |
| E-post | email | — |
| Telefonnummer | text | ✔ |
| Registreringsnummer | text | ✔ |
| Mätarställning | text/number | ✔ |
| Övrig information om bilen | textarea | ✔ |

Knapp: "Skicka →"

---

## 4. Sälj din bil — `/Sälj-din-bil`

**SEO:** Title: "Sälj din bil idag på - Johnsson Bilcenter i Helsingborg" · Meta description: "Sugen på att sälja eller byta bil? Vi köper din bil på vår bilfirma i Helsingborg, Berga. Besök vår hemsida och fyll i formuläret så hjälper vi dig. Eller ring oss på 073-302 90 19"

### 4.1 Innehåll
- **H1:** "Dags att byta bil? Vi värderar den."
- Underrubrik: "Fyll i formuläret nedan så svarar vi så snabbt som möjligt."

### 4.2 Formulär (flerstegs — 3 steg enligt UI)
❓ Fälten Namn*, Telefonnummer*, E-post*, Önskat pris finns bekräftat, men exakt vilket fält som hör till vilket steg går inte att fastställa säkert från statisk HTML.

⚠️ Knapptext blandar svenska och engelska i källan: både **"Nästa->"** och **"Continue ->"** förekommer. Troligen ett kvarglömt Framer-standardvärde som aldrig översattes — bra tillfälle att städa upp vid migrering.

### 4.3 Kundomdömen
Samma innehåll som avsnitt 1.5 / Bilaga A.

---

## 5. Kontakta oss — `/Kontakta-oss`

**SEO:** Title: "Kontakta oss - Johnsson Bilcenter i Helsingborg" · Meta description: "Kontakta oss vid frågor angående din nya bil, våra begagnade bilar, tidsbokning eller annat. Ring oss på 073-302 90 19 eller besök vår hemsida. Vi har öppet Mån-fre 10:00-18:00 och Lördag 11:00-15:00."

### 5.1 Innehåll
- **H1:** "Har du frågor? Kontakta oss idag!" *(en textvariant i källan stavade "Kontaka" utan t — redigeringsrest, ignorera)*
- Underrubrik: "Fyll i formuläret nedan så svarar vi så snabbt som möjligt."

### 5.2 Formulär
| Fält | Typ | Obligatorisk |
|---|---|---|
| Telefonnummer | text | ✔ |
| Förnamn | text | ✔ |
| E-post | email | ✔ |
| Ärende | textarea | ✔ |
| Samtycke | checkbox — "Jag samtycker till att Johnsson Bilcenter AB får spara och lagra mina uppgifter." | ✔ |

Knapp: "Skicka →" · Disclaimer: "Vi delar inte din information med någon."

### 5.3 Övrigt på sidan
- Öppettider-block (samma som 0.3)
- "Vägbeskrivning"-länk (Google Maps)
- Telefon visas i fetstil: **+46 73 302 90 19**
- "Hitta oss på andra plattformar" — ikonlänkar till Instagram, Facebook, Blocket-butik (se 0.4)
- Inbäddad Google Maps-iframe: `https://maps.google.com/maps?q=56.07214605309034,12.712250425056157&z=15&output=embed`

---

## 6. Boka ett möte — `/Boka-ett-möte`

**SEO:** Title: "Boka möte idag - Johnsson Bilcenter i Helsingborg" · Meta description: "Boka ett möte med oss vid visning, provkörning, sälj eller köp av begagnade bilar. Besök vår hemsida och fyll i formuläret så hjälper vi dig. Eller ring oss på 073-302 90 19"

### 6.1 Innehåll
- **H1:** "Sugen på ny bil? Boka ett möte idag." *(alt-variant i källan: "Vill du träffa oss? Boka ett möte idag.")*
- Underrubrik: "Fyll i formuläret nedan så svarar vi så snabbt som möjligt."

### 6.2 Formulär (flerstegs)
**Steg 1:** Förnamn*, Telefonnummer*, E-post* → knapp "Nästa ->"
**Steg 2+:** ❓ Har en "Back"-knapp (bekräftar att fler steg finns) men fälten renderas via JS och syns inte i statisk HTML — verifiera live i Framer innan du bygger om formuläret.

---

## 7. Tjänster / Finansiering — `/Tjänster/finansiering`

**SEO:** Title: "Tjänster - Johnsson Bilcenter i Helsingborg" · Meta description: "Vi erbjuder Hemleverans, Gratis Värdering, Hemleverans, och vi tar gärna inbyten av din begagnade bil" *(⚠️ "Hemleverans" nämns två gånger — troligen en copy/paste-bugg i Framers SEO-fält, behöver inte återanvändas ordagrant)*

### 7.1 Innehåll
**H1:** "Finansiering hos Johnsson Bilcenter AB"

> "Vi erbjuder finansiering för alla våra fordon utan krav på kontantinsats, för belopp upp till 350 000 kronor.
>
> Vi förstår vikten av att hitta en betalningsplan som passar just din ekonomi, och därför anpassar vi oss efter din månadskostnad.
>
> För att göra bilköpet ännu mer bekymmersfritt erbjuder vi även en kostnadsfri prova-på-helförsäkring i samband med ditt köp. Vi strävar efter att göra bilägandet så enkelt och ekonomiskt fördelaktigt som möjligt för dig."

Länk i brödtext: "Kontakta oss" → `/Kontakta-oss`

---

## 8. Tjänster / Garanti — `/Tjänster/garanti`

**SEO:** samma metabeskrivningsmönster som Finansiering (troligen delad Framer-mall).

### 8.1 Innehåll
**H1:** "Garantier för dig"

> "För Varje fordon i vårt sortiment kan du teckna garantier som sträcker sig från 6 till 24 månader, beroende på bilens miltal och årsmodell. Vi förstår att köp av en bil är en betydande investering och att du som kund vill vara säker på att din bil är väl skyddad.
>
> Våra garantier ger dig möjlighet att välja den täckning som passar bäst för dina behov och ger dig extra sinnesfrid när du tar din nästa körning."

Länk i brödtext: "kontakta oss" → `/Kontakta-oss`

⚠️ Se anmärkning i avsnitt 1.3 — denna sidas garantivillkor (6–24 månader) matchar inte startsidans tjänstekort (2 månader/2000 km). Stäm av korrekt formulering med Simon.

---

## 9. Tjänster / Hemleverans — riktig URL: `/tjänster/värdering/hemleverans`

⚠️ **Trasig länk:** footern på *alla* sidor pekar till `/Tjänster/hemleverans`, men den faktiska publicerade sidan ligger på `/tjänster/värdering/hemleverans`. Bestäm om ni vill matcha länken (byt route-namn) eller fixa länken (uppdatera footer) vid migrering.

**SEO:** Title: "Hemleverans - Johnsson Bilcenter i Helsingborg" · Meta description: "Vi är en bilfirma i Helsingborg, Berga. Hos oss får privatpersoner möjlighet till Gratis Värdering och säkra bilaffärer. Besök vår webbplats och upptäck din nya bilhandlare idag."

### 9.1 Innehåll
**H1:** "Information om hur vi värderar din bil"

> "På Johnsson Bilcenter erbjuder vi professionell värdering av din bil för att underlätta din försäljnings- eller inbytesprocess. Vi förstår vikten av att få rätt värde för din bil, och vårt erfarna team är här för att hjälpa dig genom hela processen.
>
> Vår värderingstjänst är helt kostnadsfri och utgörs av professionella säljare. Vi tar hänsyn till faktorer som bilens märke, modell, ålder, skick och körsträcka för att fastställa dess värde på marknaden. Genom att använda bransch standarder och marknadsanalyser säkerställer vi att du får en rättvis och konkurrenskraftig värdering."

**H3:** "Sälj din bil - Gör ett Inbyte på din bil"

> "Hos oss på Johnssons Bilfirma tar vi även emot inbyte av begagnade bilar. Det innebär att om du planerar att köpa en ny bil från oss samtidigt som du säljer din befintliga bil, kan du dra nytta av ett smidigt inbyte.
>
> Vi förstår att det kan vara praktiskt att byta in din nuvarande bil när du uppgraderar till en nyare modell. Vårt mål är att göra hela processen så enkel och bekväm som möjligt för dig.
>
> Med vårt inbytesprogram kan du få ett rättvist och konkurrenskraftigt erbjudande för din befintliga bil, vilket gör det enklare för dig att göra affär med oss. Så varför inte överväga att inkludera din inbytesbil i din nästa bilaffär med oss?
>
> Vi ser fram emot att hjälpa dig att hitta din nya bil!
>
> Fyll i formuläret på "Sälj din bil", sen kontaktar vi dig så fort som möjligt. Vi ser fram emot att göra en bilaffär med dig!
>
> Om du har frågor kan du kontakta oss så svarar vi på alla dina frågor."

Länkar i brödtext: "Sälj din bil" → `/Sälj-din-bil`, "kontakta oss" → `/Kontakta-oss`

---

## 10. Våra objekt — `/Våra-objekt`

**SEO:** Title: "Våra objekt - Johnsson Bilcenter i Helsingborg" · Meta description: "Hitta din nästa bil hos Johnsson Bilcenter. Bläddra enkelt bland alla våra objekt. Köp online eller kolla vad det skulle kosta att finansiera bilen hos oss. Johnsson Bilcenter finns här för dig½" *(obs stray "½"-tecken i original — kosmetisk bugg, städa bort)*

### 10.1 Innehåll
Sidan har **inget statiskt textinnehåll** utöver nav/footer — allt drivs av Nextlease-widgeten (klientrenderad JS, syns inte vid statisk hämtning). Detta stämmer överens med tidigare research: Framers CMS innehåller ingen bildata, allt lager ligger i Nextlease.

**Teknisk referens (från tidigare avstämt arbete):**
- Script: `embedded.nextlease.se/embedded.js`
- Mount-point: `<div data-uid="f8b9805f-64ec-4705-91ad-889fd9d9eef5">`
- Ingen domänlåsning — fullt portabel, verifierad med Live Server

---

## 11. Juridiska sidor — ⚠️ TOMMA på live-sajten

Följande tre sidor är länkade i footern på varje sida, men innehåller **endast metadata, ingen synlig brödtext** vid hämtning:

| Sida | URL |
|---|---|
| Integritetspolicy | `/Integritets-policy/integritetspolicy` |
| Konsumentköplagen | `/Integritets-policy/konsumentköplagen` |
| Varudeklaration vid bilköp | `/Integritets-policy/varudeklaration-vid-bilköp` |

Alla tre använder `meta-viewport: width=1200` (avviker från `width=device-width` som alla andra sidor har) — tyder på att de aldrig färdigställts i Framer-mallen.

**Konsekvens för migreringen:** Det finns inget att migrera innehållsmässigt här. Eftersom kontaktformulären på sajten samlar in personuppgifter (namn, telefon, e-post) behövs sannolikt en riktig integritetspolicy av juridiska skäl (GDPR) — värt att lyfta med Simon som ett separat att-göra, inte något Claude Code kan generera korrekt på egen hand.

---

## Bilaga A — Kundomdömen (används på Startsida + Sälj din bil)

> **Riktigt Google-betyg (2026-07):** **4,9 · 61 omdömen** (Google). Mockupens
> "120+ · Google & Bytbil" var påhittat — använd de verkliga siffrorna. På nya
> sajten är betyget statiskt (två konstanter i `Omdomen.tsx`) och badgen länkar
> till Google. Live-betyg kräver Google Places API — se STATE.md §6.

| Namn | Recension |
|---|---|
| Sami | Hjärtligt tack till Johnsson Bilcenter som utöver att vara till stor hjälp vid bilköpet också var saklig och kommunikativ med åtgärder som uppstod i samband köpgarantin Rekommenderas! |
| Ali Mohammed | Aldrig varit med om något smidigare i mitt liv! Jätte trevlig kille. Hade rekommenderat att antagligen köpa en bil eller sälja sin egen bil till Johnsson Bilcenter AB om ni vill ha en lycklig affär! |
| Michael Andersson | Köpte inte för eget bruk utan hjälpte min far till ett nytt bilköp. Allt som berättades om bilen innan köp stämde perfekt. Väldigt ödmjuk och behjälplig säljare genom hela affären. |
| Christina Karlsson | *(samma text som Sami — dubblett i originalkällan)* |
| Håkan Lindbergh | Forden strejkade i kylan, ringde Simon och några timmar senare satt vi i en varm Yaris efter en enkelt genomförd affär som vi känner oss trygga med. Forden blev inbyte. Tack Simon! |
| Johan Lindelöw | Johnsson Bilcenter när du vill ha en smidig och trygg affär. Alltid snabb kommunikation och raka svar! *(länkad till Google Recensioner)* |
| Mathilde Sörensen | Trygg och smidig bilaffär där Simon även tog vår gamla bil i inbyte. Personligt och ärligt bemötande. Vi är mycket nöjda och rekommenderar varmt Johnssons Bilcenter. |
| Annika Sundström | Jag är nöjd med mitt bilköp. Simon svarade snabbt och tydligt på all kommunikation och bemötandet har varit gott under hela processen. |

---

## Bilaga B — Bildtillgångar (Framer CDN)

Alla bilder ligger på `framerusercontent.com` och behöver antingen laddas ner + rehostas (t.ex. Vercel/Supabase Storage) eller länkas direkt. Viktigaste förekomster:

- OG/delningsbild (global): `DlWky9b6R07E9RbQtLLjZQPUs.png`
- Hero-bilder startsida: `bFLEHNtdPybG3Bv5ZTYYfpAqM6Y.png`, `sVr8t0Wpc4J9YmKOKe0REA8Nc.png`, `56zdMYLFgGnQnXDCMfMpUKjE0sE.png`
- Nöjd kund-bilder: `SvZsD09R1MQknooDqwEAZ5lrZk.png`, `IO1TzqbHxROguQ6OpeOA4SdPnE.png`, `d0UIn889hzGvqNoZSrVlKtI5LM0.png`
- Tjänstekort: Sälj din bil `Ske8DxFyGyvPR60IRjXW7x9vgw.jpg`, Finansiering `cEWMbwrQjUHw9Lc4DqaLZsnjBJw.jpg`, Garanti `b9vAFWrzr19zv68ZsTJZ7f8R0UU.jpg`
- Grundarfoto: `FdS4NRWcbjAmXPmtwabX6WXRM0.jpg` (startsida), `yBT0wp5XUdny29z1Lod3X9cPqPE.jpg` (Om oss)
- Om oss — BMW 530: `5zzhwptkJzxiFqSojfn5qkrZAo.jpeg`, `G3tjNHN1pDgFK3PnD1PphBbcs.jpeg`
- Om oss — nöjd kund: `pxs3DXZ3MoWwI7IxdlAWKZ4E9P8.jpeg`

*(Bas-URL för samtliga: `https://framerusercontent.com/images/` respektive `/assets/`)*

---

## Bilaga C — Sammanfattning: åtgärdslista innan/under migrering

1. ✅ **Adress-konflikt LÖST:** Florettgatan 8, 254 67 Helsingborg gäller (bekräftat). Gevärsgatan 13 var fel. Se anmärkningen i 0.2.
2. **Trasig länk:** footer pekar på `/Tjänster/hemleverans`, verklig sida ligger på `/tjänster/värdering/hemleverans`. → Bestäm route-namn.
3. **Tomma juridiksidor:** Integritetspolicy, Konsumentköplagen, Varudeklaration har inget innehåll. → Behöver skrivas, sannolikt av Simon/jurist, inte gissas fram.
4. **Garantitext-konflikt:** "2 månader/2000 km" (startsidans kort) vs. "6–24 månader" (Garanti-sidan). → Fråga Simon vilken som gäller.
5. **Språkblandning i formulärknappar:** "Continue ->" (engelska) bredvid "Nästa->" (svenska) på Sälj din bil-formuläret. → Städa vid ombyggnad.
6. **Kosmetiskt tecken:** stray "½" i meta-description på Våra objekt. → Ta bort.
7. **Flerstegsformulär (Sälj din bil, Boka möte):** exakt fältfördelning per steg gick inte att fastställa 100 % från statisk HTML — kontrollera live i Framer-editorn eller webbläsarens devtools innan ni bygger de nya React-komponenterna.
