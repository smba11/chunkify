"use client";

import { useEffect, useRef, useState } from "react";
import { aiSeedParser } from "@/lib/chunkify/aiSeedParser";
import type { AISeedParseResult, Edition, SeedSearchMatch, WorkloadSize } from "@/types/chunkify";

type Progress = {
  checked: number;
  total: number;
  matches: number;
  elapsedMs: number;
};

export function FinderClient() {
  const workerRef = useRef<Worker | null>(null);
  const [phrase, setPhrase] = useState("cherry grove village near spawn");
  const [range, setRange] = useState({ startSeed: 1, endSeed: 100000, maxResults: 20 });
  const [parseResult, setParseResult] = useState<AISeedParseResult>(() => aiSeedParser.parse("cherry grove village near spawn", 100000));
  const [suggestions, setSuggestions] = useState(() => aiSeedParser.suggestions("cherry grove village near spawn"));
  const [cubiomesReady, setCubiomesReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "complete" | "cancelled" | "error">("idle");
  const [progress, setProgress] = useState<Progress>({ checked: 0, total: 0, matches: 0, elapsedMs: 0 });
  const [results, setResults] = useState<SeedSearchMatch[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    const total = Math.abs(range.endSeed - range.startSeed) + 1;
    setParseResult(aiSeedParser.parse(phrase, total));
    setSuggestions(aiSeedParser.suggestions(phrase));
  }, [phrase, range]);

  function start(formData: FormData) {
    workerRef.current?.terminate();
    const worker = new Worker(new URL("../../workers/cubiomes.worker.ts", import.meta.url));
    workerRef.current = worker;
    setRunning(true);
    setStatus("running");
    setResults([]);
    setError(null);
    setProgress({ checked: 0, total: 0, matches: 0, elapsedMs: 0 });
    const startSeed = Number(formData.get("startSeed") || 1);
    const endSeed = Number(formData.get("endSeed") || 100000);
    const maxResults = Number(formData.get("maxResults") || 20);
    const cappedMaxResults = Math.max(1, Math.min(100, maxResults));

    worker.onmessage = (event: MessageEvent<{ type: string; payload: unknown }>) => {
      if (event.data.type === "PARSED") {
        const payload = event.data.payload as { parsed: AISeedParseResult; cubiomesReady: boolean };
        setParseResult(payload.parsed);
        setCubiomesReady(payload.cubiomesReady);
      }
      if (event.data.type === "PROGRESS") setProgress(event.data.payload as Progress);
      if (event.data.type === "MATCH_FOUND") {
        setResults((items) => [...items, event.data.payload as SeedSearchMatch].slice(0, cappedMaxResults));
      }
      if (event.data.type === "ERROR") {
        setError(String(event.data.payload));
        setRunning(false);
        setStatus("error");
      }
      if (event.data.type === "COMPLETE") {
        const payload = event.data.payload as { cancelled?: boolean } | undefined;
        setRunning(false);
        setStatus(payload?.cancelled ? "cancelled" : "complete");
      }
    };

    worker.postMessage({
      type: "START_SEARCH",
      payload: {
        phrase: String(formData.get("phrase") || ""),
        edition: String(formData.get("edition") || "Java") as Edition,
        startSeed: Math.min(startSeed, endSeed),
        endSeed: Math.max(startSeed, endSeed),
        maxResults: cappedMaxResults
      }
    });
  }

  function cancel() {
    workerRef.current?.postMessage({ type: "CANCEL_SEARCH" });
    setRunning(false);
    setStatus("cancelled");
  }

  const percent = progress.total ? Math.min(100, Math.round((progress.checked / progress.total) * 100)) : 0;
  const workloadTone: Record<WorkloadSize, string> = {
    small: "bg-emerald-400/10 text-emerald-100 border-emerald-300/15",
    medium: "bg-sky-400/10 text-sky-100 border-sky-300/15",
    heavy: "bg-amber-400/10 text-amber-100 border-amber-300/15",
    extreme: "bg-red-400/10 text-red-100 border-red-300/15"
  };
  const conditionRows = [
    ["Biomes", parseResult.biomes],
    ["Structures", parseResult.structures],
    ["Requirements", parseResult.requirements]
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          start(new FormData(event.currentTarget));
        }}
        className="rounded-[2rem] border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-2xl sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Local worker</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">AI Seed Finder</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs capitalize text-white/75">{status}</span>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Describe your ideal Minecraft world</span>
            <textarea
              name="phrase"
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
              placeholder="I want a cherry grove next to a village near spawn."
              rows={4}
              className="w-full resize-none rounded-[1.4rem] border border-white/10 bg-[#0A0A0A]/80 px-4 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-white/30"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "cherry grove village near spawn",
              "mansion on an island with an ocean view",
              "ancient city under snowy mountains",
              "stronghold close to spawn with multiple villages nearby"
            ].map((example) => (
              <button key={example} type="button" onClick={() => setPhrase(example)} className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/15 hover:text-white">
                {example}
              </button>
            ))}
          </div>
          {suggestions.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="mb-2 text-xs text-zinc-500">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setPhrase(suggestion)} className="rounded-full bg-black/35 px-3 py-1 text-xs text-zinc-300 hover:text-white">
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Edition</span>
            <select name="edition" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none focus:border-white/30">
              <option>Java</option>
              <option>Bedrock</option>
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Start seed</span>
              <input name="startSeed" value={range.startSeed} onChange={(event) => setRange((value) => ({ ...value, startSeed: Number(event.target.value) || 0 }))} type="number" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none focus:border-white/30" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">End seed</span>
              <input name="endSeed" value={range.endSeed} onChange={(event) => setRange((value) => ({ ...value, endSeed: Number(event.target.value) || 0 }))} type="number" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none focus:border-white/30" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Max results</span>
              <input name="maxResults" value={range.maxResults} onChange={(event) => setRange((value) => ({ ...value, maxResults: Number(event.target.value) || 1 }))} type="number" min="1" max="100" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none focus:border-white/30" />
            </label>
          </div>
          <div className={`rounded-2xl border p-4 ${workloadTone[parseResult.workload]}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium capitalize">{parseResult.workload} Search</p>
              <p className="text-xs opacity-75">{Math.round(parseResult.confidence * 100)}% parsed</p>
            </div>
            {parseResult.workload === "extreme" ? <p className="mt-2 text-xs opacity-80">This range is extremely large. You can run it, but cancellation is recommended if the scan takes too long.</p> : null}
          </div>
          <div className="flex gap-3 pt-2">
            <button disabled={running} className="flex-1 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50">
              Start Search
            </button>
            <button type="button" onClick={cancel} disabled={!running} className="rounded-full border border-white/15 px-5 py-3 text-sm text-white disabled:opacity-40">
              Cancel
            </button>
          </div>
        </div>
      </form>

      <section className="rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur-2xl sm:p-6">
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-500">AI Parser Output</p>
              <p className="mt-1 text-lg font-medium text-white">{parseResult.summary}</p>
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs text-zinc-300">
              {cubiomesReady ? "Cubiomes WASM" : "Cubiomes adapter"}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {conditionRows.map(([label, values]) => (
              <div key={label as string}>
                <p className="mb-2 text-xs text-zinc-500">{label as string}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(values as string[]).length ? (values as string[]).map((value) => (
                    <span key={value} className="rounded-full bg-black/35 px-2.5 py-1 text-xs text-zinc-300">{value.replaceAll("_", " ")}</span>
                  )) : <span className="text-xs text-zinc-600">Any</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-4 grid gap-3 text-sm text-zinc-300 sm:grid-cols-4">
            <span>{percent}% complete</span>
            <span>{progress.checked.toLocaleString()} checked</span>
            <span>{results.length} matches</span>
            <span>{(progress.elapsedMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
        {error ? <p className="mb-4 text-sm text-red-200">{error}</p> : null}
        <div className="grid gap-3">
          {results.map((result) => (
            <div key={result.seedNumber} className="rounded-2xl border border-white/10 bg-black/45 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{result.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">Seed #{result.seedNumber}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">{result.score}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.features.slice(0, 6).map((feature) => (
                  <span key={feature} className="rounded-full bg-white/[0.08] px-2.5 py-1 text-xs text-zinc-300">{feature}</span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{result.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => navigator.clipboard.writeText(result.seedNumber)} className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black">
                  Copy seed
                </button>
                <a href={`/seed/${encodeURIComponent(result.seedNumber)}`} className="rounded-full border border-white/10 px-4 py-2 text-xs text-white">
                  Open seed page
                </a>
              </div>
            </div>
          ))}
          {!results.length ? (
            <div className="grid min-h-80 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-center">
              <div>
                <p className="text-lg font-medium text-white">Ready when you are.</p>
                <p className="mt-2 text-sm text-zinc-500">Start a search to confirm the worker is scanning locally.</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
