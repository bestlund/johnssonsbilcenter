import sharp from "sharp";
import type { Bilaga } from "./leads";

const MAX_ANTAL = 6;
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB per fil före processning

/**
 * Gör uppladdade bilder till mejlbilagor (server-only). Per bild:
 *  - auto-roterar efter EXIF-orientering (annars kan foton hamna på sidan)
 *  - storleksändrar till max 1600px (behåller proportioner, förstorar aldrig)
 *  - komprimerar till JPEG (kvalitet 80)
 *  - STRIPPAR all metadata (sharp behåller ingen by default) → EXIF/GPS bort
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
      const out = await sharp(buf)
        .rotate()
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      bilagor.push({
        filename: `bil-${i + 1}.jpg`,
        content: out.toString("base64"),
      });
    } catch {
      /* korrupt/oläsbar (t.ex. HEIC utan stöd) → hoppa tyst */
    }
  }
  return bilagor;
}
