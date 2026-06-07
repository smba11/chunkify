import type { Metadata } from "next";
import { SeedCard } from "@/components/chunkify/seed-card";
import { browseSeeds } from "@/lib/chunkify/seeds";

export const metadata: Metadata = {
  title: "Seeds",
  description: "Browse Minecraft world seeds on Chunkify."
};

const filters = ["Java", "Bedrock", "Village", "Mansion", "Stronghold", "Ancient City", "Trial Chamber", "Ruined Portal", "Plains", "Cherry Grove", "Jungle", "Desert", "Snow", "Ocean"];

type Props = {
  searchParams: Promise<{ q?: string; filter?: string | string[]; sort?: string; page?: string }>;
};

export default async function SeedsPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeFilters = Array.isArray(params.filter) ? params.filter : params.filter ? [params.filter] : [];
  const seeds = browseSeeds({ query: params.q, filters: activeFilters, sort: params.sort });
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const visibleCount = page * 12;
  const visibleSeeds = seeds.slice(0, visibleCount);
  const hasMore = visibleCount < seeds.length;
  const buildHref = (next: { filters?: string[]; sort?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    (next.filters ?? activeFilters).forEach((filter) => query.append("filter", filter));
    if (next.sort ?? params.sort) query.set("sort", next.sort ?? params.sort ?? "");
    if (next.page && next.page > 1) query.set("page", String(next.page));
    return `/seeds${query.size ? `?${query.toString()}` : ""}`;
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Browse</h1>
          <p className="mt-3 text-zinc-400">{seeds.length} curated seeds. Keep it simple, find a world, copy the number.</p>
        </div>
        <form action="/seeds" className="glass-search flex w-full max-w-xl items-center px-5 py-3">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search village, island, cherry grove..."
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
        </form>
      </div>

      <section className="mb-8 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const active = activeFilters.includes(filter);
            const nextFilters = active ? activeFilters.filter((item) => item !== filter) : [...activeFilters, filter];
            return (
              <a
                key={filter}
                href={buildHref({ filters: nextFilters })}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  active ? "bg-white text-black" : "bg-white/[0.08] text-zinc-300 hover:bg-white/15 hover:text-white"
                }`}
              >
                {filter}
              </a>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ["popular", "Popular"],
            ["newest", "Newest"],
            ["rated", "Highest Rated"]
          ].map(([value, label]) => (
            <a
              key={value}
              href={buildHref({ sort: value })}
              className={`rounded-full px-4 py-2 text-sm transition hover:bg-white/15 hover:text-white ${
                params.sort === value ? "bg-white text-black" : "bg-black/25 text-zinc-300"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleSeeds.map((seed, index) => <SeedCard key={seed.id} seed={seed} priority={index < 4} />)}
        </div>
        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <a href={buildHref({ page: page + 1 })} className="rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90">
              Load more
            </a>
          </div>
        ) : null}
        {!visibleSeeds.length ? (
          <div className="glass grid min-h-80 place-items-center rounded-[2rem] text-center">
            <div>
              <p className="text-xl font-medium text-white">No seeds found</p>
              <p className="mt-2 text-sm text-zinc-400">Try a softer search or remove a filter.</p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
