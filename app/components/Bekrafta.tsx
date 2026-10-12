/**
 * Synlig platshållare för uppgifter som väntar på svar (Simon/verkstaden).
 * Medvetet skrikig så att den inte slinker igenom till produktion —
 * sök på "<Bekrafta" innan publicering, inga träffar ska finnas kvar.
 */
export default function Bekrafta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm border border-dashed border-warning bg-[var(--warning-tint)] px-1.5 py-0.5 text-xs font-medium text-warning">
      BEKRÄFTA: {children}
    </span>
  );
}
