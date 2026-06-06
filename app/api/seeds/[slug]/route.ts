import { NextResponse } from "next/server";
import { getSeedBySlug } from "@/lib/chunkify/mock-data";

export const revalidate = 60;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seed = getSeedBySlug(slug);
  if (!seed) {
    return NextResponse.json({ error: "Seed not found." }, { status: 404 });
  }
  return NextResponse.json({ data: seed });
}
