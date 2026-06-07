import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chunkify - Minecraft Seed Discovery",
    template: "%s | Chunkify"
  },
  description: "Discover, search, map, and locally find incredible Minecraft world seeds.",
  openGraph: {
    title: "Chunkify",
    description: "Discover incredible Minecraft worlds.",
    url: siteUrl,
    siteName: "Chunkify",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="site-bg" aria-hidden="true" />
        <div className="site-tint" aria-hidden="true" />
        <header className="fixed left-0 right-0 top-0 z-50">
          <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 text-white sm:px-8">
            <Link href="/" className="font-['Times_New_Roman',Times,serif] text-2xl tracking-normal">Chunkify</Link>
            <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-white/75 shadow-2xl backdrop-blur-2xl sm:flex sm:items-center sm:gap-5">
              <Link href="/seeds" className="transition hover:text-white">Seeds</Link>
              <Link href="/map" className="ml-4 transition hover:text-white sm:ml-0">Map</Link>
              <Link href="/finder" className="ml-4 transition hover:text-white sm:ml-0">Finder</Link>
            </div>
          </nav>
        </header>
        <div className="relative z-10">{children}</div>
        <footer className="relative z-10 mx-auto max-w-7xl px-5 py-10 text-sm text-white/45 sm:px-8">
          Chunkify. Built for fast world discovery.
        </footer>
      </body>
    </html>
  );
}
