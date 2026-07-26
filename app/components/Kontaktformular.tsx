/** §7.2 Formulärfält. Mockup — skickas inte än, backend kopplas på senare. */
export default function Kontaktformular() {
  return (
    <section className="shell max-w-3xl py-14 lg:py-20">
      <h2>Vi kontaktar dig!</h2>

      <form className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fornamn" className="field-label">
            Förnamn *
          </label>
          <input
            id="fornamn"
            className="field-input"
            placeholder="Ditt förnamn"
            required
          />
        </div>
        <div>
          <label htmlFor="telefon" className="field-label">
            Telefonnummer *
          </label>
          <input
            id="telefon"
            type="tel"
            className="field-input data"
            placeholder="Ditt telefonnummer"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="epost" className="field-label">
            E-post *
          </label>
          <input
            id="epost"
            type="email"
            className="field-input"
            placeholder="Din e-post"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="arende" className="field-label">
            Ärende *
          </label>
          <textarea
            id="arende"
            rows={5}
            className="field-input"
            placeholder="Beskriv ditt ärende här"
            required
          />
        </div>

        <label className="flex items-start gap-3 text-xs text-mist sm:col-span-2">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-sm accent-cobalt-500"
          />
          Jag samtycker till att Johnsson Bilcenter AB får spara och lagra mina
          uppgifter.
        </label>

        <div className="sm:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Skicka →
          </button>
          <p className="mt-3 text-center text-xs text-fog">
            Vi delar inte din information med någon.
          </p>
        </div>
      </form>
    </section>
  );
}
