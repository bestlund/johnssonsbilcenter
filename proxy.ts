import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Skiftlägeskänsliga redirects som `next.config.ts` inte klarar.
 *
 * next.config:s `redirects()` matchar skiftlägesOKÄNSLIGT (path-to-regexp
 * default). När en gammal Framer-URL bara skiljer sig i versal från sitt mål
 * (t.ex. `/Om-oss` → `/om-oss`) fångar regeln även den korrekta lowercase-sidan
 * och skapar en oändlig loop. Här gör vi i stället en EXAKT (skiftlägeskänslig)
 * matchning som bara träffar den gamla versalvarianten, inte den riktiga sidan.
 */
const EXAKTA_REDIRECTS: Record<string, string> = {
  "/Om-oss": "/om-oss",
};

export function proxy(request: NextRequest) {
  const mal = EXAKTA_REDIRECTS[request.nextUrl.pathname];
  if (mal) {
    const url = request.nextUrl.clone();
    url.pathname = mal;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Kör bara proxyn för dessa gamla URL:er (matcher är okänslig, men den exakta
  // objekt-uppslagningen ovan hindrar loop på den korrekta lowercase-sidan).
  matcher: ["/Om-oss"],
};
