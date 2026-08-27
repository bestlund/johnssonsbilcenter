import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { Skelett, BilkortSkelettGrid } from "@/app/components/Skelett";

/** Laddningsskelett för /bilar (dynamisk route). Speglar sidans layout. */
export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="shell pt-16 pb-10 lg:pt-24 lg:pb-14">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <Skelett className="h-9 w-48 rounded-md" />
            <Skelett className="h-5 w-28 rounded-md" />
          </div>

          <div className="lg:grid lg:grid-cols-[264px_1fr] lg:gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="rounded-lg border border-line bg-card p-5">
                <Skelett className="h-6 w-20 rounded-md" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="mt-5 border-t border-line pt-4">
                    <Skelett className="h-4 w-24 rounded-sm" />
                    <div className="mt-3 space-y-2.5">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <Skelett key={j} className="h-4 w-full rounded-sm" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Toppbar + rutnät */}
            <div>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <Skelett className="h-11 flex-1 rounded-lg" />
                <Skelett className="h-11 w-full rounded-lg sm:w-44" />
              </div>
              <BilkortSkelettGrid antal={6} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
