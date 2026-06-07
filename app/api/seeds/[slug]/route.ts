import { NextResponse } from "next/server";
import { getSeed } from "@/lib/chunkr/seeds";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seed = getSeed(slug);
  if (!seed) return NextResponse.json({ error: "Seed not found" }, { status: 404 });
  return NextResponse.json({ data: seed });
}
