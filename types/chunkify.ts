export type Edition = "Java" | "Bedrock";

export type SeedCoordinate = {
  label: string;
  type: string;
  x: number;
  y: number;
  z: number;
};

export type Seed = {
  id: string;
  slug: string;
  name: string;
  seedNumber: string;
  edition: Edition;
  version: string;
  description: string;
  image: string;
  tags: string[];
  biomes: string[];
  structures: string[];
  spawnCoordinates: { x: number; y: number; z: number };
  highlightCoordinates: SeedCoordinate[];
  mapPosition: { lat: number; lng: number };
  rating: number;
  score: number;
  views: number;
  createdAt: string;
};

export type SeedSearchCriteria = {
  phrase: string;
  edition: Edition;
  startSeed: number;
  endSeed: number;
  maxResults: number;
  tags: string[];
};

export type SeedSearchMatch = {
  seedNumber: string;
  name: string;
  score: number;
  edition: Edition;
  tags: string[];
  description: string;
};
