"use client";

import { useRef, useState } from "react";

const MAX_BILDER = 6;
const MAX_MB = 12;
const MAX_STORLEK = MAX_MB * 1024 * 1024;
// Vercel kapar en Server Action-request vid 4,5 MB (plattformsgräns, går ej att
// höja). Vi budgeterar bilderna till 4 MB efter komprimering och lämnar resten
// åt textfält + multipart-overhead. Vakt nedan fångar det snällt om något ändå
// slinker över (t.ex. om komprimeringen faller tillbaka på originalet).
const MAX_TOTAL_MB = 4;
const MAX_TOTAL = MAX_TOTAL_MB * 1024 * 1024;

/**
 * Komprimerar + orienterar en bild klient-side före upload: applicerar
 * EXIF-orientering, krymper till max 1600px och re-encodar som JPEG via canvas
 * (strippar all metadata/GPS + håller uppladdningen liten). Faller tillbaka på
 * originalet om något strular.
 */
async function komprimera(file: File): Promise<Blob> {
  try {
    const bild = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const max = 1400;
    const skala = Math.min(1, max / Math.max(bild.width, bild.height));
    const w = Math.round(bild.width * skala);
    const h = Math.round(bild.height * skala);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bild, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", 0.72),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

/** Delad bild-logik för lead-formulären (förhandsvisning, borttagning, komprimering). */
export function useBildvaljare() {
  const [bilder, setBilder] = useState<{ file: File; url: string }[]>([]);
  const [bildFel, setBildFel] = useState("");
  const [komprimerar, setKomprimerar] = useState(false);
  const [laddar, setLaddar] = useState(false);
  const filRef = useRef<HTMLInputElement>(null);

  async function laggTill(valda: FileList | null) {
    if (!valda) return;
    setBildFel("");
    setLaddar(true);
    try {
      const nya: { file: File; url: string }[] = [];
      for (const f of Array.from(valda)) {
        let fil: File = f;
        // iPhone-foton är ofta HEIC → avkoda till JPEG i webbläsaren (heic2any,
        // dynamiskt importerad så den bara laddas när det faktiskt behövs).
        const arHeic = /heic|heif/i.test(f.type) || /\.hei[cf]$/i.test(f.name);
        if (arHeic) {
          try {
            const heic2any = (await import("heic2any")).default;
            const ut = await heic2any({
              blob: f,
              toType: "image/jpeg",
              quality: 0.85,
            });
            const blob = Array.isArray(ut) ? ut[0] : ut;
            fil = new File([blob], f.name.replace(/\.hei[cf]$/i, ".jpg"), {
              type: "image/jpeg",
            });
          } catch {
            setBildFel(
              "Kunde inte läsa en HEIC-bild. Prova att spara den som JPG.",
            );
            continue;
          }
        } else if (!f.type.startsWith("image/")) {
          setBildFel(
            "En fil kunde inte laddas upp. Bara bilder (JPG, PNG, HEIC) fungerar.",
          );
          continue;
        }
        if (fil.size > MAX_STORLEK) {
          setBildFel(
            `En bild var för stor och hoppades över (max ${MAX_MB} MB per bild).`,
          );
          continue;
        }
        nya.push({ file: fil, url: URL.createObjectURL(fil) });
      }
      setBilder((b) => {
        if (b.length + nya.length > MAX_BILDER)
          setBildFel(`Du kan bifoga max ${MAX_BILDER} bilder.`);
        return [...b, ...nya].slice(0, MAX_BILDER);
      });
    } finally {
      setLaddar(false);
      if (filRef.current) filRef.current.value = "";
    }
  }

  function taBort(i: number) {
    setBilder((b) => {
      URL.revokeObjectURL(b[i]?.url);
      return b.filter((_, n) => n !== i);
    });
  }

  /**
   * Komprimerar och lägger alla valda bilder på FormData (fält "bilder").
   * Returnerar `false` om bilderna tillsammans överskrider budgeten (då sätts
   * ett fel och inget bifogas) så formuläret kan avbryta i stället för att
   * skicka en request Vercel ändå avvisar. `true` = klart att skicka.
   */
  async function bifogaTill(fd: FormData): Promise<boolean> {
    if (!bilder.length) return true;
    setKomprimerar(true);
    try {
      const blobar: Blob[] = [];
      let total = 0;
      for (const b of bilder) {
        const blob = await komprimera(b.file);
        blobar.push(blob);
        total += blob.size;
      }
      if (total > MAX_TOTAL) {
        setBildFel(
          `Bilderna är för stora tillsammans (max ${MAX_TOTAL_MB} MB efter komprimering). Ta bort någon eller välj färre.`,
        );
        return false;
      }
      blobar.forEach((blob, i) =>
        fd.append("bilder", blob, `bild-${i + 1}.jpg`),
      );
      return true;
    } finally {
      setKomprimerar(false);
    }
  }

  return {
    bilder,
    bildFel,
    komprimerar,
    laddar,
    filRef,
    laggTill,
    taBort,
    bifogaTill,
    MAX_BILDER,
  };
}

/** Upload-simple-ikon (inline, samma stroke-stil som övriga ikoner i projektet). */
function UploadIkon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 14.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

/**
 * UI för bildväljaren — dropzone med drag & drop + klick. Ta returvärdet från
 * useBildvaljare(). Stor yta när tom, krymper till en "lägg till fler"-rad när
 * bilder valts, döljs helt vid max antal.
 */
export function Bildvaljare({
  bilder,
  bildFel,
  laddar,
  filRef,
  laggTill,
  taBort,
  MAX_BILDER,
}: ReturnType<typeof useBildvaljare>) {
  const [dragOver, setDragOver] = useState(false);
  const full = bilder.length >= MAX_BILDER;
  const tom = bilder.length === 0;

  return (
    <div className="sm:col-span-2">
      <span className="field-label">
        Bilder på bilen{" "}
        <span className="text-fog">(valfritt, upp till {MAX_BILDER})</span>
      </span>

      <input
        ref={filRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        onChange={(e) => laggTill(e.target.files)}
        className="hidden"
      />

      {!full && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => filRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              filRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            laggTill(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-center transition-colors ${
            tom ? "min-h-[130px] flex-col gap-2 px-4 py-6" : "gap-2 px-4 py-3"
          } ${
            dragOver
              ? "border-cobalt-500 bg-cobalt-500/5"
              : "border-line-strong hover:border-highlight"
          }`}
        >
          {laddar ? (
            <span className="text-sm text-mist">Läser bild…</span>
          ) : (
            <>
              <UploadIkon
                className={
                  tom ? "h-8 w-8 text-cobalt-400" : "h-5 w-5 text-cobalt-400"
                }
              />
              <div className="text-sm">
                <span className="font-medium text-linen">
                  {tom ? "Dra och släpp bilder här" : "Lägg till fler bilder"}
                </span>
                {tom && (
                  <>
                    <br />
                    <span className="text-mist">
                      eller{" "}
                      <span className="text-cobalt-400 underline underline-offset-2">
                        klicka för att välja
                      </span>
                    </span>
                  </>
                )}
              </div>
              {tom && (
                <p className="text-xs text-fog">
                  JPG eller PNG, max {MAX_MB} MB
                </p>
              )}
            </>
          )}
        </div>
      )}

      {bilder.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {bilder.map((b, i) => (
            <div
              key={b.url}
              className="relative h-20 w-20 overflow-hidden rounded-md border border-line-strong bg-elevated"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => taBort(i)}
                aria-label="Ta bort bild"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-sm leading-none text-white transition-colors hover:bg-black active:scale-95"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {bildFel && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {bildFel}
        </p>
      )}
    </div>
  );
}
