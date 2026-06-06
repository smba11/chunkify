import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Download, MapPin, MessageCircle, Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScoreRing } from "@/components/seeds/score-ring";
import { SeedActions } from "@/components/seeds/seed-actions";
import { getApprovedSeeds, getSeedBySlug } from "@/lib/chunkify/mock-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getApprovedSeeds().slice(0, 40).map((seed) => ({ slug: seed.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seed = getSeedBySlug(slug);
  if (!seed) return {};
  return {
    title: seed.name,
    description: seed.description,
    openGraph: {
      title: seed.name,
      description: seed.description,
      images: [seed.thumbnail]
    }
  };
}

export default async function SeedDetailPage({ params }: Props) {
  const { slug } = await params;
  const seed = getSeedBySlug(slug);
  if (!seed) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: seed.name,
    description: seed.description,
    image: seed.images,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: seed.rating,
      reviewCount: seed.ratingsCount
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="premium">{seed.edition}</Badge>
            <Badge variant="secondary">{seed.version}</Badge>
            {seed.categories.slice(0, 3).map((category) => <Badge key={category} variant="outline">{category}</Badge>)}
          </div>
          <h1 className="text-4xl font-semibold tracking-normal lg:text-5xl">{seed.name}</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{seed.description}</p>
        </div>
        <div className="min-w-72">
          <SeedActions seedNumber={seed.seedNumber} title={seed.name} />
        </div>
      </div>

      <section className="grid gap-3 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
          <Image src={seed.images[0]} alt={`${seed.name} main gallery image`} fill priority sizes="65vw" className="object-cover" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {seed.images.slice(1, 3).map((image, index) => (
            <div key={image} className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
              <Image src={image} alt={`${seed.name} gallery image ${index + 2}`} fill sizes="35vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Valuation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ScoreRing value={seed.scores.seed} label="Seed Score" />
              <ScoreRing value={seed.scores.rarity} label="Rarity Score" />
              <ScoreRing value={seed.scores.builder} label="Builder Score" />
              <ScoreRing value={seed.scores.survival} label="Survival Score" />
              <ScoreRing value={seed.scores.explorer} label="Explorer Score" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="estate-grid relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-black/30">
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_30px_rgba(214,179,106,0.7)]" />
                {seed.coordinates.map((coord, index) => (
                  <div
                    key={coord.label}
                    className="absolute rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs backdrop-blur"
                    style={{ left: `${16 + (index * 17) % 70}%`, top: `${18 + (index * 23) % 64}%` }}
                  >
                    {coord.type}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coordinate List</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-b-lg p-0">
              <div className="divide-y divide-white/10">
                {seed.coordinates.map((coord) => (
                  <div key={coord.label} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-medium">{coord.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{coord.note}</p>
                    </div>
                    <code className="rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm text-primary">
                      X {coord.x} / Y {coord.y} / Z {coord.z}
                    </code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Ratings</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 fill-primary text-primary" />
                  <p className="text-3xl font-semibold">{seed.rating}</p>
                  <p className="text-sm text-muted-foreground">from {seed.ratingsCount} reviews</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>"Spawn feels impossibly polished. The village route is perfect for a survival base."</p>
                <Separator />
                <p>"Strong builder value. The ridge line photographs beautifully at sunrise."</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Seed Information</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <InfoRow label="Seed Number" value={seed.seedNumber} />
              <InfoRow label="Version" value={seed.version} />
              <InfoRow label="Edition" value={seed.edition} />
              <InfoRow label="Spawn" value={`${seed.spawn.x}, ${seed.spawn.y}, ${seed.spawn.z}`} />
              <InfoRow label="Upload Date" value={new Date(seed.uploadDate).toLocaleDateString()} />
              <div className="flex items-center gap-3 pt-2">
                <Avatar>
                  <AvatarImage src={seed.authorAvatar} alt={seed.author} />
                  <AvatarFallback>{seed.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{seed.author}</p>
                  <p className="text-muted-foreground">@{seed.authorUsername}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Location Highlights</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[...seed.structures, ...seed.biomes].slice(0, 10).map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Market Activity</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><Download className="h-4 w-4" /> Downloads</span>{seed.downloads.toLocaleString()}</p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><MessageCircle className="h-4 w-4" /> Comments</span>{Math.round(seed.ratingsCount / 2)}</p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Coordinates</span>{seed.coordinates.length}</p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><User className="h-4 w-4" /> Author</span>{seed.author}</p>
              <p className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /> Listed</span>2026</p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[190px] text-right font-medium">{value}</span>
    </p>
  );
}
