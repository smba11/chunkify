import type { AISeedParseResult, SeedSearchConditions, WorkloadSize } from "@/types/chunkify";

type KeywordKind = keyof SeedSearchConditions;

type KeywordEntry = {
  label: string;
  value: string;
  kind: KeywordKind;
  aliases: string[];
};

export const seedKeywordLibrary: KeywordEntry[] = [
  { kind: "biomes", label: "plains", value: "plains", aliases: ["plain", "meadow", "flat land", "grassland"] },
  { kind: "biomes", label: "cherry grove", value: "cherry_grove", aliases: ["cherry", "pink trees", "sakura", "cherry biome"] },
  { kind: "biomes", label: "jungle", value: "jungle", aliases: ["bamboo", "tropical", "lush jungle"] },
  { kind: "biomes", label: "desert", value: "desert", aliases: ["sand", "sandy", "arid"] },
  { kind: "biomes", label: "badlands", value: "badlands", aliases: ["mesa", "terracotta", "red desert"] },
  { kind: "biomes", label: "snowy", value: "snowy", aliases: ["snow", "ice", "frozen", "winter"] },
  { kind: "biomes", label: "ocean", value: "ocean", aliases: ["sea", "ocean view", "coast", "coastal", "beach"] },
  { kind: "biomes", label: "mushroom island", value: "mushroom_island", aliases: ["mushroom", "mooshroom", "mushroom fields"] },
  { kind: "biomes", label: "swamp", value: "swamp", aliases: ["marsh", "wetland"] },
  { kind: "biomes", label: "mangrove", value: "mangrove", aliases: ["mangrove swamp", "mud swamp"] },
  { kind: "biomes", label: "taiga", value: "taiga", aliases: ["spruce", "pine forest", "snowy taiga"] },
  { kind: "biomes", label: "mountains", value: "mountains", aliases: ["mountain", "mount", "peaks", "cliffs", "ridge", "snowy mountains"] },
  { kind: "structures", label: "village", value: "village", aliases: ["villages", "town", "settlement", "blacksmith"] },
  { kind: "structures", label: "mansion", value: "mansion", aliases: ["woodland mansion", "dark forest mansion", "manor"] },
  { kind: "structures", label: "stronghold", value: "stronghold", aliases: ["end portal", "portal room", "speedrun stronghold"] },
  { kind: "structures", label: "ancient city", value: "ancient_city", aliases: ["warden city", "deep dark city", "deep dark"] },
  { kind: "structures", label: "monument", value: "monument", aliases: ["ocean monument", "guardian temple", "sea temple"] },
  { kind: "structures", label: "ruined portal", value: "ruined_portal", aliases: ["portal", "nether portal", "broken portal"] },
  { kind: "structures", label: "trial chamber", value: "trial_chamber", aliases: ["trial", "trial chambers", "vault"] },
  { kind: "structures", label: "mineshaft", value: "mineshaft", aliases: ["mine shaft", "abandoned mine", "cave mine"] },
  { kind: "structures", label: "witch hut", value: "witch_hut", aliases: ["swamp hut", "witch farm"] },
  { kind: "requirements", label: "near spawn", value: "near_spawn", aliases: ["at spawn", "close to spawn", "next to spawn", "nearby spawn", "spawn"] },
  { kind: "requirements", label: "far from spawn", value: "far_from_spawn", aliases: ["far away", "remote", "distant"] },
  { kind: "requirements", label: "multiple villages", value: "multiple_villages", aliases: ["many villages", "two villages", "three villages", "several villages"] },
  { kind: "requirements", label: "survival friendly", value: "survival_friendly", aliases: ["survival", "starter", "easy survival", "good start"] },
  { kind: "requirements", label: "hardcore", value: "hardcore", aliases: ["hard mode", "challenge", "dangerous"] },
  { kind: "requirements", label: "speedrun", value: "speedrun", aliases: ["fast end", "quick stronghold", "fast portal"] },
  { kind: "requirements", label: "island spawn", value: "island_spawn", aliases: ["island", "spawn island", "island start"] },
  { kind: "requirements", label: "rare biome", value: "rare_biome", aliases: ["rare", "unusual", "special biome"] }
];

const suggestionSeeds = [
  "mountains",
  "mountain village",
  "mountain mansion",
  "mountain survival",
  "cherry grove village near spawn",
  "mansion on an island with an ocean view",
  "ancient city under snowy mountains",
  "stronghold close to spawn with multiple villages nearby",
  "mushroom island survival",
  "trial chamber near spawn"
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function addUnique(target: string[], value: string) {
  if (!target.includes(value)) target.push(value);
}

export class AISeedParser {
  parse(input: string, searchSize = 100000): AISeedParseResult {
    const normalized = normalize(input);
    const conditions: SeedSearchConditions = { biomes: [], structures: [], requirements: [], terms: [] };

    for (const entry of seedKeywordLibrary) {
      const phrases = [entry.label, entry.value.replaceAll("_", " "), ...entry.aliases].map(normalize);
      if (phrases.some((phrase) => phrase && normalized.includes(phrase))) {
        addUnique(conditions[entry.kind], entry.value);
      }
    }

    normalized.split(" ").filter((term) => term.length > 2).forEach((term) => addUnique(conditions.terms, term));

    if (conditions.biomes.includes("ocean") && normalized.includes("island")) addUnique(conditions.requirements, "island_spawn");
    if (conditions.structures.includes("village") && normalized.includes("multiple")) addUnique(conditions.requirements, "multiple_villages");
    if (normalized.includes("near") && normalized.includes("spawn")) addUnique(conditions.requirements, "near_spawn");

    const recognized = conditions.biomes.length + conditions.structures.length + conditions.requirements.length;
    const confidence = Math.min(1, recognized / 4 + Math.min(conditions.terms.length, 8) / 24);

    return {
      ...conditions,
      confidence,
      workload: estimateWorkload(searchSize, conditions),
      summary: summarizeConditions(conditions)
    };
  }

  suggestions(input: string) {
    const normalized = normalize(input);
    if (!normalized) return suggestionSeeds.slice(0, 4);
    const direct = suggestionSeeds.filter((item) => normalize(item).includes(normalized));
    const library = seedKeywordLibrary
      .flatMap((entry) => [entry.label, ...entry.aliases.slice(0, 2)])
      .filter((item) => normalize(item).startsWith(normalized));
    return Array.from(new Set([...direct, ...library])).slice(0, 4);
  }
}

export function estimateWorkload(size: number, conditions: SeedSearchConditions): WorkloadSize {
  const complexity = conditions.biomes.length * 1.3 + conditions.structures.length * 1.8 + conditions.requirements.length;
  const weighted = size * Math.max(1, complexity);
  if (weighted <= 100000) return "small";
  if (weighted <= 1000000) return "medium";
  if (weighted <= 5000000) return "heavy";
  return "extreme";
}

function summarizeConditions(conditions: SeedSearchConditions) {
  const parts = [
    ...conditions.biomes.map((item) => item.replaceAll("_", " ")),
    ...conditions.structures.map((item) => item.replaceAll("_", " ")),
    ...conditions.requirements.map((item) => item.replaceAll("_", " "))
  ];
  return parts.length ? parts.join(" + ") : "broad world search";
}

export const aiSeedParser = new AISeedParser();
