import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fordonsbilder från Nextlease CDN. Övriga bilder ligger lokalt
      // i /public/bilder — Framer-beroendet är avvecklat.
      { protocol: "https", hostname: "dattd4s4rdse4.cloudfront.net" },
    ],
  },
};

export default nextConfig;
