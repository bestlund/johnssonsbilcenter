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
    </section>
  );
}
