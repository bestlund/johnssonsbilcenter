# public/bilder — bilder från den gamla Framer-sajten

Hämtade 2026-07-19 från `johnssonsbilcenter.se` (startsidan + `/Om-oss`),
optimerade till WebP (max 1920px bredd, kvalitet 82).
**29 MB → 2,9 MB (−90 %).** Framer-beroendet är helt avvecklat.

## Logotyper
| Fil | Innehåll |
|---|---|
| `logo-johnsson-bilcenter-vit.webp` | **Används på sajten.** Vit variant för dark mode (inverterad från originalet) |
| `logo-johnsson-bilcenter.webp` | Original, svart på transparent — för ljusa underlag/tryck |
| `logo-lockup-vardeord.webp` | Full lockup: "S. Johnsson [SJ] Bilcenter AB" + OMTANKE/SERVICE/TRYGGHET/PASSION, svart på vitt |

## Foton
| Fil | Storlek | Används |
|---|---|---|
| `hero-3.webp` | 114K | Hero, startsidan ✅ |
| `hero-1.webp`, `hero-2.webp` | 8K, 9K | Alternativa hero-bilder |
| `simon-start.webp` | 440K | Grundarsektionen ✅ |
| `simon-om-oss.webp` | 456K | Porträtt för Om oss-sidan |
| `bmw-530-1.webp`, `bmw-530-2.webp` | ~100K | BMW 530, Om oss |
| `om-oss-nojd-kund.webp` | 159K | Nöjd kund, Om oss |
| `nojd-kund-1..3.webp` | ~100–146K | Nöjda kunder, startsidan |
| `tjanst-salj-din-bil.webp` | 397K | Tjänstekort ✅ |
| `tjanst-finansiering.webp` | 593K | Tjänstekort ✅ |
| `tjanst-garanti.webp` | 35K | Tjänstekort ✅ |

✅ = används i nuvarande bygge.

## Ikoner & metadata (behållna i originalformat för kompatibilitet)
| Fil | Mått | Innehåll |
|---|---|---|
| `og-delningsbild.png` | — | OG-bild för delning (PNG — WebP stöds dåligt av sociala plattformar) |
| `apple-touch-icon-180.png` | 180×180 | App-ikon |
| `ikon-64-a.png`, `ikon-64-b.png` | 64×64 | Favicon-varianter |
| `ikon-pil-hoger.svg`, `ikon-pil-vanster.svg` | 40×40 | Chevron-pilar, vit stroke |

## Kvar att göra
- Koppla `og-delningsbild.png` + favicons till `metadata` i `app/layout.tsx`
- `tjanst-finansiering.webp` (593K) är fortfarande den tyngsta — kan beskäras
