/** Återanvändbara skeleton-byggstenar (shimmer via .skelett i globals.css). */

export function Skelett({ className = "" }: { className?: string }) {
  return <div className={`skelett ${className}`} aria-hidden="true" />;
}

/** Platshållare i bilkortens form (bild + titel + spec-piller + pris). */
export function BilkortSkelett() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[6px] border border-line bg-card">
      <div className="skelett aspect-[3/2] w-full" aria-hidden="true" />
      <div className="flex flex-col gap-3 p-3">
        <Skelett className="h-5 w-2/3 rounded-sm" />
        <Skelett className="h-4 w-full rounded-sm" />
        <div className="mt-1 flex gap-1.5">
          <Skelett className="h-6 w-12 rounded-sm" />
          <Skelett className="h-6 w-16 rounded-sm" />
          <Skelett className="h-6 w-12 rounded-sm" />
        </div>
        <div className="mt-2 flex items-end justify-between">
          <Skelett className="h-6 w-24 rounded-sm" />
          <Skelett className="h-5 w-16 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

/** Ett rutnät av kort-skelett (default 6). */
export function BilkortSkelettGrid({
  antal = 6,
  className = "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
}: {
  antal?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: antal }).map((_, i) => (
        <BilkortSkelett key={i} />
      ))}
    </div>
  );
}
