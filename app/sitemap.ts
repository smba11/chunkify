import type { MetadataRoute } from "next";
import { getApprovedSeeds } from "@/lib/chunkify/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now },
    { url: `${siteUrl}/seeds`, lastModified: now },
    { url: `${siteUrl}/upload`, lastModified: now },
    ...getApprovedSeeds().slice(0, 100).map((seed) => ({
      url: `${siteUrl}/seeds/${seed.slug}`,
      lastModified: new Date(seed.uploadDate)
    }))
  ];
}
