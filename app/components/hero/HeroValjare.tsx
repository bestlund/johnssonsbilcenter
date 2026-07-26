import Link from "next/link";

const VARIANTER = [
  { id: "a", namn: "A", beskrivning: "100dvh med bilar" },
  { id: "b", namn: "B", beskrivning: "Hög, val nertill" },
  { id: "c", namn: "C", beskrivning: "Bryter vikningen" },
];

/**
 * TILLFÄLLIG jämförelsewidget — tas bort när hero-varianten är vald.
 * Byt variant via ?hero=a|b|c
 */
export default function HeroValjare({ aktiv }: { aktiv: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-line-strong bg-card/95 p-2 shadow-lg backdrop-blur">
      <p className="px-1 pb-1.5 text-[10px] uppercase tracking-wider text-fog">
        Hero-variant
      </p>
      <div className="flex gap-1">
        {VARIANTER.map((v) => (
          <Link
            key={v.id}
            href={`/?hero=${v.id}`}
            title={v.beskrivning}
            className={`rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors ${
              aktiv === v.id
                ? "bg-cobalt-500 text-[#0B0D11]"
                : "bg-elevated text-mist hover:text-linen"
            }`}
          >
            {v.namn}
          </Link>
        ))}
      </div>
    </div>
  );
}
