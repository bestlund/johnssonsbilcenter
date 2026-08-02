import type { MetadataRoute } from "next";
import { SITE_URL, SIDOR } from "@/lib/site";

/** Alla publika sidor. Inventarie-vyerna ändras ofta → daily. */
export default function sitemap(): MetadataRoute.Sitemap {
  const nu = new Date();
  const ofta = new Set(["/", "/bilar", "/objekt"]);
  return SIDOR.map((s) => ({
    url: `${SITE_URL}${s.path === "/" ? "" : s.path}`,
    lastModified: nu,
    changeFrequency: ofta.has(s.path) ? "daily" : "monthly",
    priority: s.priority,
  }));
}
