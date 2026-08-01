import Image from "next/image";
import Link from "next/link";
import { bildUrl, formatTal, type Fordon } from "@/lib/nextlease";

/**
 * Fordonskort — används på startsidan och i vår egen /bilar-browse.
 * Hela kortet länkar till bilens detaljvy i Nextlease-widgeten på /objekt
 * (`/objekt#/details/{uid}` — den enda fungerande deep-linken).
 */
export default function Bilkort({ fordon: f }: { fordon: Fordon }) {
  const specar = [
    String(f.modelYear),
    f.gearBoxType,
    f.fuelType,
    `${formatTal(f.mileage)} mil`,
  ].filter(Boolean);

  return (
    <Link
      href={`/objekt#/details/${f.uid}`}
      className="group flex flex-col overflow-hidden rounded-[6px] border border-line bg-card transition duration-150 hover:border-highlight active:scale-[0.99] motion-reduce:active:scale-100"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-elevated">
        {f.vehicleImage && (
          <Image
            src={bildUrl(f.vehicleImage)}
            alt={`${f.brand} ${f.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-base font-bold leading-snug">
          {f.brand} {f.model}
        </h3>
        <p className="mt-1 line-clamp-2 text-base text-mist">
          {f.modelDescription}
        </p>

        {/* Spec-piller — samma stil som widgetkorten */}
        <ul className="mt-3 flex flex-wrap gap-1">
          {specar.map((s, i) => (
            <li
              key={i}
              className="rounded-sm border border-line-strong px-2 py-1 text-[12px] text-mist"
            >
              {s}
            </li>
          ))}
        </ul>

        {/* Pris + månadspris, ingen avdelare — som widgetkorten */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="data text-lg font-extrabold text-linen">
            {formatTal(f.price)}{" "}
            <span className="text-sm font-semibold text-fog">kr</span>
          </p>
          {f.monthlyPrice > 0 && (
            <p className="data text-sm font-extrabold text-cobalt-400">
              {formatTal(f.monthlyPrice)}{" "}
              <span className="text-xs font-semibold text-fog">kr/mån</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
