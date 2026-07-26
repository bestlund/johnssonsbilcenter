import { hamtaGoogleOmdomen } from "@/lib/googleReviews";

/**
 * Omdömessektionen — LIVE från Google (Places API via lib/googleReviews).
 * Google ger max 5 recensioner → 1 utvalt (mörka kortet) + upp till 4 i rutnätet.
 * Aggregatet (betyg/antal) är komplett och live. Faller tillbaka på de kända
 * hårdkodade omdömena nedan om API:et inte svarar, så sektionen alltid renderar.
 */

// Reservomdömen (content.md, Bilaga A) — visas bara om live-hämtningen ger 0.
const RESERV_UTVALT = {
  namn: "Håkan Lindbergh",
  kontext: "Köpte Toyota Yaris · Google",
  text: "Forden strejkade i kylan, ringde Simon och några timmar senare satt vi i en varm Yaris — efter en enkelt genomförd affär som vi känner oss trygga med. Forden blev inbytet. Tack Simon!",
  betyg: 5,
};

const RESERV_OVRIGA = [
  {
    namn: "Ali Mohammed",
    kontext: "Google",
    betyg: 5,
    text: "Aldrig varit med om något smidigare i mitt liv! Jätte trevlig kille. Hade rekommenderat att antagligen köpa en bil eller sälja sin egen bil till Johnsson Bilcenter AB om ni vill ha en lycklig affär!",
  },
  {
    namn: "Michael Andersson",
    kontext: "Google",
    betyg: 5,
    text: "Köpte inte för eget bruk utan hjälpte min far till ett nytt bilköp. Allt som berättades om bilen innan köp stämde perfekt. Väldigt ödmjuk och behjälplig säljare genom hela affären.",
  },
  {
    namn: "Mathilde Sörensen",
    kontext: "Google",
    betyg: 5,
    text: "Trygg och smidig bilaffär där Simon även tog vår gamla bil i inbyte. Personligt och ärligt bemötande. Vi är mycket nöjda och rekommenderar varmt Johnssons Bilcenter.",
  },
  {
    namn: "Annika Sundström",
    kontext: "Google",
    betyg: 5,
    text: "Jag är nöjd med mitt bilköp. Simon svarade snabbt och tydligt på all kommunikation och bemötandet har varit gott under hela processen.",
  },
];

type Omdome = {
  namn: string;
  kontext: string;
  betyg: number;
  text: string;
};

function korta(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function Stjarnor({
  betyg = 5,
  className = "",
}: {
  betyg?: number;
  className?: string;
}) {
  const fyllda = Math.round(betyg);
  return (
    <div
      className={`flex gap-0.5 ${className}`}
      role="img"
      aria-label={`${betyg.toLocaleString("sv-SE")} av 5 stjärnor`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 ${i < fyllda ? "text-amber" : "text-cream-line"}`}
        >
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

export default async function Omdomen() {
  const data = await hamtaGoogleOmdomen();

  // Mappa live-recensioner till kortformen; fall tillbaka på reservdata om tomt.
  const live: Omdome[] = data.recensioner.map((r) => ({
    namn: r.forfattare,
    kontext: r.nar ? `${r.nar} · Google` : "Google",
    betyg: r.betyg,
    text: r.text,
  }));

  const utvalt: Omdome = live[0] ?? RESERV_UTVALT;
  const ovriga: Omdome[] = live.length > 0 ? live.slice(1, 5) : RESERV_OVRIGA;

  const betygText = data.betyg.toLocaleString("sv-SE", {
    minimumFractionDigits: 1,
  });

  return (
    // Ljus sektion — temaundantaget. Full-bredds cream-yta, innehåll i .shell.
    // .frame ritar cobalt-hörnramen (blueprint-accenten).
    <section className="section-light frame">
      <div className="shell py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2>Riktiga affärer, riktiga ord</h2>

          {/* Betygsbadge — live siffror, länkar till Google */}
          <a
            href={data.lank}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <span className="font-display text-3xl font-extrabold leading-none">
              {betygText}
            </span>
            <span>
              <Stjarnor betyg={data.betyg} />
              <span className="mt-1 block text-xs text-ink-soft">
                {data.antal} omdömen · Google
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
              <blockquote className="body-lg mt-4">
                {korta(utvalt.text, 320)}
              </blockquote>
            </div>
            <figcaption className="mt-10 flex items-center gap-3">
              <Initialer namn={utvalt.namn} variant="dark" />
              <span>
                <span className="block text-sm font-semibold">
                  {utvalt.namn}
                </span>
                <span className="block text-xs text-fog">{utvalt.kontext}</span>
              </span>
            </figcaption>
          </figure>

          {/* Rutnät — upp till 4 övriga */}
          <div className="grid gap-4 sm:grid-cols-2">
            {ovriga.map((o) => (
              <figure
                key={o.namn}
                className="flex flex-col rounded-lg border border-cream-line bg-cream-card p-5"
              >
                <Stjarnor betyg={o.betyg} />
                <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-ink-soft">
                  {korta(o.text, 170)}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <Initialer namn={o.namn} />
                  <span>
                    <span className="block text-[13px] font-semibold">
                      {o.namn}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {o.kontext}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <a
          href={data.lank}
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
