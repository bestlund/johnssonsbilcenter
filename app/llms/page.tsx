import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { FORETAG, SOCIALA } from "@/lib/site";
import { hamtaGoogleOmdomen } from "@/lib/googleReviews";
import { hamtaAllaFordon } from "@/lib/nextlease";

export const metadata: Metadata = {
  title: "Företagsinformation (för AI & sökmotorer)",
  description:
    "Strukturerad information om Johnsson Bilcenter AB i Helsingborg — tjänster, fakta och kontaktuppgifter, formaterat för AI-assistenter och sökmotorer.",
  alternates: { canonical: "/llms.html" },
};

const ADRESS = `${FORETAG.adress.gata}, ${FORETAG.adress.postnr} ${FORETAG.adress.ort}`;

const ERBJUDER = [
  "Köp av begagnade bilar",
  "Försäljning av begagnade bilar (vi köper din bil)",
  "Inbyte av bil",
  "Bilförmedling (vi säljer bilen åt dig)",
  "Kostnadsfri värdering",
  "Finansiering i samarbete med flera partners",
  "Garanti på köpta bilar (6–24 månader)",
];

const TJANSTER = [
  { label: "Köpa bil", href: "/bilar", text: "Bläddra och filtrera bland alla bilar i lager." },
  { label: "Sälj din bil", href: "/salj-din-bil", text: "Kostnadsfri värdering, rättvist bud, ofta samma dag." },
  { label: "Förmedla din bil", href: "/formedling", text: "Vi sköter hela försäljningen åt dig." },
  { label: "Finansiering", href: "/tjanster/finansiering", text: "Upplägg anpassat efter din ekonomi." },
  { label: "Garanti", href: "/tjanster/garanti", text: "Trygghet som håller i sig efter köpet." },
];

const SIDOR = [
  { label: "Om oss", href: "/om-oss", text: "Om företaget och grundaren Simon Johnsson." },
  { label: "Kontakta oss", href: "/kontakt", text: "Telefon, e-post, adress och kontaktformulär." },
  { label: "Integritetspolicy", href: "/integritetspolicy", text: "GDPR och dataskydd." },
];

function Rad({ etikett, children }: { etikett: string; children: React.ReactNode }) {
  return (
    <li className="text-mist">
      <strong className="font-semibold text-linen">{etikett}:</strong> {children}
    </li>
  );
}

export default async function Llms() {
  const omdomen = await hamtaGoogleOmdomen();
  const { totalt } = await hamtaAllaFordon();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell max-w-3xl py-16">
          <h1>{FORETAG.namn}</h1>
          <blockquote className="mt-5 border-l-2 border-cobalt-500 pl-4 text-mist">
            {FORETAG.beskrivning}
          </blockquote>

          <h2 className="mt-12">Företagsinformation</h2>
          <ul className="mt-4 space-y-2">
            <Rad etikett="Juridiskt namn">{FORETAG.namn}</Rad>
            <Rad etikett="Organisationsnummer">{FORETAG.orgnr}</Rad>
            <Rad etikett="Varumärke">{FORETAG.kortnamn}</Rad>
            <Rad etikett="Bransch">Begagnade bilar / bilhandel</Rad>
            <Rad etikett="Grundare & ägare">Simon Johnsson</Rad>
            <Rad etikett="Geografisk marknad">Helsingborg och övriga Skåne</Rad>
            <Rad etikett="Webbplats">www.johnssonsbilcenter.se</Rad>
          </ul>

          <h2 className="mt-12">Om oss</h2>
          <p className="mt-4 text-mist">
            Johnsson Bilcenter är en märkesoberoende bilhandlare i Helsingborg som
            köper, säljer, byter och förmedlar begagnade bilar. Grundaren Simon
            Johnsson driver företaget med målet att bli Sveriges största
            märkesoberoende bilhandlare. Varje bil är genomgången innan den når
            kunden.
          </p>
          <p className="mt-4 font-semibold text-linen">Vi erbjuder bland annat:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-mist">
            {ERBJUDER.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>

          <h2 className="mt-12">Företagsfakta</h2>
          <ul className="mt-4 space-y-2">
            {totalt ? <Rad etikett="Bilar i lager">cirka {totalt}</Rad> : null}
            <Rad etikett="Verksamhetsområde">
              Helsingborg (Florettgatan 8, Berga) och övriga Skåne
            </Rad>
          </ul>

          <h2 className="mt-12">Kundnöjdhet</h2>
          <ul className="mt-4 space-y-2">
            <Rad etikett="Google-betyg">
              {omdomen.betyg.toLocaleString("sv-SE", { minimumFractionDigits: 1 })}{" "}
              av 5, baserat på {omdomen.antal} omdömen (källa: Google)
            </Rad>
          </ul>

          <h2 className="mt-12">Tjänster</h2>
          <ul className="mt-4 space-y-2">
            {TJANSTER.map((t) => (
              <li key={t.href} className="text-mist">
                <Link href={t.href} className="link font-semibold">
                  {t.label}
                </Link>{" "}
                — {t.text}
              </li>
            ))}
          </ul>

          <h2 className="mt-12">Viktiga sidor</h2>
          <ul className="mt-4 space-y-2">
            {SIDOR.map((s) => (
              <li key={s.href} className="text-mist">
                <Link href={s.href} className="link font-semibold">
                  {s.label}
                </Link>{" "}
                — {s.text}
              </li>
            ))}
          </ul>

          <h2 className="mt-12">Kontakt</h2>
          <ul className="mt-4 space-y-2">
            <Rad etikett="Telefon">{FORETAG.telefonVisning}</Rad>
            <Rad etikett="E-post">{FORETAG.epost}</Rad>
            <Rad etikett="Adress">{ADRESS}</Rad>
            <Rad etikett="Öppettider">
              Mån–fre 10:00–18:00, Lör 11:00–15:00
            </Rad>
          </ul>

          <h2 className="mt-12">Sociala medier</h2>
          <ul className="mt-4 list-disc space-y-1 pl-5">
            {SOCIALA.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link break-all"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
