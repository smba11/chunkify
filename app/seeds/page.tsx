import type { Metadata } from "next";
import { SeedCard } from "@/components/chunkify/seed-card";
import { browseSeeds } from "@/lib/chunkify/seeds";

export const metadata: Metadata = {
  title: "Seeds",
  description: "Browse Minecraft world seeds on Chunkify."
};

const filters = ["Java", "Bedrock", "Village", "Mansion", "Stronghold", "Ancient City", "Trial Chamber", "Ruined Portal", "Plains", "Cherry Grove", "Jungle", "Desert", "Snow", "Ocean"];

type Props = {
  searchParams: Promise<{ q?: string; filter?: string | string[]; sort?: string }>;
};

export default async function SeedsPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeFilters = Array.isArray(params.filter) ? params.filter : params.filter ? [params.filter] : [];
  const seeds = browseSeeds({ query: params.q, filters: activeFilters, sort: params.sort });

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Browse seeds</h1>
        <p className="mt-3 text-zinc-400">Search, filter, and open worlds in a few clicks.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="glass rounded-[2rem] p-4 lg:sticky lg:top-28 lg:h-fit">
          <p className="mb-3 text-sm text-zinc-500">Filters</p>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {filters.map((filter) => {
              const active = activeFilters.includes(filter);
              return (
                <a
                  key={filter}
                  href={`/seeds?filter=${encodeURIComponent(filter)}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
                  className={`rounded-full px-4 py-2 text-sm transition lg:w-fit ${
                    active ? "bg-white text-black" : "bg-white/8 text-zinc-300 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {filter}
                </a>
              );
            })}
          </div>
          <div className="mt-6">
            <p className="mb-3 text-sm text-zinc-500">Sort</p>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {[
                ["popular", "Popular"],
                ["newest", "Newest"],
                ["rated", "Highest Rated"]
              ].map(([value, label]) => (
                <a key={value} href={`/seeds?sort=${value}`} className="rounded-full bg-white/8 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/15 hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <section>
          <form action="/seeds" className="glass-search mb-6 flex rounded-[1.5rem] px-5 py-3">
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search seed number, village, island..."
              className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
            />
          </form>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {seeds.map((seed, index) => <SeedCard key={seed.id} seed={seed} priority={index < 3} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
