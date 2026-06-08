import type { Metadata } from "next";
import { CubiomesResultsClient } from "@/components/chunkify/cubiomes-results-client";

export const metadata: Metadata = {
  title: "Seeds",
  description: "Browse Minecraft world seeds on Chunkify."
};

type Props = {
  searchParams: Promise<{ q?: string; filter?: string | string[] }>;
};

export default async function SeedsPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeFilters = Array.isArray(params.filter) ? params.filter : params.filter ? [params.filter] : [];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <CubiomesResultsClient initialQuery={params.q ?? ""} initialFilters={activeFilters} />
    </main>
  );
}
