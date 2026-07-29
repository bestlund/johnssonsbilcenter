import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Om oss — Johnsson Bilcenter i Helsingborg",
  description:
    "Vi siktar på att bli Sveriges största märkesoberoende bilfirma. Hos oss får privatpersoner bästa möjligheten att köpa, sälja, byta och värdera sina begagnade bilar.",
};

const VARDEORD = ["Omtanke", "Service", "Trygghet", "Passion"];

const ERBJUDER = [
  "Högkvalitativa begagnade bilar som kontrolleras innan de når dig.",
  "Flexibel finansiering anpassad efter din månadskostnad, utan kontantinsats.",
  "Garantier och servicepaket som gör hela bilaffären trygg och säker.",
  "Personlig service där vi lyssnar och skräddarsyr lösningar för just dig.",
];

export default function OmOss() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* 1. Start — centrerad rubrik + ingress + värdeord, stor bild, statement.
            Allt ligger på .shell-bredd (~1360px) så sidan är enhetlig med resten. */}
        <section className="shell pt-16 lg:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[clamp(2.5rem,6vw,4rem)]">
              Vi siktar på att bli Sveriges största märkesoberoende bilfirma
            </h1>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {VARDEORD.map((ord) => (
                <li key={ord} className="badge badge-neutral">
                  {ord}
                </li>
              ))}
            </ul>
          </div>

          {/* Stor bild — full shell-bredd, 16:9 (object-cover behåller proportioner) */}
          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-lg bg-elevated">
            <Image
              src="/bilder/om-oss-showroom.jpg"
              alt="Bilar i vårt showroom hos Johnsson Bilcenter"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Statement */}
          <h2 className="mt-20 max-w-4xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight lg:mt-24">
            Med lång erfarenhet inom fordonshandel har vi vuxit till en trygg och
            pålitlig bilhandlare för privatpersoner i Helsingborg.
          </h2>
        </section>

        {/* 2. Grundaren — tätt under statementet (litet top-gap så de hänger ihop),
            utan egen rubrik. id="grundaren" behålls för ankarlänkar. */}
        <section id="grundaren" className="shell scroll-mt-24 pt-16 pb-16 lg:pt-24 lg:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            <div className="relative mx-auto aspect-square w-64 shrink-0 overflow-hidden rounded-lg bg-elevated lg:w-72">
              <Image
                src="/bilder/simon-portratt.webp"
                alt="Simon Johnsson, grundare och ägare"
                fill
                sizes="(max-width: 1024px) 256px, 288px"
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold">Simon Johnsson</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                <li className="badge badge-primary">Grundare &amp; ägare</li>
              </ul>
              <p className="body-lg mt-6 max-w-3xl text-mist">
                &ldquo;Från en ung ålder har bilar varit min passion. Efter att
                ha arbetat på stora aktörer inom bilbranschen och offrat mycket
                för att förverkliga min dröm är mitt mål nu att bli Sveriges
                största märkesoberoende bilhandlare. Med passion och engagemang
                strävar jag efter att erbjuda våra kunder den bästa möjliga
                upplevelsen och de mest tillförlitliga bilarna på
                marknaden.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* 3. Vad vi erbjuder — ett kort med punktlista */}
        <section className="shell pb-16 lg:pb-24">
          <div className="card p-6 lg:p-10">
            <h2>Vad vi erbjuder</h2>
            <p className="mt-4 max-w-xl text-mist">
              Vi prioriterar dina unika behov och erbjuder skräddarsydda
              lösningar som gör bilköpet till en smidig upplevelse.
            </p>
            <ul className="mt-6 space-y-3">
              {ERBJUDER.map((text) => (
                <li key={text} className="flex gap-3 text-mist">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt-400" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link href="/bilar" className="btn btn-secondary mt-8">
              Se våra objekt
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
