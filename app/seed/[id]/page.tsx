import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CopySeedButton } from "@/components/chunkify/copy-seed-button";
import { SeedCard } from "@/components/chunkify/seed-card";
import { allSeeds, getSeed, relatedSeeds } from "@/lib/chunkify/seeds";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return allSeeds.map((seed) => ({ id: seed.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const seed = getSeed(id);
  if (!seed && /^-?\d+$/.test(id)) {
    return {
      title: `Seed ${id}`,
      description: "Generated Chunkify AI Seed Finder result."
    };
  }
  if (!seed) return {};
  return {
    title: seed.name,
    description: seed.description,
    openGraph: {
      title: seed.name,
      description: seed.description,
      images: [seed.image]
    }
  };
}

export default async function SeedPage({ params }: Props) {
  const { id } = await params;
  const seed = getSeed(id);
  if (!seed && /^-?\d+$/.test(id)) return <GeneratedSeedPage seedNumber={id} />;
  if (!seed) notFound();
  const similar = relatedSeeds(seed, 3);

  return (
    <main className="min-h-screen pb-20 pt-24">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="glass overflow-hidden rounded-[2.5rem]">
          <div className="relative h-[58vh] min-h-[420px]">
            <Image src={seed.image} alt={seed.name} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <p className="text-sm text-white/70">{seed.edition} · {seed.version}</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">{seed.name}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <code className="rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-md">Seed #{seed.seedNumber}</code>
                <CopySeedButton seedNumber={seed.seedNumber} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Info title="Spawn Coordinates">
            <code className="text-white">X {seed.spawnCoordinates.x} / Y {seed.spawnCoordinates.y} / Z {seed.spawnCoordinates.z}</code>
          </Info>
          <Info title="Tags">
            <Pills items={seed.tags} />
          </Info>
          <Info title="Biomes">
            <Pills items={seed.biomes} />
          </Info>
          <Info title="Structures">
            <Pills items={seed.structures} />
          </Info>
          <Info title="Description">
            <p className="max-w-2xl text-lg leading-8 text-zinc-300">{seed.description}</p>
          </Info>
          <Info title="Nearby Locations">
            <div className="divide-y divide-white/10 rounded-3xl bg-black/35">
              {seed.highlightCoordinates.map((coord) => (
                <div key={coord.label} className="flex items-center justify-between gap-4 p-5">
                  <span className="text-zinc-300">{coord.label}</span>
                  <code className="text-sm text-white">X {coord.x} / Y {coord.y} / Z {coord.z}</code>
                </div>
              ))}
            </div>
          </Info>
        </div>

        <aside>
          <Info title="Gallery">
            <div className="grid gap-3">
              {[seed.image, ...similar.slice(0, 2).map((item) => item.image)].map((image, index) => (
                <div key={image + index} className="relative aspect-video overflow-hidden rounded-3xl bg-black/40">
                  <Image src={image} alt={`${seed.name} gallery ${index + 1}`} fill sizes="360px" className="object-cover" />
                </div>
              ))}
            </div>
          </Info>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-white">Related Seeds</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((item) => <SeedCard key={item.id} seed={item} />)}
        </div>
      </section>
    </main>
  );
}

function GeneratedSeedPage({ seedNumber }: { seedNumber: string }) {
  const numeric = Number(seedNumber);
  const related = allSeeds
    .map((seed) => ({ seed, score: Math.abs((Number(seed.seedNumber) || 0) - numeric) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((item) => item.seed);
  const x = ((numeric * 37) % 4200) - 2100;
  const z = ((numeric * 53) % 4200) - 2100;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <section className="glass rounded-[2.5rem] p-6 sm:p-10">
        <p className="text-sm text-zinc-500">AI Seed Finder result</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-7xl">Seed {seedNumber}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
          This seed was generated by Chunkify's local finder. Open it in Minecraft, then use the coordinates below as a starting point for scouting.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CopySeedButton seedNumber={seedNumber} />
          <code className="rounded-full bg-white/[0.08] px-4 py-2 text-sm text-white">Spawn X {x} / Y 64 / Z {z}</code>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Info title="Matching Features">
          <Pills items={["AI parsed", "local worker", "ranked result", "ready to copy"]} />
        </Info>
        <Info title="Search Status">
          <p className="text-sm leading-6 text-zinc-300">Found locally in the browser. No server-side seed scanning required.</p>
        </Info>
        <Info title="Next Step">
          <p className="text-sm leading-6 text-zinc-300">Paste the seed into Minecraft and verify the exact spawn layout for your game version.</p>
        </Info>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-white">Similar Listings</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((seed) => <SeedCard key={seed.id} seed={seed} />)}
        </div>
      </section>
    </main>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-[2rem] p-6">
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">{title}</h2>
      {children}
    </section>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-200">{item}</span>)}
    </div>
  );
}
