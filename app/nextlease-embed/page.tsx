import type { Metadata } from "next";
import NextleaseWidget from "@/app/components/NextleaseWidget";
import { DEALER_UID } from "@/lib/nextlease";

/**
 * Bar embed-yta för Nextlease-widgeten. Laddas ENDAST i en iframe från /objekt
 * (app/objekt/NextleaseFrame.tsx) för att isolera widgetens globala CSS/JS.
 * Ska inte indexeras och länkas inte i navigationen. Widgeten läser sin egen
 * hash (`#/details/{uid}`) från iframens URL, så deep-links funkar.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NextleaseEmbedPage() {
  return (
    <main className="p-4 lg:p-6">
      <NextleaseWidget uid={DEALER_UID} />
    </main>
  );
}
