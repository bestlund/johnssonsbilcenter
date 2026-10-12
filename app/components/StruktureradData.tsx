import { FORETAG, SITE_URL, SOCIALA, VERKSTAD } from "@/lib/site";
import type { GoogleOmdomen } from "@/lib/googleReviews";
import { FRAGOR } from "./Faq";

/** Renderar ett JSON-LD-script (schema.org) i sidan. `<` escapas mot XSS (Next-docs). */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Strukturerad data för /verkstad: AutoRepair (LocalBusiness) för Smart
 * Bilverkstad. Egen entitet, inte en del av AutoDealer ovan — det är ett eget
 * företag i samma hus. Uppgifterna kommer från VERKSTAD i lib/site.ts.
 * Plus FAQPage från verkstadssidans FAQ.
 */
export function VerkstadStruktureradData({
  fragor,
}: {
  fragor: { fraga: string; svar: string }[];
}) {
  const verkstad = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${SITE_URL}/verkstad#verkstad`,
    name: VERKSTAD.namn,
    url: `${SITE_URL}/verkstad`,
    telephone: VERKSTAD.telefon,
    email: VERKSTAD.epost,
    description: VERKSTAD.beskrivning,
    address: {
      "@type": "PostalAddress",
      streetAddress: VERKSTAD.adress.gata,
      postalCode: VERKSTAD.adress.postnr,
      addressLocality: VERKSTAD.adress.ort,
      addressRegion: VERKSTAD.adress.region,
      addressCountry: VERKSTAD.adress.land,
    },
    areaServed: { "@type": "City", name: "Helsingborg" },
    openingHoursSpecification: VERKSTAD.oppettider.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.dagar,
      opens: o.fran,
      closes: o.til,
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fragor.map((f) => ({
      "@type": "Question",
      name: f.fraga,
      acceptedAnswer: { "@type": "Answer", text: f.svar },
    })),
  };

  return (
    <>
      <JsonLd data={verkstad} />
      <JsonLd data={faq} />
    </>
  );
}

/**
 * Strukturerad data för startsidan: AutoDealer (LocalBusiness) med NAP,
 * öppettider, sociala profiler och live-AggregateRating från Google, samt
 * FAQPage från startsidans FAQ. Det här är det AI Overviews / rich results
 * faktiskt läser om företaget.
 */
export default function StruktureradData({
  omdomen,
}: {
  omdomen: GoogleOmdomen;
}) {
  const foretag = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${SITE_URL}/#foretag`,
    name: FORETAG.namn,
    url: SITE_URL,
    image: `${SITE_URL}/bilder/og-delningsbild.png`,
    logo: `${SITE_URL}/bilder/logo-johnsson-bilcenter-vit.webp`,
    telephone: FORETAG.telefon,
    email: FORETAG.epost,
    description: FORETAG.beskrivning,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: FORETAG.adress.gata,
      postalCode: FORETAG.adress.postnr,
      addressLocality: FORETAG.adress.ort,
      addressRegion: FORETAG.adress.region,
      addressCountry: FORETAG.adress.land,
    },
    areaServed: { "@type": "AdministrativeArea", name: "Skåne" },
    sameAs: SOCIALA,
    openingHoursSpecification: FORETAG.oppettider.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.dagar,
      opens: o.fran,
      closes: o.til,
    })),
    ...(omdomen?.betyg && omdomen?.antal
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: omdomen.betyg,
            reviewCount: omdomen.antal,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FRAGOR.map((f) => ({
      "@type": "Question",
      name: f.fraga,
      acceptedAnswer: { "@type": "Answer", text: f.svar },
    })),
  };

  return (
    <>
      <JsonLd data={foretag} />
      <JsonLd data={faq} />
    </>
  );
}
