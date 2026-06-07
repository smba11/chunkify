const keywordMap: Record<string, string> = {
  "woodland mansion": "woodland_mansion",
  mansion: "woodland_mansion",
  village: "village",
  "ancient city": "ancient_city",
  ancient: "ancient_city",
  cherry: "cherry_grove",
  "cherry grove": "cherry_grove",
  jungle: "jungle",
  island: "island",
  survival: "survival",
  mountain: "mountain",
  mountains: "mountain",
  spawn: "near_spawn",
  "near spawn": "near_spawn",
  stronghold: "stronghold",
  desert: "desert",
  snow: "snowy",
  ocean: "ocean",
  plains: "plains",
  cave: "cave",
  "trial chamber": "trial_chamber",
  "ruined portal": "ruined_portal"
};

export function parseKeywords(phrase: string) {
  const normalized = phrase.toLowerCase();
  const tags = new Set<string>();

  for (const [keyword, tag] of Object.entries(keywordMap)) {
    if (normalized.includes(keyword)) tags.add(tag);
  }

  normalized
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .forEach((part) => {
      for (const [keyword, tag] of Object.entries(keywordMap)) {
        if (keyword.includes(part) || part.includes(keyword)) tags.add(tag);
      }
    });

  return Array.from(tags);
}
