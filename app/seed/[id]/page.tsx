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
