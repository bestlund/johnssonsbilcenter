import SiteHeader from "@/app/components/SiteHeader";
import HeroA from "@/app/components/hero/HeroA";
import HeroB from "@/app/components/hero/HeroB";
import HeroC from "@/app/components/hero/HeroC";
import HeroValjare from "@/app/components/hero/HeroValjare";
import BilarILager from "@/app/components/BilarILager";
import Tjanster from "@/app/components/Tjanster";
import Grundare from "@/app/components/Grundare";
import Oppettider from "@/app/components/Oppettider";
import Omdomen from "@/app/components/Omdomen";
import Faq from "@/app/components/Faq";
import Kontaktformular from "@/app/components/Kontaktformular";
import SiteFooter from "@/app/components/SiteFooter";

/**
 * Sektionsordning enligt Jakobs lag — transaktionellt först, berättande sedan.
 *
 * OBS: hero-varianterna A/B/C + väljaren är TILLFÄLLIGA för jämförelse.
 * När valet är gjort: behåll en variant, ta bort de andra, väljaren och
 * searchParams-logiken (då blir sidan statisk igen).
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ hero?: string }>;
}) {
  const variant = (await searchParams).hero ?? "c";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {variant === "a" ? <HeroA /> : variant === "b" ? <HeroB /> : <HeroC />}
        {/* Variant A innehåller lagerurvalet själv */}
        {variant !== "a" && <BilarILager />}
        <Oppettider />
        <Omdomen />
        <Grundare />
        <Tjanster />
        <Faq />
        <Kontaktformular />
      </main>
      <SiteFooter />
      <HeroValjare aktiv={variant} />
    </>
  );
}
