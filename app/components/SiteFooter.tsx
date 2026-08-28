import Image from "next/image";
import Link from "next/link";
import { FORETAG } from "@/lib/site";

const ADRESS = `${FORETAG.adress.gata}, ${FORETAG.adress.postnr} ${FORETAG.adress.ort}`;
const KARTA_LANK = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${FORETAG.namn}, ${ADRESS}`,
)}`;

const KOLUMNER = [
  {
    rubrik: "Tjänster",
    lankar: [
      { label: "Sälj din bil", href: "/salj-din-bil" },
      { label: "Förmedla din bil", href: "/formedling" },
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
  { label: "Instagram", href: "https://www.instagram.com/johnssonbilcenter/" },
  {
    label: "Blocket",
    href: "https://www.blocket.se/mobility/dealer/7323722/johnsson-bilcenter-ab",
  },
];

function PinIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-cobalt-400" aria-hidden="true">
      <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" stroke="currentColor" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" />
    </svg>
  );
}

function TelefonIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-cobalt-400" aria-hidden="true">
      <path
        d="M6.6 3.5c.4 0 .8.3.9.7l1 3a1 1 0 0 1-.25 1L8 9.4a12 12 0 0 0 4.6 4.6l1.2-1.25a1 1 0 0 1 1-.25l3 1c.4.13.7.5.7.9v3a1.5 1.5 0 0 1-1.6 1.5C8.9 18.9 5.1 15.1 4.6 5.1A1.5 1.5 0 0 1 6.1 3.5h.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-cobalt-400" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
      <path d="m4 7.5 8 5.5 8-5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KlockIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="mt-0.5 h-4 w-4 shrink-0 text-cobalt-400" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="shell py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8">
          {/* Varumärke + kontakt (samma ikon-/tonstil som utility-baren i naven) */}
          <div>
            <Image
              src="/bilder/logo-johnsson-bilcenter-vit.webp"
              alt="Johnsson Bilcenter AB"
              width={1920}
              height={427}
              className="h-8 w-auto"
            />
            <p className="small mt-5 max-w-xs text-mist">
              Bilhandlare i Helsingborg. Vi köper, säljer, byter och förmedlar
              begagnade bilar i hela Skåne.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a
                href={KARTA_LANK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2.5 text-mist transition-colors hover:text-linen active:opacity-70"
              >
                <PinIkon />
                <span className="underline underline-offset-2">{ADRESS}</span>
              </a>
              <a
                href="tel:+46733029019"
                className="inline-flex items-center gap-2.5 text-mist transition-colors hover:text-linen active:opacity-70"
              >
                <TelefonIkon />
                <span className="data">073-302 90 19</span>
              </a>
              <a
                href="mailto:Johnssonsbilcenter@gmail.com"
                className="inline-flex items-center gap-2.5 break-all text-mist transition-colors hover:text-linen active:opacity-70"
              >
                <MailIkon />
                Johnssonsbilcenter@gmail.com
              </a>
              <p className="inline-flex items-start gap-2.5 text-mist">
                <KlockIkon />
                <span>
                  Mån–fre 10:00–18:00
                  <br />
                  Lör 11:00–15:00
                </span>
              </p>
            </div>
          </div>

          {KOLUMNER.map((kol) => (
            <div key={kol.rubrik}>
              <h4 className="caption text-fog">{kol.rubrik}</h4>
              <ul className="mt-4 space-y-2.5">
                {kol.lankar.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="small text-mist transition-colors hover:text-linen active:opacity-70"
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
                    className="small text-mist transition-colors hover:text-linen active:opacity-70"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-fog sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {FORETAG.namn} · Org.nr {FORETAG.orgnr}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/integritetspolicy"
              className="transition-colors hover:text-linen active:opacity-70"
            >
              Integritetspolicy
            </Link>
            <a
              href="/llms.html"
              className="transition-colors hover:text-linen active:opacity-70"
            >
              llms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
