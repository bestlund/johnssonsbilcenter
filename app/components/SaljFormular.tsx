"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { skickaLeadAction } from "@/app/actions/leads";
import { TOM_LEADSTATE } from "@/lib/leadstate";
import {
  formateraRegnr,
  formateraTal,
  formateraTelefon,
} from "@/lib/leadvalidering";
import Faltfel from "./form/Faltfel";
import SkickaKnapp from "./form/SkickaKnapp";
import { Bildvaljare, useBildvaljare } from "./form/Bildvaljare";

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
  const bild = useBildvaljare();

  const skicka = async (fd: FormData) => {
    await bild.bifogaTill(fd); // komprimerar + strippar EXIF + bifogar
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
            Miltal <span className="text-fog">(valfritt)</span>
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
            Ditt önskade pris <span className="text-fog">(valfritt)</span>
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
            Namn <span className="text-fog">(valfritt)</span>
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
            E-post <span className="text-fog">(valfritt)</span>
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
            Meddelande <span className="text-fog">(valfritt)</span>
          </label>
          <textarea
            id="s-meddelande"
            name="meddelande"
            rows={3}
            value={v.meddelande}
            onChange={upp("meddelande")}
            className="field-input min-h-[88px] resize-y"
            placeholder="Berätta gärna om skick, utrustning och servicehistorik…"
          />
        </div>

        <Bildvaljare {...bild} />

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
          <SkickaKnapp pending={pending || bild.komprimerar || bild.laddar}>
            Få en värdering
          </SkickaKnapp>
          <p className="mt-3 text-center text-xs text-fog">
            Vi återkommer så snabbt vi kan. Läs vår{" "}
            <Link href="/integritetspolicy" className="link">
              integritetspolicy
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
