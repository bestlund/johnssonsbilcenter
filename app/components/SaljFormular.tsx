"use client";

import { useActionState, useRef, useState } from "react";
import { skickaLeadAction } from "@/app/actions/leads";
import { TOM_LEADSTATE } from "@/lib/leadstate";
import {
  formateraRegnr,
  formateraTal,
  formateraTelefon,
} from "@/lib/leadvalidering";
import Faltfel from "./form/Faltfel";
import SkickaKnapp from "./form/SkickaKnapp";

/**
 * Komprimerar + orienterar en bild klient-side innan upload: applicerar
 * EXIF-orientering, krymper till max 1600px och re-encodar som JPEG via canvas
 * (vilket också strippar all metadata/GPS). Håller uppladdningen liten nog för
 * Server Actions body-gräns. Faller tillbaka på originalet om något strular.
 */
async function komprimera(file: File): Promise<Blob> {
  try {
    const bild = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const max = 1600;
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
      canvas.toBlob(res, "image/jpeg", 0.8),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

/**
 * Sälj din bil → strukturerat mejl via Server Action (M2). Förifylls från
 * hero-flikens fält (reg/pris/tel) som skickas som `start`.
 */
export default function SaljFormular({
  start,
}: {
  start: { regnr: string; pris: string; telefon: string };
}) {
  const [state, action, pending] = useActionState(
    skickaLeadAction,
    TOM_LEADSTATE,
  );
  const t0 = useRef(Date.now());
  const [v, setV] = useState({
    regnr: formateraRegnr(start.regnr),
    miltal: "",
    pris: formateraTal(start.pris),
    telefon: formateraTelefon(start.telefon),
    namn: "",
    epost: "",
    meddelande: "",
  });
  const [samtycke, setSamtycke] = useState(false);

  // Bilder (valfritt) → bifogas mejlet. Hanteras i state för förhandsvisning +
  // borttagning; filerna läggs på FormData i skicka().
  const MAX_BILDER = 6;
  const MAX_STORLEK = 12 * 1024 * 1024; // 12 MB
  const [bilder, setBilder] = useState<{ file: File; url: string }[]>([]);
  const [bildFel, setBildFel] = useState("");
  const [komprimerar, setKomprimerar] = useState(false);
  const filRef = useRef<HTMLInputElement>(null);

  function laggTillBilder(valda: FileList | null) {
    if (!valda) return;
    setBildFel("");
    const nya: { file: File; url: string }[] = [];
    for (const f of Array.from(valda)) {
      if (!f.type.startsWith("image/")) {
        setBildFel("Bara bilder kan laddas upp.");
        continue;
      }
      if (f.size > MAX_STORLEK) {
        setBildFel("Någon bild är för stor (max 12 MB).");
        continue;
      }
      nya.push({ file: f, url: URL.createObjectURL(f) });
    }
    setBilder((b) => {
      if (b.length + nya.length > MAX_BILDER)
        setBildFel(`Du kan bifoga max ${MAX_BILDER} bilder.`);
      return [...b, ...nya].slice(0, MAX_BILDER);
    });
    if (filRef.current) filRef.current.value = ""; // tillåt samma fil igen
  }

  function taBort(i: number) {
    setBilder((b) => {
      URL.revokeObjectURL(b[i]?.url);
      return b.filter((_, n) => n !== i);
    });
  }

  const skicka = async (fd: FormData) => {
    setKomprimerar(true);
    try {
      for (let i = 0; i < bilder.length; i++) {
        const blob = await komprimera(bilder[i].file);
        fd.append("bilder", blob, `bild-${i + 1}.jpg`);
      }
    } finally {
      setKomprimerar(false);
    }
    fd.set("dt", String(Date.now() - t0.current));
    return action(fd);
  };
  const upp =
    (falt: keyof typeof v, tvatta?: (s: string) => string) =>
    (e: { target: { value: string } }) =>
      setV((f) => ({
        ...f,
        [falt]: tvatta ? tvatta(e.target.value) : e.target.value,
      }));

  if (state.ok) {
    return (
      <div className="card mt-10 p-8 text-center">
        <h2>Tack!</h2>
        <p className="mt-3 text-mist">{state.meddelande}</p>
      </div>
    );
  }

  return (
    <div className="card mt-10 p-6 lg:p-8">
      <h2 className="text-xl font-semibold">Få en kostnadsfri värdering</h2>
      <p className="mt-2 text-mist">
        Fyll i uppgifterna nedan så återkommer vi med ett bud, oftast samma dag.
      </p>

      <form action={skicka} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="formtyp" value="salj" />
        <input
          type="text"
          name="webbplats"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div>
          <label htmlFor="s-regnr" className="field-label">
            Registreringsnummer *
          </label>
          <input
            id="s-regnr"
            name="regnr"
            value={v.regnr}
            onChange={upp("regnr", formateraRegnr)}
            className="field-input data uppercase"
            placeholder="ABC 12X"
            maxLength={7}
            required
            aria-invalid={!!state.fel.regnr}
          />
          <Faltfel meddelande={state.fel.regnr} />
        </div>

        <div>
          <label htmlFor="s-miltal" className="field-label">
            Miltal <span className="text-fog">· valfritt</span>
          </label>
          <input
            id="s-miltal"
            name="miltal"
            inputMode="numeric"
            value={v.miltal}
            onChange={upp("miltal", formateraTal)}
            className="field-input data"
            placeholder="t.ex. 12 500"
            aria-invalid={!!state.fel.miltal}
          />
          <Faltfel meddelande={state.fel.miltal} />
        </div>

        <div>
          <label htmlFor="s-pris" className="field-label">
            Ditt önskade pris <span className="text-fog">· valfritt</span>
          </label>
          <input
            id="s-pris"
            name="pris"
            inputMode="numeric"
            value={v.pris}
            onChange={upp("pris", formateraTal)}
            className="field-input data"
            placeholder="185 000"
          />
        </div>

        <div>
          <label htmlFor="s-telefon" className="field-label">
            Telefon *
          </label>
          <input
            id="s-telefon"
            name="telefon"
            type="tel"
            value={v.telefon}
            onChange={upp("telefon", formateraTelefon)}
            className="field-input data"
            placeholder="073-302 90 19"
            required
            aria-invalid={!!state.fel.telefon}
          />
          <Faltfel meddelande={state.fel.telefon} />
        </div>

        <div>
          <label htmlFor="s-namn" className="field-label">
            Namn <span className="text-fog">· valfritt</span>
          </label>
          <input
            id="s-namn"
            name="namn"
            value={v.namn}
            onChange={upp("namn")}
            className="field-input"
            placeholder="Ditt namn"
          />
        </div>

        <div>
          <label htmlFor="s-epost" className="field-label">
            E-post <span className="text-fog">· valfritt</span>
          </label>
          <input
            id="s-epost"
            name="epost"
            type="email"
            value={v.epost}
            onChange={upp("epost")}
            className="field-input"
            placeholder="Din e-post"
            aria-invalid={!!state.fel.epost}
          />
          <Faltfel meddelande={state.fel.epost} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="s-meddelande" className="field-label">
            Meddelande <span className="text-fog">· valfritt</span>
          </label>
          <textarea
            id="s-meddelande"
            name="meddelande"
            rows={3}
            value={v.meddelande}
            onChange={upp("meddelande")}
            className="field-input"
            placeholder="Berätta gärna mer — skick, utrustning, servicehistorik…"
          />
        </div>

        {/* Bilder — valfritt, bifogas mejlet (EXIF strippas server-side) */}
        <div className="sm:col-span-2">
          <span className="field-label">
            Bilder på bilen <span className="text-fog">· valfritt</span>
          </span>
          <input
            ref={filRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => laggTillBilder(e.target.files)}
            className="hidden"
          />

          {bilder.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {bilder.map((b, i) => (
                <div
                  key={b.url}
                  className="relative h-20 w-20 overflow-hidden rounded-md border border-line-strong bg-elevated"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
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

          {bilder.length < MAX_BILDER && (
            <button
              type="button"
              onClick={() => filRef.current?.click()}
              className="btn btn-secondary"
            >
              Lägg till bilder
            </button>
          )}
          <p className="mt-2 text-xs text-fog">
            Upp till {MAX_BILDER} bilder. Hjälper oss ge en snabbare och mer
            träffsäker värdering.
          </p>
          {bildFel && (
            <p role="alert" className="mt-1 text-xs text-danger">
              {bildFel}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-xs text-mist">
            <input
              type="checkbox"
              name="samtycke"
              checked={samtycke}
              onChange={(e) => setSamtycke(e.target.checked)}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-sm accent-cobalt-500"
            />
            Jag samtycker till att Johnsson Bilcenter AB får spara och lagra mina
            uppgifter.
          </label>
          <Faltfel meddelande={state.fel.samtycke} />
        </div>

        {state.meddelande && (
          <p role="alert" className="text-sm text-danger sm:col-span-2">
            {state.meddelande}
          </p>
        )}

        <div className="sm:col-span-2">
          <SkickaKnapp pending={pending || komprimerar}>
            Få en värdering
          </SkickaKnapp>
          <p className="mt-3 text-center text-xs text-fog">
            Vi återkommer samma dag · ingen förpliktelse
          </p>
        </div>
      </form>
    </div>
  );
}
