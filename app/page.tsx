import SiteHeader from "@/app/components/SiteHeader";
import HeroA from "@/app/components/hero/HeroA";
import Tjanster from "@/app/components/Tjanster";
import Grundare from "@/app/components/Grundare";
import Oppettider from "@/app/components/Oppettider";
import Omdomen from "@/app/components/Omdomen";
import Faq from "@/app/components/Faq";
import Kontaktformular from "@/app/components/Kontaktformular";
import SiteFooter from "@/app/components/SiteFooter";

/**
 * Startsida. Sektionsordning enligt Jakobs lag — transaktionellt först,
 * berättande sedan. Hero-varianten är låst till A; HeroA innehåller sitt eget
 * lagerurval (bilkort), så ingen separat BilarILager behövs här.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroA />
        <Oppettider />
        <Omdomen />
        <Grundare />
        <Tjanster />
        <Faq />
        <Kontaktformular />
      </main>
      <SiteFooter />
    </>
  );
}
