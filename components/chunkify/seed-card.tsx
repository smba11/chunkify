import Image from "next/image";
import Link from "next/link";
import type { Seed } from "@/types/chunkify";

export function SeedCard({ seed, priority = false }: { seed: Seed; priority?: boolean }) {
  return (
    <Link href={`/seed/${seed.slug}`} className="group block">
      <article className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-black/28 shadow-[0_22px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-black/38">
        <div className="relative aspect-[0.92] overflow-hidden">
          <Image
            src={seed.image}
            alt={seed.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {seed.edition}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-2 text-lg font-medium leading-tight text-white">{seed.name}</h3>
            <p className="mt-2 truncate text-xs text-white/62">#{seed.seedNumber}</p>
            <p className="mt-1 truncate text-xs text-white/62">{seed.tags.slice(0, 3).join(" • ")}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
