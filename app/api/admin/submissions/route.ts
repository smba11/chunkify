import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { seedListings } from "@/lib/chunkify/mock-data";

export async function GET() {
  const user = await getCurrentUser();
  if (!user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({
    data: seedListings.filter((seed) => seed.status === "pending"),
    meta: {
      authorization: "Replace mock admin check with public.users.role = 'admin' after Supabase is connected."
    }
  });
}
