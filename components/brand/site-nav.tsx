import Link from "next/link";
import { Compass, Gem, Home, Shield, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/seeds", label: "Listings" },
  { href: "/upload", label: "Upload" },
  { href: "/admin", label: "Admin" }
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
            <Gem className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Chunkify</p>
            <p className="hidden text-xs text-muted-foreground sm:block">Luxury Minecraft seed listings</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/seeds?sort=highest-rated">
              <Compass className="h-4 w-4" />
              Explore
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/sign-in">
              <Shield className="h-4 w-4" />
              Sign in
            </Link>
          </Button>
          <Button asChild variant="secondary" size="icon" className="md:hidden">
            <Link href="/upload" aria-label="Upload seed">
              <Upload className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
