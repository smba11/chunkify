import type { Coordinate, Edition, PublicProfile, SeedFilters, SeedListing } from "@/types/chunkify";
import { biomeFilters, popularCategories, structureFilters, versions } from "./constants";

const imagePool = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
];

const names = [
  "Cherry Ridge Estate",
  "Obsidian Coast Preserve",
  "Golden Mesa Village",
  "Frostline Manor Grounds",
  "Emerald Peninsula",
  "Cedar Spawn Reserve",
  "Ancient Hollow Acreage",
  "Sapphire Riverhold",
  "Mushroom Isle Retreat",
  "Trialstone Valley"
];

const authors = [
  ["Avery Stone", "avery"],
  ["Mina Vale", "minavale"],
  ["Rowan Forge", "rowan"],
  ["Kai North", "kainorth"],
  ["Selene Oak", "seleneo"]
] as const;

function seededNumber(index: number) {
  const left = String(982451653 + index * 7919);
  const right = String(961748927 + index * 1543);
  return `${index % 3 === 0 ? "-" : ""}${left}${right}`;
}

function pick<T>(items: readonly T[], index: number, offset = 0): T {
  return items[(index + offset) % items.length];
}

function pickMany<T>(items: readonly T[], index: number, count: number): T[] {
  return Array.from({ length: count }, (_, offset) => pick(items, index * 3, offset)).filter(
    (value, itemIndex, array) => array.indexOf(value) === itemIndex
  );
}

function coordinate(index: number, type: Coordinate["type"], label: string, offset: number): Coordinate {
  return {
    label,
    type,
    x: (index * 173 + offset * 97) % 5000 - 2500,
    y: type === "Ancient City" || type === "Stronghold" ? -36 : 72 + ((index + offset) % 34),
    z: (index * -211 + offset * 131) % 5000,
    note: `${label} is within a ${220 + index * 13 + offset * 17} block route from spawn.`
  };
}

export const profiles: PublicProfile[] = authors.map(([displayName, username], index) => ({
  id: `profile-${index + 1}`,
  username,
  displayName,
  avatarUrl: `https://images.unsplash.com/photo-${[
    "1500648767791-00dcc994a43e",
    "1494790108377-be9c29b29330",
    "1535713875002-d1d0cf377fde",
    "1527980965255-d3b416303d12",
    "1544723795-3fb6469f5b39"
  ][index]}?auto=format&fit=crop&w=256&q=80`,
  bio: "Curates rare Minecraft starts with clean spawn logic, scenic build sites, and practical survival routes.",
  followers: 1200 + index * 487,
  following: 80 + index * 23
}));

export const seedListings: SeedListing[] = Array.from({ length: 100 }, (_, index) => {
  const author = profiles[index % profiles.length];
  const biomes = pickMany(biomeFilters, index, 2 + (index % 3));
  const structures = pickMany(structureFilters, index + 1, 2 + (index % 4));
  const categories = pickMany(popularCategories, index + 2, 2 + (index % 3));
  const scoreBase = 62 + ((index * 11) % 33);
  const slug = `${names[index % names.length].toLowerCase().replaceAll(" ", "-")}-${index + 1}`;
  const coords = [
    coordinate(index, "Spawn", "Protected spawn terrace", 1),
    coordinate(index, "Village", "Primary village district", 2),
    coordinate(index, "Stronghold", "Stronghold access stair", 3),
    coordinate(index, "Ancient City", "Deep dark landmark", 4),
    coordinate(index, "Mansion", "Woodland mansion approach", 5)
  ];

  return {
    id: `seed-${index + 1}`,
    slug,
    name: `${names[index % names.length]} ${index % 2 === 0 ? "No." : "Parcel"} ${index + 1}`,
    seedNumber: seededNumber(index),
    version: pick(versions, index),
    edition: (index % 4 === 0 ? "Bedrock" : "Java") as Edition,
    author: author.displayName,
    authorUsername: author.username,
    authorAvatar: author.avatarUrl,
    uploadDate: new Date(Date.UTC(2026, 0, 1 + (index % 150))).toISOString(),
    description:
      "A high-value world seed with an elegant spawn approach, strong early resources, photogenic terrain, and multiple discovery anchors for long-term survival or prestige builds.",
    images: [0, 1, 2].map((offset) => imagePool[(index + offset) % imagePool.length]),
    thumbnail: imagePool[index % imagePool.length],
    biomes,
    structures,
    categories,
    tags: ["luxury-spawn", "rare-layout", "builder-friendly", `score-${scoreBase}`],
    spawn: { x: coords[0].x, y: coords[0].y, z: coords[0].z },
    coordinates: coords,
    views: 9400 + index * 731,
    downloads: 800 + index * 83,
    rating: Number((4.1 + ((index * 7) % 9) / 10).toFixed(1)),
    ratingsCount: 24 + index * 6,
    favorites: 180 + index * 19,
    scores: {
      seed: Math.min(100, scoreBase + (index % 7)),
      rarity: Math.min(100, 58 + ((index * 13) % 41)),
      builder: Math.min(100, 60 + ((index * 17) % 38)),
      survival: Math.min(100, 64 + ((index * 19) % 34)),
      explorer: Math.min(100, 66 + ((index * 23) % 31))
    },
    status: index < 92 ? "approved" : "pending",
    featured: index % 11 === 0,
    trendingRank: index < 12 ? index + 1 : undefined
  };
});

export function getApprovedSeeds() {
  return seedListings.filter((seed) => seed.status === "approved");
}

export function getSeedBySlug(slug: string) {
  return seedListings.find((seed) => seed.slug === slug);
}

export function getSeedsByProfile(username: string) {
  return getApprovedSeeds().filter((seed) => seed.authorUsername === username);
}

export function filterSeeds(filters: SeedFilters) {
  let result = getApprovedSeeds();
  const query = filters.q?.toLowerCase().trim();

  if (query) {
    result = result.filter((seed) =>
      [seed.name, seed.seedNumber, seed.description, ...seed.biomes, ...seed.structures, ...seed.tags]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }
  if (filters.edition) result = result.filter((seed) => seed.edition === filters.edition);
  if (filters.version) result = result.filter((seed) => seed.version === filters.version);
  if (filters.biome) result = result.filter((seed) => seed.biomes.includes(filters.biome!));
  if (filters.structure) result = result.filter((seed) => seed.structures.includes(filters.structure!));
  if (filters.category) result = result.filter((seed) => seed.categories.includes(filters.category!));

  return result.sort((a, b) => {
    switch (filters.sort) {
      case "highest-rated":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case "most-downloaded":
        return b.downloads - a.downloads;
      default:
        return b.views + b.favorites * 8 - (a.views + a.favorites * 8);
    }
  });
}
