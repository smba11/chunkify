"use client";

import dynamic from "next/dynamic";
import type { Seed } from "@/types/chunkify";

const MapView = dynamic(() => import("@/components/chunkify/map-view").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="glass grid h-[70vh] min-h-[520px] place-items-center rounded-[2rem] text-zinc-400">
      Loading map...
    </div>
  )
});

export function MapShell({ seeds }: { seeds: Seed[] }) {
  return <MapView seeds={seeds} />;
}
