import { FORETAG, SITE_URL, SOCIALA } from "@/lib/site";
import type { GoogleOmdomen } from "@/lib/googleReviews";
import { FRAGOR } from "./Faq";

/** Renderar ett JSON-LD-script (schema.org) i sidan. */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
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
