"use client";

import { useEffect, useRef, useState } from "react";
import type { Edition, SeedSearchMatch } from "@/types/chunkify";

type Progress = {
  checked: number;
  total: number;
  matches: number;
  elapsedMs: number;
};

export function FinderClient() {
  const workerRef = useRef<Worker | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "complete" | "cancelled" | "error">("idle");
  const [progress, setProgress] = useState<Progress>({ checked: 0, total: 0, matches: 0, elapsedMs: 0 });
  const [results, setResults] = useState<SeedSearchMatch[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => workerRef.current?.terminate();
  }, []);

  function start(formData: FormData) {
    workerRef.current?.terminate();
    const worker = new Worker(new URL("../../workers/seedFinder.worker.ts", import.meta.url));
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
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">Find a seed</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs capitalize text-white/75">{status}</span>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Search phrase</span>
            <input name="phrase" defaultValue="cherry grove village near spawn" placeholder="cherry grove village near spawn" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-white/30" />
          </label>
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
              <input name="startSeed" defaultValue="1" type="number" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none focus:border-white/30" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">End seed</span>
              <input name="endSeed" defaultValue="100000" type="number" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none focus:border-white/30" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Max results</span>
              <input name="maxResults" defaultValue="20" type="number" min="1" max="100" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none focus:border-white/30" />
            </label>
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
              <p className="mt-3 text-sm leading-6 text-zinc-400">{result.description}</p>
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
