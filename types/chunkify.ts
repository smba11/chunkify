export type Edition = "Java" | "Bedrock";

export type Coordinate = {
  label: string;
  type: "Spawn" | "Village" | "Stronghold" | "Ancient City" | "Mansion" | "Biome" | "Portal" | "Monument" | "Trial Chamber";
  x: number;
  y: number;
  z: number;
  note: string;
};

export type SeedScores = {
  seed: number;
  rarity: number;
  builder: number;
  survival: number;
  explorer: number;
};

export type SeedListing = {
  id: string;
  slug: string;
  name: string;
  seedNumber: string;
  version: string;
  edition: Edition;
  author: string;
  authorUsername: string;
  authorAvatar: string;
  uploadDate: string;
  description: string;
  images: string[];
  thumbnail: string;
  biomes: string[];
  structures: string[];
  categories: string[];
  tags: string[];
  spawn: { x: number; y: number; z: number };
  coordinates: Coordinate[];
  views: number;
  downloads: number;
  rating: number;
  ratingsCount: number;
  favorites: number;
  scores: SeedScores;
  status: "approved" | "pending" | "rejected";
  featured: boolean;
  trendingRank?: number;
};

export type SeedFilters = {
  q?: string;
  edition?: string;
  version?: string;
  biome?: string;
  structure?: string;
  sort?: string;
  category?: string;
};

export type PublicProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
};
