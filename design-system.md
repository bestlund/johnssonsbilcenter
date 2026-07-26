# design-system.md — Johnsson Bilcenter

**Status:** v1, godkänd grund + komponentnivå
**Companion-fil:** `design-system.html` — visuell referens, öppna den sida vid sida med det här dokumentet
**Tema:** Dark mode är det enda temat (ingen ljus variant / ingen växlare)

## Riktning (kort)
Delvis nytt system, byggt på nuvarande sajts blåa grundfärg men förfinat och systematiserat. Känsla: personlig & varm + pålitlig & professionell (i den prioritetsordningen). Rundat men subtilt — inget lekfullt/"mjukt" som tar över, tonen ska läsas som seriös.

---

## 1. Färger

Alla värden nedan som CSS-variabler, redo att klistras in i `globals.css`:

```css
:root {
  /* Ytor */
  --surface-page: #12141A;      /* Midnight — sidbakgrund */
  --surface-card: #1A1D24;      /* Coal — kort, fält, nav */
  --surface-elevated: #242832;  /* Iron — hover, bildplatshållare */
  --border: #333947;            /* Ash — default kantlinje */
  --border-strong: #454C5C;     /* hover/emphasis kantlinje */

  /* Text */
  --text-primary: #F2F0EA;      /* Linen — varmvit, ej ren vit */
  --text-secondary: #A8AEBA;    /* Mist */
  --text-muted: #6B7280;        /* Fog — placeholder, hjälptext */

  /* Primär — Cobalt */
  --primary-400: #7BA3FF;       /* länkar, hover */
  --primary-500: #4A85FF;       /* primär knapp */
  --primary-600: #2E63E0;       /* aktivt/nedtryckt */
  --primary-700: #1E48AD;       /* djup accent, sparsam användning */
  --primary-tint: rgba(74,133,255,0.12);

  /* Semantiska */
  --success: #34C77B;
  --warning: #F0B429;
  --danger: #EF5A5A;
  --success-tint: rgba(52,199,123,0.12);
  --warning-tint: rgba(240,180,41,0.12);
  --danger-tint: rgba(239,90,90,0.12);

  /* Tillagda under implementationen */
  --amber: #FBBC04;      /* stjärnbetyg (Googles guldgula) */
  --highlight: #8C94A2;  /* gemensam hover-highlight (fog några shades ljusare) */
}
```

> **Implementation:** tokens finns i `app/globals.css` (`@theme`) med prefixet
> `--color-*` (Tailwind v4), t.ex. `--color-cobalt-500`, `--color-amber`,
> `--color-highlight`. Ändra där → slår igenom överallt. `--highlight` används på
> ALLA hover-outlines (kort + sekundära knappar); ändra på ett ställe.

