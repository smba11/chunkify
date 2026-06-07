import type { MetadataRoute } from "next";
import { allSeeds } from "@/lib/chunkify/seeds";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now },
    { url: `${siteUrl}/seeds`, lastModified: now },
    { url: `${siteUrl}/map`, lastModified: now },
    { url: `${siteUrl}/finder`, lastModified: now },
    ...allSeeds.map((seed) => ({
      url: `${siteUrl}/seed/${seed.slug}`,
      lastModified: now
    }))
  ];
}
