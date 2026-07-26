import Image from "next/image";
import Link from "next/link";

const PORTRATT =
  "/bilder/simon-start.webp";

const VARDEORD = ["Omtanke", "Service", "Trygghet", "Passion"];

export default function Grundare() {
  return (
    <section className="shell py-14 lg:py-20">
      <div className="card grid items-center gap-8 p-6 lg:grid-cols-2 lg:gap-14 lg:p-12">
        <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-elevated">
          <Image
            src={PORTRATT}
            alt="Simon Johnsson, grundare och ägare"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2>Simon Johnsson</h2>
          <p className="small mt-1 text-fog">Grundare &amp; ägare</p>

          <p className="body-lg mt-6 text-mist">
            &ldquo;Från en ung ålder har bilar varit min passion. Med åren har
            min vision att starta ett eget bilföretag vuxit starkare. Med passion
            och engagemang strävar jag efter att erbjuda våra kunder den bästa
            möjliga upplevelsen och de mest tillförlitliga bilarna på
            marknaden.&rdquo;
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {VARDEORD.map((ord) => (
              <li key={ord} className="badge badge-neutral">
                {ord}
              </li>
            ))}
          </ul>

          <Link href="/om-oss#grundaren" className="btn btn-secondary mt-8">
            Läs mer om Simon
          </Link>
        </div>
      </div>
    </section>
  );
}
