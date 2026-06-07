import { parseKeywords } from "@/lib/chunkify/keywordParser";
import { DeterministicSeedSearchEngine } from "@/lib/chunkify/searchEngine";
import type { Edition, SeedSearchCriteria, SeedSearchMatch } from "@/types/chunkify";

type StartMessage = {
  type: "START_SEARCH";
  payload: {
    phrase: string;
    edition: Edition;
    startSeed: number;
    endSeed: number;
    maxResults: number;
  };
};

type WorkerMessage = StartMessage | { type: "CANCEL_SEARCH" };

let cancelled = false;
const engine = new DeterministicSeedSearchEngine();

function post(type: string, payload?: unknown) {
  self.postMessage({ type, payload });
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type === "CANCEL_SEARCH") {
    cancelled = true;
    return;
  }

  if (event.data.type !== "START_SEARCH") return;

  cancelled = false;
  const started = Date.now();
  const criteria: SeedSearchCriteria = {
    ...event.data.payload,
    tags: parseKeywords(event.data.payload.phrase)
  };

  try {
    const total = Math.max(0, criteria.endSeed - criteria.startSeed + 1);
    const batchSize = 750;
    let checked = 0;
    const matches: SeedSearchMatch[] = [];

    for (let cursor = criteria.startSeed; cursor <= criteria.endSeed; cursor += batchSize) {
      if (cancelled) {
        post("COMPLETE", { cancelled: true, matches, checked, elapsedMs: Date.now() - started });
        return;
      }

      const batchCount = Math.min(batchSize, criteria.endSeed - cursor + 1);
      const batchMatches = engine.searchBatch(criteria, cursor, batchCount);

      for (const match of batchMatches) {
        if (matches.length >= criteria.maxResults) break;
        matches.push(match);
        post("MATCH_FOUND", match);
      }

      checked += batchCount;
      post("PROGRESS", {
        checked,
        total,
        matches: matches.length,
        elapsedMs: Date.now() - started
      });

      if (matches.length >= criteria.maxResults) break;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    post("COMPLETE", { cancelled: false, matches, checked, elapsedMs: Date.now() - started });
  } catch (error) {
    post("ERROR", error instanceof Error ? error.message : "Search failed");
  }
};

export {};
