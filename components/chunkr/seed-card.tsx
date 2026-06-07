import Image from "next/image";
import Link from "next/link";
import type { Seed } from "@/types/chunkr";

export function ChunkrSeedCard({ seed, priority = false }: { seed: Seed; priority?: boolean }) {
  return (
    <Link href={`/seeds/${seed.slug}`} className="group block">
      <article className="overflow-hidden rounded-3xl bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1">
        <div className="relative aspect-[1.25] overflow-hidden">
          <Image
            src={seed.image}
            alt={seed.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {seed.edition}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-medium text-white">{seed.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">Seed #{seed.seedNumber}</p>
          <p className="mt-4 text-sm text-zinc-300">{seed.tags.join(" • ")}</p>
        </div>
      </article>
    </Link>
  );
}
