import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/brand/site-nav";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chunkify - Luxury Minecraft Seed Listings",
    template: "%s | Chunkify"
  },
  description: "Browse Minecraft world seeds like premium real estate, with rarity scores, build potential, coordinates, and rich discovery data.",
  openGraph: {
    title: "Chunkify",
    description: "Zillow for Minecraft world seeds.",
    url: siteUrl,
    siteName: "Chunkify",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Chunkify",
    description: "Discover your next Minecraft world."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("dark", inter.variable, playfair.variable)}>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
