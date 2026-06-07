import type { Metadata } from "next";
import { ChunkrSeedCard } from "@/components/chunkr/seed-card";
import { searchSeeds } from "@/lib/chunkr/seeds";

export const metadata: Metadata = {
  title: "Browse Seeds",
  description: "Search and filter Minecraft seeds on Chunkr."
};

const filters = ["Java", "Bedrock", "Village", "Mansion", "Stronghold", "Ancient City"];

type Props = {
  searchParams: Promise<{ q?: string; filter?: string | string[] }>;
};

export default async function SeedsPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeFilters = Array.isArray(params.filter) ? params.filter : params.filter ? [params.filter] : [];
  const seeds = searchSeeds(params.q, activeFilters);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Browse seeds</h1>
        <p className="mt-3 text-zinc-400">A fast, minimal grid of worlds worth opening.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[180px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <p className="mb-3 text-sm text-zinc-500">Filters</p>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {filters.map((filter) => {
              const active = activeFilters.includes(filter);
              return (
                <a
                  key={filter}
                  href={`/seeds?filter=${encodeURIComponent(filter)}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
                  className={`rounded-full px-4 py-2 text-sm transition lg:w-fit ${
                    active ? "bg-white text-black" : "bg-[#111111] text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter}
                </a>
              );
            })}
          </div>
        </aside>

        <section>
          <form action="/seeds" className="mb-6 flex rounded-full border border-white/10 bg-[#111111] px-5 py-3">
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search seed number, village, island..."
              className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
            />
          </form>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {seeds.map((seed, index) => <ChunkrSeedCard key={seed.id} seed={seed} priority={index < 3} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
