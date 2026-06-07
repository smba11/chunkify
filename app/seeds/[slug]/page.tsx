import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CopySeedButton } from "@/components/chunkr/copy-seed-button";
import { ChunkrSeedCard } from "@/components/chunkr/seed-card";
import { allSeeds, getSeed } from "@/lib/chunkr/seeds";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allSeeds.map((seed) => ({ slug: seed.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seed = getSeed(slug);
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
  const { slug } = await params;
  const seed = getSeed(slug);
  if (!seed) notFound();
  const similar = allSeeds.filter((item) => item.slug !== seed.slug).slice(0, 3);

  return (
    <main className="min-h-screen pb-20">
      <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
        <Image src={seed.image} alt={seed.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/25 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
            <p className="text-sm text-white/70">{seed.edition} · {seed.version}</p>
            <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-7xl">{seed.name}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <code className="rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-md">Seed #{seed.seedNumber}</code>
              <CopySeedButton seedNumber={seed.seedNumber} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          <SimpleSection title="Nearby Structures">
            <div className="flex flex-wrap gap-2">
              {seed.structures.map((item) => <span key={item} className="rounded-full bg-[#111111] px-4 py-2 text-sm text-zinc-300">{item}</span>)}
            </div>
          </SimpleSection>

          <SimpleSection title="Coordinates">
            <div className="divide-y divide-white/10 rounded-3xl bg-[#111111]">
              {seed.coordinates.map((coord) => (
                <div key={coord.label} className="flex items-center justify-between gap-4 p-5">
                  <span className="text-zinc-300">{coord.label}</span>
                  <code className="text-sm text-white">X {coord.x} / Y {coord.y} / Z {coord.z}</code>
                </div>
              ))}
            </div>
          </SimpleSection>

          <SimpleSection title="Description">
            <p className="max-w-2xl text-lg leading-8 text-zinc-300">{seed.description}</p>
          </SimpleSection>
        </div>

        <aside>
          <SimpleSection title="Image Gallery">
            <div className="grid gap-3">
              {[seed.image, ...similar.slice(0, 2).map((item) => item.image)].map((image, index) => (
                <div key={image + index} className="relative aspect-video overflow-hidden rounded-3xl bg-[#111111]">
                  <Image src={image} alt={`${seed.name} gallery ${index + 1}`} fill sizes="340px" className="object-cover" />
                </div>
              ))}
            </div>
          </SimpleSection>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-white">Similar Seeds</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((item) => <ChunkrSeedCard key={item.id} seed={item} />)}
        </div>
      </section>
    </main>
  );
}

function SimpleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {children}
    </section>
  );
}
