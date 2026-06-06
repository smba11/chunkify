import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SeedListing } from "@/types/chunkify";

export function SeedCard({ seed, priority = false }: { seed: SeedListing; priority?: boolean }) {
  return (
    <Card className="group overflow-hidden bg-white/[0.045]">
      <Link href={`/seeds/${seed.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={seed.thumbnail}
            alt={`${seed.name} terrain preview`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="premium">{seed.edition}</Badge>
            <Badge variant="secondary">{seed.version}</Badge>
          </div>
          <Button variant="secondary" size="icon" className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/35 backdrop-blur">
            <Heart className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Seed Score {seed.scores.seed}</p>
              <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-white">{seed.name}</h3>
            </div>
            <div className="rounded-md border border-white/15 bg-black/35 px-2 py-1 text-xs text-white backdrop-blur">
              {seed.seedNumber.slice(0, 11)}
            </div>
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {seed.biomes.slice(0, 3).map((biome) => (
            <Badge key={biome} variant="outline">{biome}</Badge>
          ))}
          {seed.structures.slice(0, 2).map((structure) => (
            <Badge key={structure} variant="secondary">{structure}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {seed.views.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {seed.rating} ({seed.ratingsCount})
          </span>
        </div>
      </div>
    </Card>
  );
}
