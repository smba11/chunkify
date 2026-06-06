import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Crown, Mountain, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/brand/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/seeds/search-bar";
import { SeedCard } from "@/components/seeds/seed-card";
import { popularCategories } from "@/lib/chunkify/constants";
import { getApprovedSeeds } from "@/lib/chunkify/mock-data";

export default function HomePage() {
  const seeds = getApprovedSeeds();
  const featured = seeds.filter((seed) => seed.featured).slice(0, 3);
  const trending = seeds.filter((seed) => seed.trendingRank).slice(0, 4);
  const newest = [...seeds].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).slice(0, 4);

  return (
    <main>
      <section className="estate-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/45 to-background" />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <MotionReveal>
            <div className="relative z-10">
              <Badge variant="premium" className="mb-5">Premium seed marketplace</Badge>
              <h1 className="max-w-4xl font-[var(--font-display)] text-5xl font-semibold leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Discover Your Next Minecraft World
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Browse rare villages, cinematic build sites, speedrun-ready spawns, and mansion estates with real coordinates, valuation scores, and curated imagery.
              </p>
              <div className="mt-8 max-w-3xl">
                <SearchBar />
              </div>
              <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
                {[
                  ["100", "sample listings"],
                  ["92", "avg top score"],
                  ["8", "curated categories"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-2xl font-semibold text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <div className="relative z-10 hidden lg:block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-card shadow-2xl">
                <Image
                  src={featured[0].thumbnail}
                  alt="Luxury Minecraft terrain preview"
                  fill
                  priority
                  sizes="45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge variant="premium">Featured estate</Badge>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{featured[0].name}</h2>
                  <p className="mt-2 text-sm text-white/70">{featured[0].description}</p>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Featured Seeds</p>
            <h2 className="mt-2 text-3xl font-semibold">Signature world estates</h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/seeds">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((seed, index) => <SeedCard key={seed.id} seed={seed} priority={index === 0} />)}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Popular Categories</p>
            <h2 className="mt-2 text-3xl font-semibold">Shop by world lifestyle</h2>
            <p className="mt-4 text-muted-foreground">From practical survival parcels to prestige cherry grove build sites, every category is tuned for how players actually choose a world.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popularCategories.map((category, index) => {
              const Icon = [Mountain, Building2, Crown, Sparkles][index % 4];
              return (
                <Link key={category} href={`/seeds?category=${encodeURIComponent(category)}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/35 hover:bg-white/[0.07]">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 font-medium">{category}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Trending Seeds</h2>
            <Badge variant="premium">Live mock analytics</Badge>
          </div>
          <div className="space-y-3">
            {trending.map((seed) => (
              <Card key={seed.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{seed.name}</p>
                  <p className="text-sm text-muted-foreground">{seed.views.toLocaleString()} views · {seed.edition}</p>
                </div>
                <Badge variant="success">#{seed.trendingRank}</Badge>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Newest Seeds</h2>
            <Button asChild variant="secondary" size="sm"><Link href="/seeds?sort=newest">Browse newest</Link></Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {newest.map((seed) => <SeedCard key={seed.id} seed={seed} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
