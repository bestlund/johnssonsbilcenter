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

## Kvar / att förtydliga
- [ ] Sälj-formulärets inmatningsfält snyggas till (vilka detaljer? spacing/plåt/höjd?)
- [ ] Bilduppladdning i formuläret + valfritt meddelande-fält
      → beslut: **A) mejlbilagor** (enkelt, ingen lagring) eller **B) Vercel Blob** (rek. för bilfoton)
- [ ] "LLMs.html" — vad menas? (vi har `llms.txt`)

## Noteringar
- Ingen databas behövs. Bilder = fillagring (Blob), inte DB. Valfritt meddelande = bara ett fält i mejlet.
