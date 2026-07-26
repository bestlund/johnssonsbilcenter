import Image from "next/image";
import Link from "next/link";

const NAV = [
  { label: "Våra objekt", href: "/bilar" },
  { label: "Förmedling", href: "/formedling" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kontakta oss", href: "/kontakt" },
];

/** §7.9 Navigation. Telefon + snabblänkar Köp/Sälj ligger högst upp (Jakobs lag). */
export default function SiteHeader() {
  return (
    <header className="sticky top-4 z-40 px-4 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 rounded-lg border border-line bg-card/90 px-5 py-3 backdrop-blur-md">
        <Link href="/" className="shrink-0" aria-label="Johnsson Bilcenter AB — till startsidan">
          <Image
            src="/bilder/logo-johnsson-bilcenter-vit.webp"
            alt="Johnsson Bilcenter AB"
            width={1920}
            height={427}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
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

        <div className="flex items-center gap-2">
          {/* Telefon synlig direkt, inte bara i footern */}
          <a
            href="tel:+46733029019"
            className="btn btn-secondary data hidden sm:inline-flex"
          >
            073-302 90 19
          </a>
          <Link href="/salj-din-bil" className="btn btn-secondary">
            Sälj bil
          </Link>
          <Link href="/bilar" className="btn btn-primary">
            Köp bil
          </Link>
        </div>
      </div>
    </header>
  );
}
