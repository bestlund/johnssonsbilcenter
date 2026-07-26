import Image from "next/image";
import Link from "next/link";

const NAV = [
  { label: "Våra objekt", href: "/bilar" },
  { label: "Förmedling", href: "/formedling" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kontakta oss", href: "/kontakt" },
];

function TelefonIkon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6.6 3.5c.4 0 .8.3.9.7l1 3a1 1 0 0 1-.25 1L8 9.4a12 12 0 0 0 4.6 4.6l1.2-1.25a1 1 0 0 1 1-.25l3 1c.4.13.7.5.7.9v3a1.5 1.5 0 0 1-1.6 1.5C8.9 18.9 5.1 15.1 4.6 5.1A1.5 1.5 0 0 1 6.1 3.5h.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * §7.9 Navigation. Ligger i .shell (samma bredd/padding som alla andra sektioner)
 * så logo och telefon linjerar med sidans innehåll. Grid 1fr/auto/1fr gör att
 * menyn hamnar exakt centrerad. Ingen bakgrund/border/radie och inte sticky.
 */
export default function SiteHeader() {
  return (
    <header className="py-5">
      <div className="shell grid grid-cols-[1fr_auto_1fr] items-center gap-8">
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
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="small text-mist transition-colors hover:text-linen"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href="tel:+46733029019"
          className="hidden items-center gap-2 justify-self-end text-sm font-medium text-mist transition-colors hover:text-linen sm:flex"
        >
          <TelefonIkon className="h-4 w-4 text-cobalt-400" />
          073-302 90 19
        </a>
      </div>
    </header>
  );
}
