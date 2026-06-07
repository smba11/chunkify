import { NextRequest, NextResponse } from "next/server";
import { browseSeeds } from "@/lib/chunkify/seeds";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const filters = request.nextUrl.searchParams.getAll("filter");
  return NextResponse.json({ data: browseSeeds({ query, filters }) });
}
