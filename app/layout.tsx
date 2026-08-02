import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { SITE_URL, FORETAG } from "@/lib/site";
import "./globals.css";

// §2 Typografi — Hanken Grotesk för rubriker/UI/brödtext, JetBrains Mono för data.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Begagnade bilar i Helsingborg | Johnsson Bilcenter",
    template: "%s | Johnsson Bilcenter",
  },
  description: FORETAG.beskrivning,
  alternates: { canonical: "/" },
  applicationName: FORETAG.kortnamn,
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: FORETAG.kortnamn,
    url: SITE_URL,
    title: "Begagnade bilar i Helsingborg | Johnsson Bilcenter",
    description: FORETAG.beskrivning,
    images: [
      {
        url: "/bilder/og-delningsbild.png",
        width: 1200,
        height: 630,
        alt: "Johnsson Bilcenter — bilhandlare i Helsingborg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Begagnade bilar i Helsingborg | Johnsson Bilcenter",
    description: FORETAG.beskrivning,
    images: ["/bilder/og-delningsbild.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${hanken.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
