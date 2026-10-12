import Image from "next/image";
import Link from "next/link";

const BAS = "/bilder/";

export type Tjanst = {
  titel: string;
  text: string;
  /** Utan cta/href renderas ingen länkknapp. */
  cta?: string;
  href?: string;
  /** Bild överst i kortet … */
  bild?: string;
  /** … eller en ikon ovanför rubriken (kort utan bild, t.ex. /verkstad). */
  ikon?: React.ReactNode;
};

const TJANSTER: Tjanst[] = [
  {
    titel: "Sälj din bil till oss!",
    text: "Vi är experter på begagnade bilar och erbjuder rättvisa priser samt smidig hantering av pappersarbete. Byt även in din bil mot en annan modell med attraktiva inbytespriser.",
    cta: "Sälj din bil nu",
    href: "/salj-din-bil",
    bild: `${BAS}tjanst-salj-din-bil.webp`,
  },
  {
    titel: "Finansiering",
    text: "Vi hittar ett finansieringsupplägg som passar din ekonomi, i samarbete med flera partners. Testa dessutom försäkringen kostnadsfritt i 14 dagar vid köp.",
    cta: "Läs mer här",
    href: "/tjanster/finansiering",
    bild: `${BAS}tjanst-finansiering.webp`,
  },
  {
    titel: "Garanti",
    text: "Trygghet som håller i sig. Teckna garanti på varje bil vi säljer, mellan 6 och 24 månader beroende på miltal och årsmodell.",
    cta: "Läs mer här",
    href: "/tjanster/garanti",
    bild: `${BAS}tjanst-garanti.webp`,
  },
];

/**
 * Startsidans tjänster som default; /verkstad skickar in egna (ikonkort).
 * `children` renderas under korten, t.ex. en CTA.
 */
export default function Tjanster({
  rubrik = "Allt du behöver för en trygg affär",
  tjanster = TJANSTER,
  children,
}: {
  rubrik?: string;
  tjanster?: Tjanst[];
  children?: React.ReactNode;
}) {
  // Fyra kort → 2×2 på mellanbredd, en rad på bred skärm. Annars tre i rad.
  const fyra = tjanster.length === 4;

  return (
    <section className="shell py-14 lg:py-20">
      <h2 className="max-w-xl">{rubrik}</h2>

      <div
        className={`mt-10 grid gap-4 ${
          fyra ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {tjanster.map((t) => (
          <article key={t.titel} className="card flex flex-col overflow-hidden">
            {t.bild && (
              <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
                <Image
                  src={t.bild}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            <div
              className={`flex flex-1 flex-col ${t.bild ? "p-5" : "p-6 lg:p-7"}`}
            >
              {t.ikon && <div className="mb-5">{t.ikon}</div>}
              <h3>{t.titel}</h3>
              <p className="small mt-2 flex-1 text-mist">{t.text}</p>
              {t.href && t.cta && (
                <Link href={t.href} className="btn btn-ghost mt-4 self-start">
                  {t.cta} →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {children && <div className="mt-10">{children}</div>}
    </section>
  );
}
