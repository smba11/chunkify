import seeds from "@/data/seeds.json";
import type { Seed } from "@/types/chunkify";

export const allSeeds = seeds as Seed[];

export function getSeed(idOrSlug: string) {
  return allSeeds.find((seed) => seed.slug === idOrSlug || seed.id === idOrSlug);
}

export function relatedSeeds(seed: Seed, limit = 3) {
  return allSeeds
    .filter((item) => item.id !== seed.id)
    .map((item) => ({
      seed: item,
      score:
        item.tags.filter((tag) => seed.tags.includes(tag)).length +
        item.biomes.filter((biome) => seed.biomes.includes(biome)).length +
        item.structures.filter((structure) => seed.structures.includes(structure)).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.seed);
}

export function browseSeeds(options: {
  query?: string;
  filters?: string[];
  sort?: string;
  limit?: number;
}) {
  const normalized = options.query?.trim().toLowerCase();
  const filters = options.filters ?? [];
  let result = allSeeds.filter((seed) => {
    const haystack = [
      seed.name,
      seed.seedNumber,
      seed.edition,
      seed.version,
      seed.description,
      ...seed.tags,
      ...seed.biomes,
      ...seed.structures
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = normalized ? haystack.includes(normalized) : true;
    const matchesFilters = filters.length
      ? filters.every((filter) => haystack.includes(filter.toLowerCase()))
      : true;
    return matchesQuery && matchesFilters;
  });

  result = result.sort((a, b) => {
    if (options.sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (options.sort === "rated") return b.rating - a.rating;
    return b.views + b.score * 100 - (a.views + a.score * 100);
  });

  return typeof options.limit === "number" ? result.slice(0, options.limit) : result;
}
