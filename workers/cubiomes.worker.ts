import { aiSeedParser } from "@/lib/chunkify/aiSeedParser";
import { CubiomesWasmAdapter, createSeedSearchMatch } from "@/lib/chunkify/cubiomesSearch";
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
const cubiomes = new CubiomesWasmAdapter();

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
  const payload = event.data.payload;
  const total = Math.max(0, payload.endSeed - payload.startSeed + 1);
  const parsed = aiSeedParser.parse(payload.phrase, total);
  const criteria: SeedSearchCriteria = {
    ...payload,
    conditions: {
      biomes: parsed.biomes,
      structures: parsed.structures,
      requirements: parsed.requirements,
      terms: parsed.terms
    }
  };

  post("PARSED", { parsed, cubiomesReady: cubiomes.ready });

  try {
    if (!total) {
      post("COMPLETE", { cancelled: false, matches: [], checked: 0, elapsedMs: Date.now() - started });
      return;
    }

    const batchSize = parsed.workload === "small" ? 1000 : 600;
    let checked = 0;
    const matches: SeedSearchMatch[] = [];

    for (let cursor = criteria.startSeed; cursor <= criteria.endSeed; cursor += batchSize) {
      if (cancelled) {
        post("COMPLETE", { cancelled: true, matches, checked, elapsedMs: Date.now() - started });
        return;
      }

      const batchCount = Math.min(batchSize, criteria.endSeed - cursor + 1);
      const hits = cubiomes.searchBatch(criteria, cursor, batchCount);

      for (const hit of hits) {
        if (matches.length >= criteria.maxResults) break;
        const match = createSeedSearchMatch(hit, criteria, criteria.edition);
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

    matches.sort((a, b) => b.score - a.score);
    post("COMPLETE", { cancelled: false, matches, checked, elapsedMs: Date.now() - started });
  } catch (error) {
    post("ERROR", error instanceof Error ? error.message : "Search failed");
  }
};

export {};
