import type { Metadata } from "next";
import { allSeeds } from "@/lib/chunkify/seeds";
import { MapView } from "@/components/chunkify/map-view";

export const metadata: Metadata = {
  title: "Map",
  description: "Explore Chunkify seed highlights on an interactive map."
};

export default function MapPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-8">
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Map</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">A fast visual map of seed highlights. Select a point, copy the seed, or open the full listing.</p>
      </div>
      <MapView seeds={allSeeds.slice(0, 42)} />
    </main>
  );
}
