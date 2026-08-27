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

/** Förmedla din bil → strukturerat mejl via Server Action (M2). */
export default function FormedlingFormular() {
  const [state, action, pending] = useActionState(
    skickaLeadAction,
    TOM_LEADSTATE,
  );
  const start = useRef(Date.now());
  const skicka = (fd: FormData) => {
    fd.set("dt", String(Date.now() - start.current));
    return action(fd);
  };
  const [v, setV] = useState({
    regnr: "",
    miltal: "",
    telefon: "",
    epost: "",
  });
  const [samtycke, setSamtycke] = useState(false);
  const upp =
    (falt: keyof typeof v, tvatta?: (s: string) => string) =>
    (e: { target: { value: string } }) =>
      setV((f) => ({
        ...f,
        [falt]: tvatta ? tvatta(e.target.value) : e.target.value,
      }));

  if (state.ok) {
    return (
      <div className="card mt-6 p-6 text-center lg:p-8">
        <h3 className="text-lg font-semibold">Tack!</h3>
        <p className="mt-2 text-mist">{state.meddelande}</p>
      </div>
    );
  }

  return (
    <div className="card mt-6 p-6 lg:p-8">
      <h3 className="text-lg font-semibold">Vill du att vi förmedlar din bil?</h3>
      <p className="mt-2 text-mist">
        Fyll i formuläret nedan så kontaktar vi dig inom 24 timmar.
      </p>

      <form action={skicka} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="formtyp" value="formedling" />
        <input
          type="text"
          name="webbplats"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div>
          <label htmlFor="f-regnr" className="field-label">
            Registreringsnummer *
          </label>
          <input
            id="f-regnr"
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
          <label htmlFor="f-miltal" className="field-label">
            Miltal *
          </label>
          <input
            id="f-miltal"
            name="miltal"
            inputMode="numeric"
            value={v.miltal}
            onChange={upp("miltal", formateraTal)}
            className="field-input data"
            placeholder="t.ex. 12 500"
            required
            aria-invalid={!!state.fel.miltal}
          />
          <Faltfel meddelande={state.fel.miltal} />
        </div>

        <div>
          <label htmlFor="f-telefon" className="field-label">
            Telefon *
          </label>
          <input
            id="f-telefon"
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
          <label htmlFor="f-epost" className="field-label">
            E-post
          </label>
          <input
            id="f-epost"
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
          <SkickaKnapp pending={pending}>Skicka</SkickaKnapp>
        </div>
      </form>
    </div>
  );
}
