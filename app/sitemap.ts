import type { MetadataRoute } from "next";
import { allSeeds } from "@/lib/chunkr/seeds";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now },
    { url: `${siteUrl}/seeds`, lastModified: now },
    ...allSeeds.map((seed) => ({
      url: `${siteUrl}/seeds/${seed.slug}`,
      lastModified: now
    }))
  ];
}
