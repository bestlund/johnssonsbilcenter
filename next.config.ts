import type { NextConfig } from "next";

/**
 * 301/308-redirects från gamla Framer-URL:er → nya sökvägar.
 *
 * VIKTIGT: Next matchar `source` SKIFTLÄGESOKÄNSLIGT (path-to-regexp default).
 * Därför:
 *  1. Räcker EN post per gammal URL oavsett Framers versaler (`/finansiering`
 *     fångar även `/Finansiering`) — inga versaldubbletter behövs.
 *  2. Får `source` (i lowercase) ALDRIG vara samma som `to`, annars loopar den.
 *     `/Om-oss → /om-oss` gjorde just det (fångade även korrekta /om-oss) → togs
 *     bort. `/Om-oss` når /om-oss via Next-routingen i stället.
 * `permanent: true` = 308 (Google behandlar det som 301, för över ranking).
 */
const OMDIRIGERINGAR: { from: string; to: string }[] = [
  { from: "/Kontakta-oss", to: "/kontakt" },
  { from: "/Boka-ett-möte", to: "/kontakt" },
  { from: "/Sälj-din-bil", to: "/salj-din-bil" },
  { from: "/Våra-objekt", to: "/bilar" }, // hash (#/) når aldrig servern
  { from: "/Förmedling", to: "/formedling" },
  { from: "/integritets-policy", to: "/integritetspolicy" },
  { from: "/finansiering", to: "/tjanster/finansiering" },
  { from: "/garanti", to: "/tjanster/garanti" },
  { from: "/värdering", to: "/salj-din-bil" },
  { from: "/hemleverans", to: "/" },
];

const nextConfig: NextConfig = {
  // Sälj-formuläret bifogar bilder (komprimeras klient-side först). Höj gränsen
  // från default 1MB så några komprimerade foton får plats.
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      // Fordonsbilder från Nextlease CDN. Övriga bilder ligger lokalt
      // i /public/bilder — Framer-beroendet är avvecklat.
      { protocol: "https", hostname: "dattd4s4rdse4.cloudfront.net" },
      // Google-recensenternas avatarer (Places API).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async redirects() {
    return OMDIRIGERINGAR.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    }));
  },
  async rewrites() {
    // AI-/sökmotor-faktasida servad på /llms.html (matchar branschpraxis) men
    // implementerad som /llms-routen.
    return [{ source: "/llms.html", destination: "/llms" }];
  },
};

export default nextConfig;
