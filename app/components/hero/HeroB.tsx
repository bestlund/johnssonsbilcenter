import Image from "next/image";
import Link from "next/link";
import { hamtaFordon } from "@/lib/nextlease";
import { hamtaGoogleOmdomen } from "@/lib/googleReviews";
import GoogleOmdomeBadge from "@/app/components/GoogleOmdomeBadge";
import { byggVal, RUBRIK, BRODTEXT, Pil } from "./heroVal";

const HERO_BILD = "/bilder/simon-start.webp";

/**
 * Variant B — rubrik och brödtext vänsterställt, bild till höger, och
 * valen som en sammanhållen enhet under. Använder full shell-bredd så
 * sektionen ligger i linje med övriga sektioner på sidan.
 */
export default async function HeroB() {
  const { totalt } = await hamtaFordon(1);
  const omdomen = await hamtaGoogleOmdomen();
  const val = byggVal(totalt);

  return (
    <section className="shell py-24 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)]">{RUBRIK}</h1>
          <p className="body-lg mt-8 max-w-lg text-mist">{BRODTEXT}</p>
          <GoogleOmdomeBadge data={omdomen} />
        </div>

        {/* Porträtt — högre yta eftersom bilden är stående */}
        <div className="relative h-[440px] w-full overflow-hidden rounded-lg border border-line bg-elevated lg:h-[600px]">
          <Image
            src={HERO_BILD}
            alt="Simon Johnsson, grundare och ägare"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Sammanhållen valgrupp — hårlinjer istället för mellanrum */}
      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {val.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="group flex items-start gap-3.5 bg-page p-6 transition-colors hover:bg-card"
          >
            <span className="shrink-0 text-cobalt-400">{v.ikon}</span>
            <span className="flex-1">
              <span className="block font-semibold transition-colors group-hover:text-cobalt-400">
                {v.titel}
              </span>
              <span className="small mt-0.5 block text-mist">{v.text}</span>
            </span>
            <span className="shrink-0 text-mist transition-transform group-hover:translate-x-1 group-hover:text-cobalt-400">
              {Pil}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
