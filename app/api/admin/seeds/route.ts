import { NextResponse } from "next/server";
import { allSeeds } from "@/lib/chunkify/seeds";

export function GET() {
  return NextResponse.json({ data: allSeeds });
}
