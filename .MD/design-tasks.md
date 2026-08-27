# Design & feature-punchlista (post-launch polish)

Från Jacobs notes 2026-08-27. `[ ]` kvar · `[x]` klart · `[~]` pågår.

## Batch 1 — hero, nav, homepage-flöde + bugfix  ✅
- [x] Ta bort pil på "Skicka" (kontaktformuläret)
- [x] Ta bort "Byta bil" helt (hero-underlänk) + ur launch-planen
- [x] Hero-rubrik: ta bort italic på "smart" (samma typsnitt)
- [x] Hero-brödtext: ny charmig, välkomnande text; bort med "varudeklaration"; väver in värdeord
- [x] Flytta FAQ under Simons intro (Grundare) på startsidan
- [x] Fixa "Sälj bil"-dropdownen — vänsterställd under triggern, jämn padding
- [x] **BUGG:** `/om-oss` redirect-loop (next.config-redirect matchade skiftlägesokänsligt
      → `/Om-oss`→`/om-oss` fångade även korrekta /om-oss). Fixat: rensade
      versaldubbletter, la `/Om-oss` i `proxy.ts` (skiftlägeskänslig). ⚠️ **kräver deploy**

## Batch 2 — footer + till toppen  ✅ (deployad)
- [x] Footer-redesign: större, nav-estetik (cobalt-ikoner), alla länkar,
      org.nr 559387-0537, klickbar adress → Maps, tagline
- [x] "Till toppen"-knapp (`TillToppen.tsx`, global): cirkel + pil upp, nere till
      höger, tonar in vid scroll, mjuk scroll

## Batch 3 — laddning  ✅ (byggd)
- [x] Skeleton-system: `.skelett` shimmer (globals) + `Skelett.tsx`
      (Skelett/BilkortSkelett/Grid), reduced-motion-säker
- [x] `/objekt`: skeleton-rutnät tills Nextlease-iframen laddat
- [x] `/bilar/loading.tsx`: helsidesskelett (sidebar + toppbar + kort-rutnät)
- Startsidan är statisk (instant) → inget skelett behövs där

## Batch 4 — formulär: formatering + bilder + meddelande  ✅ (byggd)
- [x] Auto-formatering av inmatningsfält (live + i mejlet): regnr `ABC 12X`,
      pris/miltal `185 000`, telefon `070-199 06 00` (`lib/leadvalidering.ts`)
- [x] Bilduppladdning i sälj-formuläret — **mejlbilagor** (GDPR-val, ej Blob):
      klient komprimerar + orienterar + strippar EXIF (canvas), server re-processar
      med sharp (auktoritativ EXIF-strip + resize) → bifogas lead-mejlet.
      `bodySizeLimit: 6mb`, max 6 bilder, felsäkert.
- [x] Valfritt meddelande-fält (sälj)

## Batch 5 — llms.html  ✅ (byggd)
- [x] AI/sökmotor-faktasida à la Riddermark: `app/llms/page.tsx` med live-data
      (Google-betyg + antal bilar), servad på `/llms.html` via rewrite, länkad
      "llms" i footern, med i sitemap.

## Kvar / att förtydliga
- [ ] Ev. bilder även i förmedlings-formuläret (bara sälj nu)

## Noteringar
- **GDPR-beslut:** bilder = mejlbilagor, INGEN molnlagring (Blob). EXIF/GPS strippas
  klient + server. Data finns bara i Simons inkorg (dataminimering, ett färre biträde).
- Integritetspolicyn bör täcka bild-/uppgiftsinsamling + lagringstid (juridisk granskning före launch).
