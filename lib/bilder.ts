import type { Bilaga } from "./leads";

const MAX_ANTAL = 6;
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB per fil

/**
 * Gör uppladdade bilder till mejlbilagor (server-only).
 *
 * Bilderna är redan färdigbehandlade klient-side (se `komprimera` i
 * Bildvaljare): storleksändrade till max 1400px, JPEG-komprimerade och
 * EXIF/GPS-strippade genom canvas-re-encode. Här läser vi bara in de färdiga
 * bytena och base64-kodar dem för bilagan.
 *
 * Ingen server-bildbehandling (sharp) — det gav ett native-beroende (libvips)
 * som inte gick att ladda på Vercels Linux-runtime och kraschade hela
 * lead-actionen. Next behåller sin egen sharp för bildoptimering; det här är
 * fristående.
 *
 * Ogiltiga/oläsbara filer hoppas tyst så att en trasig bild aldrig fäller leaden.
 */
export async function processaBilder(filer: File[]): Promise<Bilaga[]> {
  const valda = filer
    .filter(
      (f) => f && f.size > 0 && f.size <= MAX_BYTES && f.type.startsWith("image/"),
    )
    .slice(0, MAX_ANTAL);

  const bilagor: Bilaga[] = [];
  for (let i = 0; i < valda.length; i++) {
    try {
      const buf = Buffer.from(await valda[i].arrayBuffer());
      bilagor.push({
        filename: `bil-${i + 1}.jpg`,
        content: buf.toString("base64"),
      });
    } catch {
      /* oläsbar → hoppa tyst */
    }
  }
  return bilagor;
}
