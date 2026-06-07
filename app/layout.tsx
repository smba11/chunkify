import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chunkr - Minecraft Seed Discovery",
    template: "%s | Chunkr"
  },
  description: "Discover incredible Minecraft worlds with a minimal, fast seed browser.",
  openGraph: {
    title: "Chunkr",
    description: "Discover incredible Minecraft worlds.",
    url: siteUrl,
    siteName: "Chunkr",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="fixed left-0 right-0 top-0 z-50">
          <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 text-white sm:px-8">
            <Link href="/" className="text-xl font-semibold tracking-tight">Chunkr</Link>
            <div className="flex items-center gap-5 text-sm text-white/75">
              <Link href="/seeds" className="transition hover:text-white">Seeds</Link>
              <Link href="/admin" className="transition hover:text-white">Admin</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
