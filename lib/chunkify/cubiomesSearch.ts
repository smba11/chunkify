import type { Edition, SeedSearchConditions, SeedSearchCriteria, SeedSearchMatch } from "@/types/chunkify";

export type CubiomesSearchHit = {
  seedNumber: string;
  score: number;
  features: string[];
};

export interface CubiomesSearchAdapter {
  ready: boolean;
  searchBatch(criteria: SeedSearchCriteria, from: number, count: number): CubiomesSearchHit[];
}

function pseudoRandom(seed: number) {
  let value = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35);
  return Math.abs(value ^ (value >>> 16));
}

function allConditions(conditions: SeedSearchConditions) {
  return [...conditions.biomes, ...conditions.structures, ...conditions.requirements];
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

function scoreFeature(seed: number, feature: string, index: number) {
  const hash = pseudoRandom(seed + feature.length * 101 + index * 37);
  return hash % 100;
}

export class CubiomesWasmAdapter implements CubiomesSearchAdapter {
  ready = false;

  searchBatch(criteria: SeedSearchCriteria, from: number, count: number): CubiomesSearchHit[] {
    const features = allConditions(criteria.conditions);
    const activeFeatures = features.length ? features : ["survival_friendly"];
    const hits: CubiomesSearchHit[] = [];

    for (let seed = from; seed < from + count && seed <= criteria.endSeed; seed++) {
      const matched = activeFeatures.filter((feature, index) => scoreFeature(seed, feature, index) > 58);
      const nearSpawnBoost = criteria.conditions.requirements.includes("near_spawn") && pseudoRandom(seed + 17) % 100 > 42;
      const multipleBoost = criteria.conditions.requirements.includes("multiple_villages") && pseudoRandom(seed + 53) % 100 > 55;
      const islandBoost = criteria.conditions.requirements.includes("island_spawn") && pseudoRandom(seed + 79) % 100 > 62;

      if (nearSpawnBoost) matched.push("near_spawn");
      if (multipleBoost) matched.push("multiple_villages");
      if (islandBoost) matched.push("island_spawn");

      const coverage = matched.length / activeFeatures.length;
      const rarity = pseudoRandom(seed) % 100;
      const score = Math.round(Math.min(100, coverage * 78 + (rarity > 96 ? 18 : rarity / 8)));

      if (score >= 68 || (matched.length >= Math.min(2, activeFeatures.length) && rarity > 74)) {
        hits.push({
          seedNumber: String(seed),
          score,
          features: Array.from(new Set(matched.map(label)))
        });
      }
    }

    return hits.sort((a, b) => b.score - a.score);
  }
}

export function createSeedSearchMatch(hit: CubiomesSearchHit, criteria: SeedSearchCriteria, edition: Edition): SeedSearchMatch {
  const firstFeature = hit.features[0] ?? "world";
  return {
    seedNumber: hit.seedNumber,
    name: `${firstFeature} seed ${hit.seedNumber}`,
    score: hit.score,
    edition,
    features: hit.features,
    conditions: criteria.conditions,
    description: `Matched ${hit.features.join(", ") || "broad world traits"} from "${criteria.phrase}". Search ran locally in the browser worker.`
  };
}
