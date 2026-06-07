import type { SeedSearchCriteria, SeedSearchMatch } from "@/types/chunkify";

export type SearchProgress = {
  checked: number;
  total: number;
  matches: number;
  elapsedMs: number;
};

export interface SeedSearchEngine {
  searchBatch(criteria: SeedSearchCriteria, from: number, count: number): SeedSearchMatch[];
}

function pseudoRandom(seed: number) {
  let value = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35);
  return Math.abs(value ^ (value >>> 16));
}

export class DeterministicSeedSearchEngine implements SeedSearchEngine {
  searchBatch(criteria: SeedSearchCriteria, from: number, count: number) {
    const matches: SeedSearchMatch[] = [];
    const tags = criteria.tags.length ? criteria.tags : ["village"];

    for (let seed = from; seed < from + count && seed <= criteria.endSeed; seed++) {
      const random = pseudoRandom(seed);
      const score = tags.reduce((total, tag, index) => {
        const hash = pseudoRandom(seed + tag.length * 97 + index * 31);
        return total + (hash % 100 < 23 ? 24 : hash % 17);
      }, 35);

      if (score > 68 || random % 997 === 0) {
        matches.push({
          seedNumber: String(seed),
          name: `${tags[0].replaceAll("_", " ")} seed ${seed}`,
          score: Math.min(100, score),
          edition: criteria.edition,
          tags,
          description: `Generated local match for ${criteria.phrase || tags.join(", ")}. Cubiomes WASM can replace this deterministic engine later.`
        });
      }
    }

    return matches;
  }
}
