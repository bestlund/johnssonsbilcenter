import Image from "next/image";
import Link from "next/link";

const KOLUMNER = [
  {
    rubrik: "Tjänster",
    lankar: [
      { label: "Sälj din bil", href: "/salj-din-bil" },
      { label: "Förmedling", href: "/formedling" },
      { label: "Finansiering", href: "/tjanster/finansiering" },
      { label: "Garanti", href: "/tjanster/garanti" },
    ],
  },
  {
    rubrik: "Johnsson Bilcenter",
    lankar: [
      { label: "Våra objekt", href: "/bilar" },
      { label: "Om oss", href: "/om-oss" },
      { label: "Träffa grundaren", href: "/om-oss#grundaren" },
      { label: "Kontakta oss", href: "/kontakt" },
    ],
  },
];

const SOCIALA = [
  { label: "Instagram", href: "https://www.instagram.com/sjohnssonbilcenter/" },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61555954300776",
  },
  {
    label: "Blocket",
    href: "https://www.blocket.se/butik/sjohnsson-bilcenter-ab",
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="shell py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/bilder/logo-johnsson-bilcenter-vit.webp"
              alt="Johnsson Bilcenter AB"
              width={1920}
              height={427}
              className="h-8 w-auto"
            />
            <p className="small mt-5 text-mist">
              Florettgatan 8
              <br />
              254 67 Helsingborg
            </p>
            <p className="small mt-3">
              <a href="tel:+46733029019" className="link data">
                073-302 90 19
              </a>
            </p>
          </div>

          {KOLUMNER.map((kol) => (
            <div key={kol.rubrik}>
              <h4 className="caption text-fog">{kol.rubrik}</h4>
              <ul className="mt-4 space-y-2.5">
                {kol.lankar.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="small text-mist transition-colors hover:text-linen"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="caption text-fog">Följ oss</h4>
            <ul className="mt-4 space-y-2.5">
              {SOCIALA.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-mist transition-colors hover:text-linen"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-fog sm:flex-row">
          <p>© {new Date().getFullYear()} Johnsson Bilcenter AB</p>
          <p>Mån–fre 10:00–18:00 · Lör 11:00–15:00</p>
        </div>
      </div>
    </footer>
  );
}
