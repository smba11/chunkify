import { NextRequest, NextResponse } from "next/server";
import { searchSeeds } from "@/lib/chunkr/seeds";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const filters = request.nextUrl.searchParams.getAll("filter");
  return NextResponse.json({ data: searchSeeds(query, filters) });
}
