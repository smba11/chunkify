import type { Metadata } from "next";
import { allSeeds } from "@/lib/chunkify/seeds";
import { MapShell } from "@/components/chunkify/map-shell";

export const metadata: Metadata = {
  title: "Map",
  description: "Explore Chunkify seed highlights on an interactive map."
};

export default function MapPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Seed map</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">A lightweight map of world highlights. Open a marker, copy a seed, or jump to the seed page.</p>
      </div>
      <div className="glass rounded-[2.25rem] p-3">
        <MapShell seeds={allSeeds.slice(0, 42)} />
      </div>
    </main>
  );
}
