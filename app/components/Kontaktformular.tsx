"use client";

import { useActionState, useRef, useState } from "react";
import { skickaLeadAction } from "@/app/actions/leads";
import { TOM_LEADSTATE } from "@/lib/leadstate";
import { formateraTelefon } from "@/lib/leadvalidering";
import Faltfel from "./form/Faltfel";
import SkickaKnapp from "./form/SkickaKnapp";

/** §7.2 Kontaktformulär → strukturerat mejl via Server Action (M2). */
export default function Kontaktformular() {
  const [state, action, pending] = useActionState(
    skickaLeadAction,
    TOM_LEADSTATE,
  );
  const start = useRef(Date.now());
  // Sätter ifyllnadstiden (dt) på FormData innan action körs (anti-spam).
  const skicka = (fd: FormData) => {
    fd.set("dt", String(Date.now() - start.current));
    return action(fd);
  };
  const [v, setV] = useState({
    fornamn: "",
    telefon: "",
    epost: "",
    arende: "",
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
      <section className="shell max-w-3xl py-14 lg:py-20">
        <div className="card p-8 text-center">
          <h2>Tack!</h2>
          <p className="mt-3 text-mist">{state.meddelande}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="shell max-w-3xl py-14 lg:py-20">
      <h2>Vi kontaktar dig!</h2>

      <form action={skicka} noValidate className="mt-8 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="formtyp" value="kontakt" />
        {/* Honeypot — dolt för människor, bots fyller i det */}
        <input
          type="text"
          name="webbplats"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div>
          <label htmlFor="fornamn" className="field-label">
            Förnamn *
          </label>
          <input
            id="fornamn"
            name="fornamn"
            value={v.fornamn}
            onChange={upp("fornamn")}
            className="field-input"
            placeholder="Ditt förnamn"
            required
            aria-invalid={!!state.fel.fornamn}
          />
          <Faltfel meddelande={state.fel.fornamn} />
        </div>

        <div>
          <label htmlFor="telefon" className="field-label">
            Telefonnummer *
          </label>
          <input
            id="telefon"
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

        <div className="sm:col-span-2">
          <label htmlFor="epost" className="field-label">
            E-post *
          </label>
          <input
            id="epost"
            name="epost"
            type="email"
            value={v.epost}
            onChange={upp("epost")}
            className="field-input"
            placeholder="Din e-post"
            required
            aria-invalid={!!state.fel.epost}
          />
          <Faltfel meddelande={state.fel.epost} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="arende" className="field-label">
            Ärende *
          </label>
          <textarea
            id="arende"
            name="arende"
            rows={5}
            value={v.arende}
            onChange={upp("arende")}
            className="field-input"
            placeholder="Beskriv ditt ärende här"
            required
            aria-invalid={!!state.fel.arende}
          />
          <Faltfel meddelande={state.fel.arende} />
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
          <p className="mt-3 text-center text-xs text-fog">
            Vi delar inte din information med någon.
          </p>
        </div>
      </form>
    </section>
  );
}
