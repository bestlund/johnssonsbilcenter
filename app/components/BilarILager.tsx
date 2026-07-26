import Link from "next/link";
import { hamtaSlumpadeFordon } from "@/lib/nextlease";
import Bilkort from "@/app/components/Bilkort";

/**
 * Visar 4 slumpvis valda fordon ur lagret (Nextlease API), renderade i vårt
 * eget designsystem istället för den inbäddade widgeten. Inget hårdkodat urval
 * — nya bilar varje besök, borttagna bilar försvinner automatiskt. Korten
 * länkar till bilens detaljvy i widgeten.
 */
export default async function BilarILager() {
  const { fordon, totalt } = await hamtaSlumpadeFordon(4);

  // Kunde vi inte nå API:et döljer vi sektionen hellre än att visa ett tomt block.
  if (fordon.length === 0) return null;

  return (
    <section className="shell py-14 lg:py-20">
      {/* Kompaktare block — 4 mindre kort, centrerat i stället för fullbredd. */}
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2>Ett urval ur vårt lager</h2>
          <Link href="/bilar" className="btn btn-secondary">
            Se alla bilar{totalt ? ` (${totalt})` : ""}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {fordon.map((f) => (
            <Bilkort key={f.uid} fordon={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
