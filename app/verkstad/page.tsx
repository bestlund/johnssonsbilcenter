import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import Tjanster, { type Tjanst } from "@/app/components/Tjanster";
import Oppettider, { type Oppettid } from "@/app/components/Oppettider";
import Faq from "@/app/components/Faq";
import { VerkstadStruktureradData } from "@/app/components/StruktureradData";
import { VERKSTAD } from "@/lib/site";

/**
 * Verkstad — Smart Bilverkstad, eget företag i samma hus som Johnsson.
 * Underlag: verkstad-sida-utkast.md och verkstadens flyer.
 */

export const metadata: Metadata = {
  // absolute → hoppar över layoutens "| Johnsson Bilcenter"-mall (eget varumärke)
  title: { absolute: "Bilverkstad i Helsingborg | Smart Bilverkstad" },
  alternates: { canonical: "/verkstad" },
  description:
    "Bilverkstad i samma hus som Johnsson Bilcenter, Florettgatan 8 i Helsingborg. Kamremsbyte, felsökning, däckskifte och större reparationer. Ring och boka.",
};

const TEL_HREF = `tel:${VERKSTAD.telefon}`;

/** Linjeikon i flyerns stil — cobalt, rundade streck som navens ikoner. */
function Ikon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-11 w-11 text-cobalt-400"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const TJANSTER: Tjanst[] = [
  {
    titel: "Kamremsbyte",
    text: "Kamremmen ska bytas enligt biltillverkarens intervall, i mil eller år beroende på modell. Går den av under körning kan motorn få allvarliga skador. Osäker på när det är dags? Ring så hjälper vi dig att ta reda på det.",
    // Rem runt två remskivor
    ikon: (
      <Ikon>
        <rect x="2.5" y="6.5" width="19" height="11" rx="5.5" />
        <circle cx="8" cy="12" r="2.75" />
        <circle cx="16.5" cy="12" r="1.75" />
      </Ikon>
    ),
  },
  {
    titel: "Felsökning",
    text: "Lyser en varningslampa, låter bilen konstigt eller går den inte som den ska? Vi letar upp felet så att du vet vad som behöver göras.",
    // Förstoringsglas med pulslinje
    ikon: (
      <Ikon>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
        <path d="M6.75 10.75h1.5l1.25-2.5 2 4.5 1.25-2h1.5" />
      </Ikon>
    ),
  },
  {
    titel: "Däckskifte",
    text: "Byte mellan sommar- och vinterdäck. Vinterdäck är krav 1 december–31 mars vid vinterväglag, med minst 3 mm mönsterdjup. Boka i god tid, hösten är högsäsong.",
    // Hjul: däck, fälg, nav och ekrar
    ikon: (
      <Ikon>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
        <path d="M12 7v3.5M12 13.5V17M7 12h3.5M13.5 12H17" />
      </Ikon>
    ),
  },
  {
    titel: "Större reparationer",
    text: "När bilen behöver mer än en snabb åtgärd. Beskriv problemet när du ringer, så berättar vi hur vi kan hjälpa till.",
    // Skiftnyckel
    ikon: (
      <Ikon>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </Ikon>
    ),
  },
];

// Vardagstiderna kommer från verkstadens flyer. Söndag stängt (bekräftat).
const TIDER: Oppettid[] = [
  { dag: "Måndag–fredag", tid: "10:00–18:00" },
  { dag: "Söndag", tid: "Stängt" },
];

// Bara frågor som går att besvara med kända fakta. Däckregler: Transportstyrelsen.
// Svaren är strängar eftersom de även går ut som FAQPage-JSON-LD.
const FRAGOR: { fraga: string; svar: string }[] = [
  {
    fraga: "Hur bokar jag tid?",
    svar: `Ring ${VERKSTAD.telefonVisning} under våra öppettider eller mejla ${VERKSTAD.epost}, så hittar vi en tid som passar dig.`,
  },
  {
    fraga: "Vilka öppettider har verkstaden?",
    svar: "Måndag till fredag 10:00–18:00. På söndagar är verkstaden stängd.",
  },
  {
    fraga: "Var ligger verkstaden?",
    svar: "På Florettgatan 8 i Helsingborg, i samma hus som Johnsson Bilcenter.",
  },
  {
    fraga: "En varningslampa lyser. Kan jag fortsätta köra?",
    svar: "Det beror på färgen. En röd lampa betyder att du ska stanna så snart det är säkert, särskilt om den gäller oljetryck, motortemperatur eller laddning. En gul eller orange lampa är inte lika akut, men boka en felsökning snart så att ett litet fel inte hinner bli en dyr reparation.",
  },
  {
    fraga: "Hur vet jag när kamremmen ska bytas?",
    svar: "Intervallet bestäms av biltillverkaren och anges i mil eller år, beroende på vad som inträffar först. Det står i bilens servicebok eller instruktionsbok. Hittar du det inte, ring oss så hjälper vi dig att ta reda på det.",
  },
  {
    fraga: "När ska jag byta till vinterdäck?",
    svar: "Vinterdäck är krav 1 december–31 mars när det är vinterväglag, med minst 3 mm mönsterdjup. Dubbdäck får användas 1 oktober–15 april, och även utanför den perioden om det är eller väntas bli vinterväglag. Boka i god tid, hösten är högsäsong.",
  },
];

export default function Verkstad() {
  return (
    <>
      <VerkstadStruktureradData fragor={FRAGOR} />
      <SiteHeader />
      <main className="flex-1">
        {/* 1. Hero + öppettider i samma sektion (färre scroll till tiderna) */}
        <section className="shell pb-14 pt-16 lg:pb-20 lg:pt-24">
          <div className="max-w-2xl">
            <h1>
              {VERKSTAD.namn}{" "}
              <span className="block text-cobalt-400">
                i samarbete med Johnsson Bilcenter
              </span>
            </h1>
            <p className="body-lg mt-6 text-mist">
              Bilverkstad på Florettgatan 8 i Helsingborg, i samma hus som
              Johnsson Bilcenter. Vi byter kamrem, felsöker, skiftar däck och tar
              hand om större reparationer. Ring oss, så hittar vi en tid som
              passar dig.
            </p>
            <a href={TEL_HREF} className="btn btn-primary mt-8">
              Ring {VERKSTAD.telefonVisning}
            </a>
          </div>

          <div className="mt-10 lg:mt-12">
            <Oppettider
              inbaddad
              tider={TIDER}
              telefon={{ href: TEL_HREF, visning: VERKSTAD.telefonVisning }}
              epost={VERKSTAD.epost}
            />
          </div>
        </section>

        {/* 2. Tjänster */}
        <Tjanster rubrik="Vi hjälper dig med" tjanster={TJANSTER}>
          <a href={TEL_HREF} className="btn btn-primary">
            Ring {VERKSTAD.telefonVisning}
          </a>
        </Tjanster>

        {/* 3. Samarbetet */}
        <section className="shell py-14 lg:py-20">
          <div className="max-w-2xl">
            <h2>Samma hus som Johnsson Bilcenter</h2>
            <p className="mt-6 text-mist">
              {VERKSTAD.namn} och Johnsson Bilcenter finns på samma adress.
              Köper du bil hos Johnsson har du verkstaden under samma tak.
            </p>
            <Link href="/bilar" className="btn btn-secondary mt-8">
              Se bilarna i lager
            </Link>
          </div>
        </section>

        {/* 4. Bra att veta */}
        <Faq fragor={FRAGOR} />
      </main>
      <SiteFooter />
    </>
  );
}
