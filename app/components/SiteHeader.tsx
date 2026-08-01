"use client";

import { useEffect, useState } from "react";
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

function MenyIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function StangIkon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" />
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

  const [meny, setMeny] = useState(false);

  // Stäng vid sidbyte.
  useEffect(() => {
    setMeny(false);
  }, [pathname]);

  // Escape stänger + lås body-scroll medan drawern är öppen.
  useEffect(() => {
    if (!meny) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMeny(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [meny]);

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
              className="inline-flex items-center gap-1.5 transition-colors hover:text-linen active:opacity-70"
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
        {/* Mobil: logga = auto (naturlig bredd, kapas aldrig → ingen stretch),
            mitten 1fr trycker hamburgaren till höger. lg: 1fr_auto_1fr för
            centrerad nav. */}
        <div className="shell grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
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
              className="h-9 w-auto lg:h-10"
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
                    className={`small inline-flex items-center gap-1 transition-colors active:opacity-70 group-hover:text-linen group-focus-within:text-linen ${
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
                          className={`pressable block rounded-md px-3 py-2 text-sm transition-colors hover:bg-elevated hover:text-linen ${
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
                  className={`small transition-colors active:opacity-70 ${
                    aktiv ? "text-linen" : "text-mist hover:text-linen"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <a
              href="tel:+46733029019"
              className="hidden items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-linen active:opacity-70 sm:flex"
            >
              <TelefonIkon className="h-4 w-4 text-cobalt-400" />
              073-302 90 19
            </a>

            {/* Hamburgare — endast under lg (desktop har full nav) */}
            <button
              type="button"
              onClick={() => setMeny(true)}
              aria-label="Öppna meny"
              aria-expanded={meny}
              className="pressable -mr-2.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-linen transition-colors hover:bg-elevated lg:hidden"
            >
              <MenyIkon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobil drawer — slide-in från vänster, täcker ~86% av skärmen.
          Alltid monterad så att både öppning och stängning animeras. */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          meny ? "" : "pointer-events-none"
        }`}
        aria-hidden={!meny}
      >
        {/* Backdrop */}
        <button
          type="button"
          tabIndex={meny ? 0 : -1}
          aria-label="Stäng meny"
          onClick={() => setMeny(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            meny ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Huvudmeny"
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col border-r border-line bg-page shadow-2xl transition-transform duration-300 ease-out ${
            meny ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Topp: logga + stäng */}
          <div className="flex items-center justify-between px-6 py-5">
            <Link href="/" aria-label="Johnsson Bilcenter AB — till startsidan">
              <Image
                src="/bilder/logo-johnsson-bilcenter-vit.webp"
                alt="Johnsson Bilcenter AB"
                width={1920}
                height={427}
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMeny(false)}
              aria-label="Stäng meny"
              className="pressable -mr-1 inline-flex h-10 w-10 items-center justify-center rounded-md text-mist transition-colors hover:bg-elevated hover:text-linen"
            >
              <StangIkon className="h-6 w-6" />
            </button>
          </div>

          {/* Tunn linje som bryter av mot menyvalen. Platt lista — undermenyn
              (Sälj/Förmedla) visas som egna val, ingen rubrik, konsekvent spacing. */}
          <nav className="flex flex-col border-t border-line px-3 py-4">
            {NAV.flatMap((item) => (item.barn ? item.barn : [item])).map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={arAktiv(item.href) ? "page" : undefined}
                  className={`pressable self-start rounded-md px-3 py-3 text-[17px] font-medium transition-colors ${
                    arAktiv(item.href)
                      ? "text-linen"
                      : "text-mist hover:text-linen"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Botten — samlad kontakt. Ordning: telefon → öppettider → adress.
              Den inaktiva öppettidsraden ligger mellan de två tap-målen (ringer /
              öppnar Maps) som en buffert → färre felträffar på touch. Utility-baren
              är desktop-only så detta är enda stället infon finns på mobil. */}
          <div className="mt-auto flex flex-col gap-4 border-t border-line px-6 py-6 text-sm">
            <a
              href="tel:+46733029019"
              className="inline-flex items-center gap-3 text-mist transition-colors hover:text-linen active:opacity-70"
            >
              <TelefonIkon className="h-5 w-5 shrink-0 text-cobalt-400" />
              073-302 90 19
            </a>
            <p className="inline-flex items-start gap-3 text-mist">
              <KlockIkon className="mt-0.5 h-5 w-5 shrink-0 text-cobalt-400" />
              <span>
                Mån–fre 10:00–18:00
                <br />
                Lör 11:00–15:00
              </span>
            </p>
            <a
              href={KARTA_LANK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-3 text-mist transition-colors hover:text-linen active:opacity-70"
            >
              <PinIkon className="mt-0.5 h-5 w-5 shrink-0 text-cobalt-400" />
              <span className="underline underline-offset-2">{ADRESS}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
