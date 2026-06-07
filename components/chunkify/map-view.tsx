"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CopySeedButton } from "@/components/chunkify/copy-seed-button";
import type { Seed } from "@/types/chunkify";

function normalize(value: number, min: number, max: number) {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 100;
}

export function MapView({ seeds }: { seeds: Seed[] }) {
  const [activeId, setActiveId] = useState(seeds[0]?.id);
  const activeSeed = seeds.find((seed) => seed.id === activeId) ?? seeds[0];
  const bounds = useMemo(() => {
    const lats = seeds.map((seed) => seed.mapPosition.lat);
    const lngs = seeds.map((seed) => seed.mapPosition.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    };
  }, [seeds]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/35">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.18),transparent_0.45rem),radial-gradient(circle_at_60%_45%,rgba(255,255,255,0.12),transparent_0.35rem),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.06)_68%,transparent)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />
        {seeds.map((seed) => {
          const left = normalize(seed.mapPosition.lng, bounds.minLng, bounds.maxLng);
          const top = 100 - normalize(seed.mapPosition.lat, bounds.minLat, bounds.maxLat);
          const active = seed.id === activeSeed.id;
          return (
            <button
              key={seed.id}
              type="button"
              onClick={() => setActiveId(seed.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-white"
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-label={`Open ${seed.name}`}
            >
              <span className={`block rounded-full bg-white shadow-[0_0_0_7px_rgba(255,255,255,0.14),0_18px_42px_rgba(0,0,0,0.45)] transition ${active ? "h-5 w-5" : "h-3.5 w-3.5 opacity-80"}`} />
            </button>
          );
        })}
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-white/55">Interactive seed map</p>
            <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-white">Explore highlight clusters without waiting on map tiles.</h2>
          </div>
          <p className="hidden rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-white/70 backdrop-blur-xl sm:block">{seeds.length} seeds</p>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-2xl backdrop-blur-2xl">
        <p className="text-sm text-zinc-500">Selected seed</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{activeSeed.name}</h2>
        <p className="mt-2 text-sm text-zinc-400">#{activeSeed.seedNumber}</p>
        <p className="mt-5 text-sm leading-6 text-zinc-300">{activeSeed.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {activeSeed.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.08] px-3 py-1 text-xs text-white/75">{tag}</span>
          ))}
        </div>
        <div className="mt-6 grid gap-3">
          <CopySeedButton seedNumber={activeSeed.seedNumber} />
          <Link href={`/seed/${activeSeed.slug}`} className="rounded-full bg-white px-4 py-3 text-center text-sm font-medium text-black transition hover:bg-white/90">
            Open seed
          </Link>
        </div>
      </aside>
    </div>
  );
}
