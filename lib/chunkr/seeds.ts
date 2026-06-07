import seeds from "@/data/seeds.json";
import type { Seed } from "@/types/chunkr";

export const allSeeds = seeds as Seed[];

export function getSeed(slug: string) {
  return allSeeds.find((seed) => seed.slug === slug);
}

export function searchSeeds(query?: string, filters: string[] = []) {
  const normalized = query?.trim().toLowerCase();
  return allSeeds.filter((seed) => {
    const haystack = [seed.name, seed.seedNumber, seed.edition, seed.version, ...seed.tags, ...seed.structures]
      .join(" ")
      .toLowerCase();
    const matchesQuery = normalized ? haystack.includes(normalized) : true;
    const matchesFilters = filters.length
      ? filters.every((filter) => haystack.includes(filter.toLowerCase()))
      : true;
    return matchesQuery && matchesFilters;
  });
}
