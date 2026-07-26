// Länk till företagets Google-omdömen (från användaren). Betyg/antal är
// STATISKA (manuellt underhållna) — uppdatera dessa två konstanter vid behov.
const GOOGLE_REVIEWS =
  "https://www.google.com/search?q=Johnsson+Bilcenter+AB&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_11SUEp8b3UmJ2sLe5p3rRKlVGo433jCuR7mzMgyS5ZKWbxCTw2Wtey4q63o4c9tyFxXfL0%3D";
const BETYG = "4,9";
const ANTAL = 61;

// Äkta kundomdömen från deras Google (content.md, Bilaga A).
const UTVALT = {
  namn: "Håkan Lindbergh",
  kontext: "Köpte Toyota Yaris · Google",
  text: "Forden strejkade i kylan, ringde Simon och några timmar senare satt vi i en varm Yaris — efter en enkelt genomförd affär som vi känner oss trygga med. Forden blev inbytet. Tack Simon!",
};

const OVRIGA = [
  {
    namn: "Ali Mohammed",
    text: "Aldrig varit med om något smidigare i mitt liv! Jätte trevlig kille. Hade rekommenderat att antagligen köpa en bil eller sälja sin egen bil till Johnsson Bilcenter AB om ni vill ha en lycklig affär!",
  },
  {
    namn: "Michael Andersson",
    text: "Köpte inte för eget bruk utan hjälpte min far till ett nytt bilköp. Allt som berättades om bilen innan köp stämde perfekt. Väldigt ödmjuk och behjälplig säljare genom hela affären.",
  },
  {
    namn: "Mathilde Sörensen",
    text: "Trygg och smidig bilaffär där Simon även tog vår gamla bil i inbyte. Personligt och ärligt bemötande. Vi är mycket nöjda och rekommenderar varmt Johnssons Bilcenter.",
  },
  {
    namn: "Annika Sundström",
    text: "Jag är nöjd med mitt bilköp. Simon svarade snabbt och tydligt på all kommunikation och bemötandet har varit gott under hela processen.",
  },
];

function Stjarnor({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-0.5 text-amber ${className}`}
      role="img"
      aria-label="5 av 5 stjärnor"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.6l2.5 5.1 5.6.8-4 4 1 5.6L10 14.5 4.9 17.1l1-5.6-4-4 5.6-.8L10 1.6z" />
        </svg>
      ))}
    </div>
  );
}

// Avatar-chip. Variant styr färgen: "light" för de vita korten, "dark" för det
// mörka utvalda kortet (där cobalt-400 syns bättre mot mörk yta).
function Initialer({
  namn,
  variant = "light",
}: {
  namn: string;
  variant?: "light" | "dark";
}) {
  const i = namn
    .split(" ")
    .map((d) => d[0])
    .slice(0, 2)
    .join("");
  const farg =
    variant === "dark"
      ? "bg-elevated text-cobalt-400"
      : "bg-cobalt-500/10 text-cobalt-600";
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${farg}`}
    >
      {i}
    </span>
  );
}

export default function Omdomen() {
  return (
    // Ljus sektion — temaundantaget. Full-bredds cream-yta, innehåll i .shell.
    // .frame ritar cobalt-hörnramen (blueprint-accenten).
    <section className="section-light frame">
      <div className="shell py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2>Riktiga affärer, riktiga ord</h2>

          {/* Betygsbadge — riktiga siffror, länkar till Google */}
          <a
            href={GOOGLE_REVIEWS}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <span className="font-display text-3xl font-extrabold leading-none">
              {BETYG}
            </span>
            <span>
              <Stjarnor />
              <span className="mt-1 block text-xs text-ink-soft">
                {ANTAL} omdömen · Google
              </span>
            </span>
          </a>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {/* Utvalt omdöme — MÖRKT kort som poppar mot den ljusa sektionen */}
          <figure className="flex flex-col justify-between rounded-lg bg-card p-8 text-linen lg:p-10">
            <div>
              <span className="font-display text-4xl leading-none text-cobalt-400">
                &rdquo;
              </span>
              <blockquote className="body-lg mt-4">{UTVALT.text}</blockquote>
            </div>
            <figcaption className="mt-10 flex items-center gap-3">
              <Initialer namn={UTVALT.namn} variant="dark" />
              <span>
                <span className="block text-sm font-semibold">
                  {UTVALT.namn}
                </span>
                <span className="block text-xs text-fog">{UTVALT.kontext}</span>
              </span>
            </figcaption>
          </figure>

          {/* Rutnät 2×2 */}
          <div className="grid gap-4 sm:grid-cols-2">
            {OVRIGA.map((o) => (
              <figure
                key={o.namn}
                className="flex flex-col rounded-lg border border-cream-line bg-cream-card p-5"
              >
                <Stjarnor />
                <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-ink-soft">
                  {o.text}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <Initialer namn={o.namn} />
                  <span>
                    <span className="block text-[13px] font-semibold">
                      {o.namn}
                    </span>
                    <span className="block text-xs text-ink-muted">Google</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <a
          href={GOOGLE_REVIEWS}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary mt-8"
        >
          Läs alla omdömen på Google
        </a>
      </div>
    </section>
  );
}
