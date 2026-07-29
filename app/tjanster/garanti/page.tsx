import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Garanti — Johnsson Bilcenter i Helsingborg",
  description:
    "Teckna garantier som sträcker sig från 6 till 24 månader beroende på bilens miltal och årsmodell. Välj den täckning som passar dina behov.",
};

export default function Garanti() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell py-16 lg:py-24">
          <div className="max-w-2xl">
          <h1>Garantier för dig</h1>

          <div className="mt-8 space-y-5 text-mist">
            <p className="body-lg">
              För varje fordon i vårt sortiment kan du teckna garantier som
              sträcker sig från 6 till 24 månader, beroende på bilens miltal och
              årsmodell. Vi förstår att köp av en bil är en betydande investering
              och att du som kund vill vara säker på att din bil är väl skyddad.
            </p>
            <p>
              Våra garantier ger dig möjlighet att välja den täckning som passar
              bäst för dina behov och ger dig extra sinnesfrid när du tar din
              nästa körning.
            </p>
          </div>

          <Link href="/kontakt" className="btn btn-primary mt-8">
            Kontakta oss
          </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
