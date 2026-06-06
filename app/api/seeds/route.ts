import { NextRequest, NextResponse } from "next/server";
import { filterSeeds } from "@/lib/chunkify/mock-data";
import type { SeedFilters } from "@/types/chunkify";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const filters: SeedFilters = {
    q: params.get("q") ?? undefined,
    edition: params.get("edition") ?? undefined,
    version: params.get("version") ?? undefined,
    biome: params.get("biome") ?? undefined,
    structure: params.get("structure") ?? undefined,
    category: params.get("category") ?? undefined,
    sort: params.get("sort") ?? undefined
  };

  return NextResponse.json({
    data: filterSeeds(filters),
    meta: {
      source: "mock-chunkify-catalog",
      cachedForSeconds: 60
    }
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.seedNumber) {
    return NextResponse.json({ error: "Seed name and seed number are required." }, { status: 400 });
  }

  return NextResponse.json(
    {
      data: {
        ...body,
        status: "pending"
      },
      message: "Submission accepted for admin approval."
    },
    { status: 202 }
  );
}
