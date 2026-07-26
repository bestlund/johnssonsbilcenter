import Link from "next/link";
import { hamtaFordon, formatTal } from "@/lib/nextlease";

const BilIkon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5">
    <path
      d="M4 15h16M6.5 15V11l1.8-3.8A2 2 0 0 1 10.1 6h3.8a2 2 0 0 1 1.8 1.2L17.5 11v4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="16.5" r="1.4" stroke="currentColor" />
    <circle cx="16" cy="16.5" r="1.4" stroke="currentColor" />
  </svg>
);

const PrislappIkon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5">
    <path
      d="M3.5 11.5V4.5a1 1 0 0 1 1-1h7l9 9-8 8-9-9Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1.3" stroke="currentColor" />
  </svg>
);

const KlockIkon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" />
    <path
      d="M12 7.5V12l3 1.8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Pil = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-4 w-4">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default async function Hero() {
  // Antalet bilar hämtas live — samma cachade anrop som "Bilar i lager".
  const { totalt } = await hamtaFordon(1);

  const VAL = [
    {
      titel: "Köpa bil",
      text: totalt
        ? `${formatTal(totalt)} bilar i lager, varudeklaration ingår`
        : "Se våra bilar i lager",
      href: "/bilar",
      ikon: BilIkon,
    },
    {
      titel: "Sälja bil",
      text: "Rättvist bud direkt eller via förmedling",
      href: "/salj-din-bil",
      ikon: PrislappIkon,
    },
    {
      titel: "Boka tid",
      text: "Boka visning eller provkörning",
      href: "/boka-mote",
      ikon: KlockIkon,
    },
  ];

  return (
    <section className="shell pb-10 pt-8 lg:pb-14 lg:pt-10">
      <div className="card grid gap-10 p-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-14">
        {/* Vänster: budskap */}
        <div>
          <h1>
            Gör ett <em>smart</em> bilköp med Johnsson Bilcenter
          </h1>
          <p className="body-lg mt-6 max-w-md text-mist">
            Vi säljer, köper, byter och förmedlar begagnade bilar — med
            varudeklaration på varje affär.
          </p>
        </div>

        {/* Höger: uppgiftsstyrda val som lista med avdelare */}
        <ul className="border-t border-line">
          {VAL.map((v) => (
            <li key={v.href} className="border-b border-line">
              <Link
                href={v.href}
                className="group flex items-center gap-4 py-5 transition-colors"
              >
                <span className="shrink-0 text-cobalt-400">{v.ikon}</span>
                <span className="flex-1">
                  <span className="block font-semibold transition-colors group-hover:text-cobalt-400">
                    {v.titel}
                  </span>
                  <span className="small block text-mist">{v.text}</span>
                </span>
                <span className="shrink-0 text-mist transition-transform group-hover:translate-x-1 group-hover:text-cobalt-400">
                  {Pil}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
