import Image from "next/image";
import Link from "next/link";
import type { Seed } from "@/types/chunkify";

export function SeedCard({ seed, priority = false }: { seed: Seed; priority?: boolean }) {
  return (
    <Link href={`/seed/${seed.slug}`} className="group block">
      <article className="glass overflow-hidden rounded-[1.7rem] transition duration-300 hover:-translate-y-1 hover:bg-black/45">
        <div className="relative aspect-[1.22] overflow-hidden">
          <Image
            src={seed.image}
            alt={seed.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {seed.edition}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-medium text-white">{seed.name}</h3>
            <p className="mt-1 text-sm text-white/65">Seed #{seed.seedNumber}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-zinc-300">{seed.tags.slice(0, 3).join(" • ")}</p>
        </div>
      </article>
    </Link>
  );
}
