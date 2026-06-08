"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { aiSeedParser } from "@/lib/chunkify/aiSeedParser";
import type { AISeedParseResult, Edition, SeedSearchMatch } from "@/types/chunkify";

type Progress = {
  checked: number;
  total: number;
  matches: number;
  elapsedMs: number;
};

const filterOptions = [
  "Java",
  "Bedrock",
  "Village",
  "Mansion",
  "Stronghold",
  "Ancient City",
  "Trial Chamber",
  "Ruined Portal",
  "Plains",
  "Cherry Grove",
  "Jungle",
  "Desert",
  "Snow",
  "Ocean"
];

function phraseFromState(query: string, filters: string[]) {
  return [query, ...filters.filter((item) => item !== "Java" && item !== "Bedrock")].filter(Boolean).join(" ") || "village near spawn";
}

export function CubiomesResultsClient({
  initialQuery,
  initialFilters
}: {
  initialQuery: string;
  initialFilters: string[];
}) {
  const workerRef = useRef<Worker | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [edition, setEdition] = useState<Edition>(initialFilters.includes("Bedrock") ? "Bedrock" : "Java");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SeedSearchMatch[]>([]);
  const [progress, setProgress] = useState<Progress>({ checked: 0, total: 0, matches: 0, elapsedMs: 0 });
  const [parsed, setParsed] = useState<AISeedParseResult>(() => aiSeedParser.parse(phraseFromState(initialQuery, initialFilters), 50000));
  const phrase = useMemo(() => phraseFromState(query, filters), [query, filters]);

  useEffect(() => () => workerRef.current?.terminate(), []);

  useEffect(() => {
    setParsed(aiSeedParser.parse(phrase, 50000));
  }, [phrase]);

  function startSearch() {
    workerRef.current?.terminate();
    const worker = new Worker(new URL("../../workers/cubiomes.worker.ts", import.meta.url));
    workerRef.current = worker;
    setRunning(true);
    setResults([]);
    setProgress({ checked: 0, total: 0, matches: 0, elapsedMs: 0 });

    worker.onmessage = (event: MessageEvent<{ type: string; payload: unknown }>) => {
      if (event.data.type === "PARSED") setParsed((event.data.payload as { parsed: AISeedParseResult }).parsed);
      if (event.data.type === "PROGRESS") setProgress(event.data.payload as Progress);
      if (event.data.type === "MATCH_FOUND") setResults((items) => [...items, event.data.payload as SeedSearchMatch].slice(0, 24));
      if (event.data.type === "COMPLETE" || event.data.type === "ERROR") setRunning(false);
    };

    worker.postMessage({
      type: "START_SEARCH",
      payload: {
        phrase,
        edition,
        startSeed: 1,
        endSeed: 50000,
        maxResults: 24
      }
    });
  }

  useEffect(() => {
    startSearch();
    // Run once for the initial URL state. Manual search handles later edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleFilter(filter: string) {
    if (filter === "Java" || filter === "Bedrock") {
      setEdition(filter);
      setFilters((items) => [filter, ...items.filter((item) => item !== "Java" && item !== "Bedrock")]);
      return;
    }
    setFilters((items) => (items.includes(filter) ? items.filter((item) => item !== filter) : [...items, filter]));
  }

  const percent = progress.total ? Math.round((progress.checked / progress.total) * 100) : 0;

  return (
    <section>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Browse</h1>
          <p className="mt-3 text-zinc-400">Local Cubiomes-ready search results. No static filler listings.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            startSearch();
          }}
          className="glass-search flex w-full max-w-xl items-center gap-3 px-5 py-3"
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search village, island, cherry grove..."
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
          <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black">{running ? "Searching" : "Search"}</button>
        </form>
      </div>

      <div className="mb-8 space-y-4">
        <div className="scroll-rail -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          {filterOptions.map((filter) => {
            const active = filter === edition || filters.includes(filter);
            return (
              <button
                key={filter}
                type="button"
                onClick={() => toggleFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  active ? "bg-white text-black" : "bg-white/[0.08] text-zinc-300 hover:bg-white/15 hover:text-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">Parsed: <span className="text-white">{parsed.summary}</span></p>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs uppercase tracking-wide text-zinc-300">{parsed.workload}</span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-3 text-xs text-zinc-500">{progress.checked.toLocaleString()} seeds checked · {results.length} matches · {(progress.elapsedMs / 1000).toFixed(1)}s</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((result) => (
          <article key={result.seedNumber} className="rounded-[1.65rem] border border-white/10 bg-black/35 p-5 shadow-[0_22px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500">{result.edition}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Seed #{result.seedNumber}</h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">{result.score}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {result.features.slice(0, 5).map((feature) => (
                <span key={feature} className="rounded-full bg-white/[0.08] px-2.5 py-1 text-xs text-zinc-300">{feature}</span>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => navigator.clipboard.writeText(result.seedNumber)} className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black">Copy</button>
              <a href={`/seed/${result.seedNumber}`} className="rounded-full border border-white/10 px-4 py-2 text-xs text-white">Open</a>
            </div>
          </article>
        ))}
      </div>
      {!results.length ? (
        <div className="glass grid min-h-80 place-items-center rounded-[2rem] text-center">
          <div>
            <p className="text-xl font-medium text-white">{running ? "Scanning seeds..." : "No matches yet"}</p>
            <p className="mt-2 text-sm text-zinc-400">Adjust the prompt or filters, then search again.</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
