import { NextResponse } from "next/server";
import { allSeeds } from "@/lib/chunkr/seeds";

export function GET() {
  return NextResponse.json({ data: allSeeds });
}
