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
  conditions: SeedSearchConditions;
};

export type WorkloadSize = "small" | "medium" | "heavy" | "extreme";

export type SeedSearchConditions = {
  biomes: string[];
  structures: string[];
  requirements: string[];
  terms: string[];
};

export type AISeedParseResult = SeedSearchConditions & {
  confidence: number;
  summary: string;
  workload: WorkloadSize;
};

export type SeedSearchMatch = {
  seedNumber: string;
  name: string;
  score: number;
  edition: Edition;
  features: string[];
  conditions: SeedSearchConditions;
  description: string;
};
