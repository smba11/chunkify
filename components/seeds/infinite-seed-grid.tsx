"use client";

import { useEffect, useRef, useState } from "react";
import { SeedCard } from "@/components/seeds/seed-card";
import { Button } from "@/components/ui/button";
import type { SeedListing } from "@/types/chunkify";

const PAGE_SIZE = 18;

export function InfiniteSeedGrid({ seeds }: { seeds: SeedListing[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const visibleSeeds = seeds.slice(0, visibleCount);
  const hasMore = visibleCount < seeds.length;

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, seeds.length));
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, seeds.length]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visibleSeeds.map((seed, index) => <SeedCard key={seed.id} seed={seed} priority={index < 3} />)}
      </div>
      {hasMore ? (
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, seeds.length))}>
            Load more estates
          </Button>
        </div>
      ) : null}
    </>
  );
}
