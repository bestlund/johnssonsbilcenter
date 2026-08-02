export const FRAGOR = [
  {
    fraga: "Hur kan jag veta om min bil är redo för försäljning eller inbyte?",
    svar: "Enklast är att höra av dig till oss. Vi tittar på bilen och ger dig en kostnadsfri värdering, helt utan krångel.",
  },
  {
    fraga:
      "Vad är fördelarna med att köpa en begagnad bil från Johnsson Bilcenter?",
    svar: "Varje bil är genomgången innan den når dig, och du får hjälp med finansiering om du vill. Vårt mål är att bilköpet ska kännas enkelt, inte krångligt.",
  },
  {
    fraga:
      "Vilka åtgärder bör jag vidta innan jag besöker er för att köpa en bil?",
    svar: "Ring eller mejla gärna innan du kommer, så har vi bilen redo och kan boka in en provkörning direkt. Extra bra att höra av sig i förväg, eftersom bilarna ofta säljs snabbt.",
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
            <summary className="pressable -mx-3 flex cursor-pointer list-none items-center justify-between gap-6 rounded-md px-3 py-1">
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
