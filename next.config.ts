import type { NextConfig } from "next";

/**
 * 301/308-redirects från gamla Framer-URL:er → nya sökvägar. Framer använde
 * versaler + bindestreck (t.ex. /Om-oss). Fyll på listan när hela uppsättningen
 * hämtats från gamla sajtens sitemap.xml. `permanent: true` = 308 (Google
 * behandlar det som 301 och för över ranking-signaler).
 */
const OMDIRIGERINGAR: { from: string; to: string }[] = [
  { from: "/Kontakta-oss", to: "/kontakt" },
  { from: "/Om-oss", to: "/om-oss" },
  { from: "/Boka-ett-möte", to: "/kontakt" },
  { from: "/Sälj-din-bil", to: "/salj-din-bil" },
  { from: "/Våra-objekt", to: "/bilar" }, // hash (#/) når aldrig servern
  { from: "/Förmedling", to: "/formedling" },
  { from: "/Integritets-policy", to: "/integritetspolicy" },
  { from: "/integritets-policy", to: "/integritetspolicy" },
  // Tjänstesidor — riktiga toppnivå-URL:er (bekräftat via site:-sökning), båda
  // skiftlägen då Framer var inkonsekvent.
  { from: "/finansiering", to: "/tjanster/finansiering" },
  { from: "/Finansiering", to: "/tjanster/finansiering" },
  { from: "/garanti", to: "/tjanster/garanti" },
  { from: "/Garanti", to: "/tjanster/garanti" },
  { from: "/värdering", to: "/salj-din-bil" },
  { from: "/Värdering", to: "/salj-din-bil" },
  // Hemleverans saknar motsvarande sida → startsidan tills vidare (bekräfta mål).
  { from: "/hemleverans", to: "/" },
  { from: "/Hemleverans", to: "/" },
];

const nextConfig: NextConfig = {
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
};

export default nextConfig;
