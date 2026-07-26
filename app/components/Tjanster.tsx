import Image from "next/image";
import Link from "next/link";

const BAS = "/bilder/";

const TJANSTER = [
  {
    titel: "Sälj din bil till oss!",
    text: "Vi är experter på begagnade bilar och erbjuder rättvisa priser samt smidig hantering av pappersarbete. Byt även in din bil mot en annan modell med attraktiva inbytespriser.",
    cta: "Sälj din bil nu",
    href: "/salj-din-bil",
    bild: `${BAS}tjanst-salj-din-bil.webp`,
  },
  {
    titel: "Finansiering",
    text: "Finansiering utan krav på kontantinsats, upp till 350 000 kr. Vi anpassar betalningsplanen efter din månadskostnad — och du får en kostnadsfri prova-på-helförsäkring vid köp.",
    cta: "Läs mer här",
    href: "/tjanster/finansiering",
    bild: `${BAS}tjanst-finansiering.webp`,
  },
  {
    titel: "Garanti",
    text: "Vi erbjuder en trygg affär med vår trafiksäkerhetsgaranti från köpdatumet. Välj den täckning som passar dina behov.",
    cta: "Läs mer här",
    href: "/tjanster/garanti",
    bild: `${BAS}tjanst-garanti.webp`,
  },
];

/** Snabbfakta — ersätter den tidigare numrerade fördelar-sektionen. */
const FAKTA = [
  {
    titel: "Varudeklaration",
    text: "Följer med vid varje affär och visar bilens skick.",
  },
  {
    titel: "Inbyte",
    text: "Lämna din gamla bil som del av betalningen.",
  },
  {
    titel: "Kostnadsfri värdering",
    text: "Vi värderar din bil utan att det kostar dig något.",
  },
  {
    titel: "Hemleverans",
    text: "Vi kan leverera bilen hem till dig.",
  },
];

export default function Tjanster() {
  return (
    <section className="shell py-14 lg:py-20">
      <h2 className="max-w-xl">Allt du behöver för en trygg affär</h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {TJANSTER.map((t) => (
          <article key={t.titel} className="card flex flex-col overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
              <Image
                src={t.bild}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3>{t.titel}</h3>
              <p className="small mt-2 flex-1 text-mist">{t.text}</p>
              <Link href={t.href} className="btn btn-ghost mt-4 self-start">
                {t.cta} →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Snabbfakta */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FAKTA.map((f) => (
          <div key={f.titel} className="card p-5">
            <h4 className="text-base font-semibold">{f.titel}</h4>
            <p className="small mt-1.5 text-mist">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
