export type Edition = "Java" | "Bedrock";

export type SeedCoordinate = {
  label: string;
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
  image: string;
  tags: string[];
  structures: string[];
  coordinates: SeedCoordinate[];
  description: string;
};
