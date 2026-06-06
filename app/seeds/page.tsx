import type { Metadata } from "next";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InfiniteSeedGrid } from "@/components/seeds/infinite-seed-grid";
import { SearchBar } from "@/components/seeds/search-bar";
import { biomeFilters, editions, structureFilters, versions } from "@/lib/chunkify/constants";
import { filterSeeds } from "@/lib/chunkify/mock-data";
import type { SeedFilters } from "@/types/chunkify";

export const metadata: Metadata = {
  title: "Minecraft Seed Listings",
  description: "Browse premium Minecraft seeds by edition, version, biome, structure, popularity, and rating."
};

type Props = {
  searchParams: Promise<SeedFilters>;
};

export default async function SeedsPage({ searchParams }: Props) {
  const params = await searchParams;
  const seeds = filterSeeds(params);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="premium" className="mb-4">Seed listings</Badge>
          <h1 className="text-4xl font-semibold tracking-normal">Premium Minecraft seed listings</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Filter rare starts by edition, version, biome, structures, and investment-grade world score.
          </p>
        </div>
        <div className="w-full lg:max-w-xl">
          <SearchBar compact />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <Card className="space-y-6 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
              </div>
              <Badge variant="outline">{seeds.length} results</Badge>
            </div>
            <FilterGroup title="Edition" name="edition" values={editions} active={params.edition} />
            <FilterGroup title="Version" name="version" values={versions} active={params.version} />
            <FilterGroup title="Biome" name="biome" values={biomeFilters} active={params.biome} />
            <FilterGroup title="Structures" name="structure" values={structureFilters} active={params.structure} />
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4 text-primary" />
                Sorting
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  ["most-popular", "Most Popular"],
                  ["highest-rated", "Highest Rated"],
                  ["newest", "Newest"],
                  ["most-downloaded", "Most Downloaded"]
                ].map(([value, label]) => (
                  <a key={value} href={`/seeds?sort=${value}`} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {seeds.length} curated world listings</p>
            <Badge variant="secondary">Lazy image grid</Badge>
          </div>
          <InfiniteSeedGrid seeds={seeds} />
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ title, name, values, active }: { title: string; name: string; values: readonly string[]; active?: string }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <a
            key={value}
            href={`/seeds?${name}=${encodeURIComponent(value)}`}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              active === value
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {value}
          </a>
        ))}
      </div>
    </div>
  );
}
