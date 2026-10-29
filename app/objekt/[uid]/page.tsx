import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { FORETAG } from "@/lib/site";
import { bildUrl, formatTal, hamtaFordon } from "@/lib/nextlease";
import NextleaseFrame from "../NextleaseFrame";

/**
 * Bilens egen sida. Samma Nextlease-detaljvy som `/objekt#/details/{uid}`, men
 * uid:t ligger i PATHEN — hashen når aldrig servern, så delade länkar (Discord,
 * Messenger, sms) fick bara sajtens standardbild. Här sätts bilens titel, pris
 * och foto som Open Graph. Såld/okänd bil → layoutens standardmetadata.
 */
export async function generateMetadata({
  params,
}: PageProps<"/objekt/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const f = await hamtaFordon(uid);
  if (!f) return { title: "Bil i lager", robots: { index: false } };

  const titel = `${f.brand} ${f.model} ${f.modelYear} – ${formatTal(f.price)} kr`;
  const beskrivning = [
    f.modelDescription,
    [`${formatTal(f.mileage)} mil`, f.gearBoxType, f.fuelType]
      .filter(Boolean)
      .join(" · "),
  ]
    .filter(Boolean)
    .join(". ");
  // Via Nexts bildoptimerare: Nextlease-CDN:et svarar `text/plain`, vilket
  // Facebook/Messenger m.fl. avvisar som og:image. Optimeraren ger image/jpeg.
  const bild = f.vehicleImage
    ? [
        {
          url: `/_next/image?url=${encodeURIComponent(bildUrl(f.vehicleImage))}&w=1080&q=75`,
          width: 900,
          height: 600,
          alt: `${f.brand} ${f.model}`,
        },
      ]
    : undefined;

  return {
    title: titel,
    description: beskrivning,
    alternates: { canonical: `/objekt/${uid}` },
    openGraph: {
      type: "website",
      locale: "sv_SE",
      siteName: FORETAG.kortnamn,
      url: `/objekt/${uid}`,
      title: titel,
      description: beskrivning,
      ...(bild && { images: bild }),
    },
    twitter: {
      card: "summary_large_image",
      title: titel,
      description: beskrivning,
      ...(bild && { images: bild.map((b) => b.url) }),
    },
  };
}

export default async function ObjektBilPage({
  params,
}: PageProps<"/objekt/[uid]">) {
  const { uid } = await params;
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell pt-16 pb-10 lg:pt-24 lg:pb-14">
          <NextleaseFrame uid={uid} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