**Kontrast:** Linen (#F2F0EA) på Midnight (#12141A) ≈ 15.8:1, Mist (#A8AEBA) på Midnight ≈ 8.1:1, Cobalt 500 som textfärg på Midnight ≈ 4.6:1 — alla klarar WCAG AA för normal text. Cobalt 500 som knappyta använder mörk text (`#0B0D11`) ovanpå, inte tvärtom — se knappsektionen.

### 1.1 Ljus yta (temaundantag)

Sajten är dark-only, men **enstaka utvalda sektioner** får gå ljusa för rytm/kontrast (först använt på omdömessektionen). Det är ett **medvetet undantag**, inte en ljus temavariant — använd sparsamt. En egen varm palett speglar den mörka inverterat så det inte skär sig mot linen-tonen:

```css
--color-cream: #FAF9F6;      /* varmvit sektionsyta */
--color-cream-card: #FFFFFF; /* kort på ljus yta */
--color-cream-line: #E6E3DB; /* varm ljus kant */
--color-ink: #1C1F26;        /* primär text på ljust */
--color-ink-soft: #5A616E;   /* sekundär text */
--color-ink-muted: #8B909C;  /* dämpad text */
```

**Regler:**
- Wrappa sektionen i `.section-light` (full bredd, sätter yta + `--color-ink` som standardtext) och lägg `.shell` *inuti* för innehållsbredd — bakgrunden ska gå kant-till-kant, innehållet inte.
- Text: `ink` (primär) / `ink-soft` (sekundär) / `ink-muted` (dämpad). Kort: `bg-cream-card` + `border-cream-line`.
- Accentfärg blir **cobalt-600** (#2E63E0) på ljust — cobalt-400 har för svag kontrast mot vitt.
- `amber`-stjärnorna behålls oförändrade (Googles guld funkar på både mörkt och ljust).
- `.btn-secondary` inverterar automatiskt inuti `.section-light` — ingen extra klass behövs.
- Kontrast: ink (#1C1F26) på cream (#FAF9F6) ≈ 15:1, ink-soft ≈ 6.4:1, cobalt-600 ≈ 5.2:1 — alla klarar AA.

**Mörkt kort i ljus sektion:** för att skapa fokus kan ett enskilt kort behållas mörkt (`bg-card` + `text-linen`, avatar/accent i cobalt-**400**) mitt i en ljus sektion — se omdömessektionens utvalda citat. Kontrast-inversion inuti inversionen; använd för max ETT element per sektion.

### 1.2 Hörn-ram (`.frame`)

Återanvändbar "blueprint"-accent: fyra cobalt L-hörn som ramar in en sektion (först på omdömessektionen). Ritas med rena `background`-gradienter i `.frame` (`globals.css`) — inga extra DOM-element. Lägg klassen på valfri sektion; den rör bara `background-image`, så `.section-light` (background-**color**) lever kvar under. Justerbar via CSS-variabler: `--frame-color` (default cobalt-500), `--frame-arm` (28px), `--frame-thick` (2px), `--frame-inset` (16px).

---

## 2. Typografi

- **Rubriker + UI + brödtext:** Hanken Grotesk (400/500/600/700) — nordiskt ursprung, bra å/ä/ö-stöd, proffsig utan att kännas kall.
- **Siffror/data:** JetBrains Mono (400/500) — pris, miltal, årsmodell, registreringsnummer, telefonnummer. Valfritt att hoppa över om det känns onödigt; funkar fint med bara Hanken Grotesk överallt också.

Next.js-implementation (via `next/font/google`, inget CDN-beroende):
```ts
import { Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'

const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-ui' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono' })
```

### Skala

| Roll | Storlek | Vikt | Line-height | Letter-spacing |
|---|---|---|---|---|
| H1 | 40px / 2.5rem | 700 | 1.15 | -0.02em |
| H2 | 32px / 2rem | 700 | 1.2 | -0.015em |
| H3 | 24px / 1.5rem | 600 | 1.25 | -0.01em |
| H4 | 20px / 1.25rem | 600 | 1.3 | -0.005em |
| Body Large | 18px / 1.125rem | 400 | 1.6 | 0 |
| Body | 16px / 1rem | 400 | 1.6 | 0 |
| Small | 14px / 0.875rem | 400 | 1.5 | 0.005em |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.03em, VERSALER |
| Mono/data | 16–20px | 400–500 | 1.4 | 0 |

---

## 3. Spacing

4px-baserad skala:

```css
--sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
--sp-6: 24px;  --sp-8: 32px;  --sp-12: 48px; --sp-16: 64px;
```

## 4. Radie

```css
--radius-sm: 4px;   /* checkboxar, badges, taggar */
--radius-md: 8px;   /* knappar, fält, mindre kort */
--radius-lg: 12px;  /* stora kort, bilder, sektioner, modaler */
```

## 5. Rörelse

```css
--transition-fast: 150ms ease;   /* hover, focus, accordion-ikon */
```
Håll det till detta enda värde. Ingen anledning att variera övergångstider över komponenter på en sajt av den här typen — konsekvens > variation.

## 6. Brytpunkter

Inga specialbehov identifierade, standardvärden föreslås (Tailwind-default, ändra om något annat behövs):
```
sm 640px · md 768px · lg 1024px · xl 1280px · 2xl 1536px
```

---

## 7. Komponenter

### 7.1 Knappar

| Variant | State | Bakgrund | Text | Border |
|---|---|---|---|---|
| Primary | Default | `--primary-500` | `#0B0D11` | — |
| Primary | Hover | `--primary-400` | `#0B0D11` | — |
| Primary | Aktiv | `--primary-600` | `--text-primary` | — |
| Primary | Inaktiv | `--surface-elevated` | `--text-muted` | — |
| Secondary | Default | transparent | `--text-primary` | 1px `--border-strong` |
| Ghost/text | Default | transparent | `--primary-400` | — |

Radie: `--radius-md`. Padding: `10px 18px`. Font: 14px/600. Övergång: `--transition-fast` på bakgrund.

Regel: max en primary-knapp synlig åt gången per vy/sektion — resten blir secondary eller ghost. (Samma restriktion som beprövad praxis: en tydlig huvudhandling per skärm, allt annat är sekundärt.)

### 7.2 Formulärfält

**Text/e-post/tel/textarea:**
| State | Border | Extra |
|---|---|---|
| Default | `--border-strong` | bg `--surface-card` |
| Focus | `--primary-500` | + `box-shadow: 0 0 0 3px var(--primary-tint)` |
| Fel | `--danger` | + `box-shadow: 0 0 0 3px var(--danger-tint)`, hjälptext i `--danger` under fältet |
| Inaktiv | `--border` | text `--text-muted`, ingen interaktion |

Radie: `--radius-md`. Padding: `9px 12px`. Label: 12px, `--text-secondary`, placerad ovanför fältet.

**Checkbox:** 18×18px, `--radius-sm`, `--border-strong` obockad → `--primary-500`-fylld med vit bock markerad.

### 7.3 Länkar
Default: `--primary-400`, ingen underline. Hover: underline tillkommer. Focus (tangentbord): synlig `outline: 2px solid var(--primary-400); outline-offset: 2px` — gäller även knappar, inte bara länkar.

### 7.4 Badges
`--radius-sm`, 11px/600, padding `3px 9px`.
- Primary: bg `--primary-tint`, text `--primary-400` — t.ex. "Nyinkommen"
- Neutral: bg `--surface-elevated`, text `--text-secondary` — t.ex. "Begagnad"
- Success: bg `--success-tint`, text `--success` — t.ex. "Tillgänglig"

### 7.5 Meddelanden (alerts)
`--radius-md`, padding `12px 16px`, 1px border i respektive semantisk färg, bg i respektive `-tint`-variant, text i `--text-primary` (inte den semantiska färgen — bara border/ikon bär färgen, brödtexten ska vara läsbar).
- Success: används vid t.ex. lyckad formulärinskickning
- Error: används vid valideringsfel på formulärnivå (utöver fältspecifika fel)

### 7.6 FAQ / accordion
Rad-för-rad med `--border` som avdelare, `padding: 16px 0`. Fråga 15px/500. Ikon (+) roterar 45° (blir ×) vid öppet state via `--transition-fast`. Svar 14px `--text-secondary`, animerad höjd vid öppning.

### 7.7 Flerstegsindikator
Punkter 8px runda, `--border-strong`. Aktiv punkt blir stapel: 20px bred, `--radius-sm`, `--primary-500`. Används på Sälj din bil och Boka möte-formulären (se content.md, avsnitt 4.2 och 6.2).

### 7.8 Kort
**Objektkort (bil):** `--surface-card` bg, 1px `--border`, `--radius-lg`. Bildyta `--surface-elevated`, 130px hög. Padding i body `--sp-4`. Titel 16px/600. Pris i mono 18px/500 `--primary-400` eller `--text-primary` beroende på kontext. Specs-rad i mono 12px `--text-secondary`.

**Testimonial-kort:** samma yta/border/radie som objektkort, enklare — bara citat (13px `--text-secondary`) + namn (13px/600 `--text-primary`).

### 7.9 Navigation
Bakgrund `--surface-card`, `--radius-lg`, padding `12px 24px`. Länkar 14px `--text-secondary`; aktuell sida `--text-primary` + 600 vikt (ingen understrykning för aktiv-state, vikt/färg räcker).

---

## 8. Tillgänglighet
- Alla interaktiva element (knappar, länkar, fält) har synlig `focus-visible`-ring — aldrig `outline: none` utan ersättning.
- Kontrastvärden kontrollerade för text mot Midnight/Coal (se §1). Kontrollera separat när riktiga bilder läggs in bakom text.
- `--transition-fast` bör respektera `prefers-reduced-motion` — sätt `transition: none` i en media query för den gruppen användare.

---

## 9. Öppna punkter
- Brytpunkter (§6) är ett antaget default, inte efterfrågat explicit — bekräfta eller justera.
- Om ni vill ha en "loading"-state på primärknappen (t.ex. vid formulärinskick) är den inte specificerad än — enkelt att lägga till senare (spinner + inaktiverat state finns redan som bas).

---

## 10. Nextlease-widgeten (extern, CSS-hackad)

Widgeten på `/bilar` är tredjeparts och stylas genom att skriva över dess klasser
(`#nextlease`-scope i `globals.css`). Den följer INTE detta designsystem automatiskt —
vi tvingar den mot våra tokens. Färger/mörkt läge/radie sätts i Nextlease admin,
vår CSS överskriver typsnitt + finjusterar kort/filter/paginering. **Detaljer,
klass-hållpunkter och bräcklighet: se [.MD/STATE.md](.MD/STATE.md) §2.**
