"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  barn?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Våra objekt", href: "/bilar" },
  {
    label: "Sälj bil",
    href: "/salj-din-bil",
    barn: [
      { label: "Sälj din bil till oss", href: "/salj-din-bil" },
      { label: "Förmedla din bil", href: "/formedling" },
    ],
  },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kontakta oss", href: "/kontakt" },
];

const ADRESS = "Florettgatan 8, 254 67 Helsingborg";
const KARTA_LANK = `https://maps.google.com/maps?q=${encodeURIComponent(
  `Johnsson Bilcenter AB, ${ADRESS}`,
)}`;

function ChevronIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TelefonIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className={className} aria-hidden="true">
      <path
        d="M6.6 3.5c.4 0 .8.3.9.7l1 3a1 1 0 0 1-.25 1L8 9.4a12 12 0 0 0 4.6 4.6l1.2-1.25a1 1 0 0 1 1-.25l3 1c.4.13.7.5.7.9v3a1.5 1.5 0 0 1-1.6 1.5C8.9 18.9 5.1 15.1 4.6 5.1A1.5 1.5 0 0 1 6.1 3.5h.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className={className} aria-hidden="true">
      <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" stroke="currentColor" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" />
    </svg>
  );
}

function KlockIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
      <path d="m4 7.5 8 5.5 8-5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * §7.9 Navigation. Två lager:
 *  1. Utility-bar (sekundär info: adress → maps, öppettider, e-post) — döljs på
 *     mobil och scrollar bort.
 *  2. Huvudnav — sticky (top-0), solid bg + underkant. Telefon kvar som CTA.
 * Aktiv sida markeras via usePathname → därför klientkomponent.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const arAktiv = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header>
      {/* 1. Utility-bar — döljs på mobil, ligger i normalt flöde (scrollar bort) */}
      <div className="hidden border-b border-line bg-card lg:block">
        <div className="shell flex items-center justify-between gap-6 py-2 text-xs text-mist">
          <div className="flex items-center gap-6">
            <a
              href={KARTA_LANK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-linen"
            >
              <PinIkon className="h-3.5 w-3.5 text-cobalt-400" />
              {ADRESS}
            </a>
            <span className="inline-flex items-center gap-1.5">
              <KlockIkon className="h-3.5 w-3.5 text-cobalt-400" />
              Mån–fre 10:00–18:00 · Lör 11:00–15:00
            </span>
          </div>
          <a
            href="mailto:Johnssonsbilcenter@gmail.com"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-linen"
          >
            <MailIkon className="h-3.5 w-3.5 text-cobalt-400" />
            Johnssonsbilcenter@gmail.com
          </a>
        </div>
      </div>

      {/* 2. Huvudnav — sticky, solid bg, underkant */}
      <div className="sticky top-0 z-40 border-b border-line bg-page">
        <div className="shell grid grid-cols-[1fr_auto_1fr] items-center gap-8 py-5">
          <Link
            href="/"
            className="justify-self-start"
            aria-label="Johnsson Bilcenter AB — till startsidan"
          >
            <Image
              src="/bilder/logo-johnsson-bilcenter-vit.webp"
              alt="Johnsson Bilcenter AB"
              width={1920}
              height={427}
              priority
              className="h-7 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-8 justify-self-center lg:flex">
            {NAV.map((item) => {
              const aktiv =
                arAktiv(item.href) || !!item.barn?.some((b) => arAktiv(b.href));
              return item.barn ? (
                // Dropdown (CSS-only: group-hover + focus-within). pt-3 bildar en
                // osynlig "brygga" så hovern inte tappas mellan trigger och panel.
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    aria-current={aktiv ? "page" : undefined}
                    className={`small inline-flex items-center gap-1 transition-colors group-hover:text-linen group-focus-within:text-linen ${
                      aktiv ? "text-linen" : "text-mist hover:text-linen"
                    }`}
                  >
                    {item.label}
                    <ChevronIkon className="h-3 w-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[210px] rounded-lg border border-line-strong bg-card p-1.5 shadow-lg">
                      {item.barn.map((b) => (
                        <Link
                          key={b.href}
                          href={b.href}
                          aria-current={arAktiv(b.href) ? "page" : undefined}
                          className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-elevated hover:text-linen ${
                            arAktiv(b.href) ? "bg-elevated text-linen" : "text-mist"
                          }`}
                        >
                          {b.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={aktiv ? "page" : undefined}
                  className={`small transition-colors ${
                    aktiv ? "text-linen" : "text-mist hover:text-linen"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a
            href="tel:+46733029019"
            className="hidden items-center gap-2 justify-self-end text-sm font-medium text-mist transition-colors hover:text-linen sm:flex"
          >
            <TelefonIkon className="h-4 w-4 text-cobalt-400" />
            073-302 90 19
          </a>
        </div>
      </div>
    </header>
  );
}
