const TIDER = [
  { dag: "Måndag–fredag", tid: "10:00–18:00" },
  { dag: "Lördag", tid: "11:00–15:00" },
  { dag: "Söndag", tid: "Endast bokad tid" },
];

// Adressen används för geokodning — INTE koordinater. content.md:s koordinater
// reverse-geokodade till fel POI (Bilkanalen AB, Gevärsgatan 13). Florettgatan 8
// är den bekräftat rätta adressen.
const ADRESS = "Johnsson Bilcenter AB, Florettgatan 8, 254 67 Helsingborg";
const KARTA_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(ADRESS)}&z=15&output=embed`;
const VAGBESKRIVNING = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADRESS)}`;

/**
 * Besök oss — öppettider + plats i EN sektion, horisontell layout: info till
 * vänster (öppettider överst, adress under), karta till höger som fyller höjden.
 * Full sektionsbredd (.shell) i linje med övriga sektioner.
 */
export default function Oppettider() {
  return (
    <section className="shell py-14 lg:py-20">
      <h2>Besök oss</h2>

      <div className="card mt-8 grid overflow-hidden lg:grid-cols-2">
        {/* Info till vänster */}
        <div className="p-6 lg:p-8">
          {/* Öppettider överst */}
          <h3 className="text-lg font-semibold">Öppettider</h3>
          <dl className="mt-5">
            {TIDER.map((t) => (
              <div
                key={t.dag}
                className="flex items-baseline justify-between border-b border-line py-3 last:border-0"
              >
                <dt className="small text-mist">{t.dag}</dt>
                <dd className="data text-sm">{t.tid}</dd>
              </div>
            ))}
          </dl>

          {/* Adress under */}
          <div className="mt-8 border-t border-line pt-8">
            <h3 className="text-lg font-semibold">Helsingborg</h3>
            <address className="mt-5 text-sm not-italic">
              <a
                href={VAGBESKRIVNING}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-cobalt-400"
              >
                Florettgatan 8, 254 67 Helsingborg
              </a>
            </address>
          </div>
        </div>

        {/* Karta till höger — fyller hela höjden, mörkt filter */}
        <div className="relative min-h-[320px] border-t border-line lg:min-h-0 lg:border-l lg:border-t-0">
          <iframe
            title="Karta till Johnsson Bilcenter, Florettgatan 8 Helsingborg"
            src={KARTA_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full"
            style={{
              border: 0,
              filter: "invert(0.9) hue-rotate(180deg) contrast(0.9)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
