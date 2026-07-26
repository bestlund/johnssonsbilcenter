const FRAGOR = [
  {
    fraga: "Hur kan jag veta om min bil är redo för försäljning eller inbyte?",
    svar: "Vi rekommenderar att du genomför en noggrann inspektion av din bil för att bedöma dess skick och värde. Du kan också kontakta oss för en kostnadsfri bedömning och rådgivning om försäljning eller inbyte.",
  },
  {
    fraga:
      "Vad är fördelarna med att köpa en begagnad bil från S. Johnsson Bilcenter?",
    svar: "Vi erbjuder ett brett utbud av högkvalitativa begagnade bilar som har genomgått noggrann inspektion och reparation vid behov. Dessutom erbjuder vi konkurrenskraftiga priser och flexibel bilfinansiering för att göra bilköpet så enkelt och prisvärt som möjligt för våra kunder.",
  },
  {
    fraga:
      "Vilka åtgärder bör jag vidta innan jag besöker er för att köpa en bil?",
    svar: "Innan ditt besök hos oss rekommenderar vi att du forskar om olika bilmodeller och priser, samt att du fastställer din budget och dina behov. Dessutom är det en bra idé att kontakta oss i förväg för att boka en provkörning och få personlig rådgivning baserat på dina önskemål och preferenser.",
  },
];

/** §7.6 Accordion — rad-för-rad, padding 16px 0, fråga 15px/500, + roterar 45°. */
export default function Faq() {
  return (
    <section className="shell max-w-3xl py-14 lg:py-20">
      <h2>Bra att veta</h2>

      <div className="mt-8">
        {FRAGOR.map((f) => (
          <details key={f.fraga} className="group border-b border-line py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
              <span className="text-[15px] font-medium">{f.fraga}</span>
              <span
                aria-hidden
                className="shrink-0 text-xl leading-none text-cobalt-400 transition-transform duration-150 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="small mt-3 text-mist">{f.svar}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
