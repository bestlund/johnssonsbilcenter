import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Tillåter alla crawlers — inklusive AI-botar (GPTBot, Google-Extended,
 * PerplexityBot, ClaudeBot m.fl.) — så att sajten kan citeras. Endast den
 * inbäddade widget-routen (`/nextlease-embed`) hålls utanför indexet.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/nextlease-embed"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
