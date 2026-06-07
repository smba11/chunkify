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
  const [advanced, setAdvanced] = useState(false);
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
    setResults([]);
    setError(null);
    setProgress({ checked: 0, total: 0, matches: 0, elapsedMs: 0 });

    worker.onmessage = (event: MessageEvent<{ type: string; payload: unknown }>) => {
      if (event.data.type === "PROGRESS") setProgress(event.data.payload as Progress);
      if (event.data.type === "MATCH_FOUND") setResults((items) => [...items, event.data.payload as SeedSearchMatch]);
      if (event.data.type === "ERROR") {
        setError(String(event.data.payload));
        setRunning(false);
      }
      if (event.data.type === "COMPLETE") setRunning(false);
    };

    worker.postMessage({
      type: "START_SEARCH",
      payload: {
        phrase: String(formData.get("phrase") || ""),
        edition: String(formData.get("edition") || "Java") as Edition,
        startSeed: Number(formData.get("startSeed") || 1),
        endSeed: Number(formData.get("endSeed") || 100000),
        maxResults: Number(formData.get("maxResults") || 20)
      }
    });
  }

  function cancel() {
    workerRef.current?.postMessage({ type: "CANCEL_SEARCH" });
    setRunning(false);
  }

  const percent = progress.total ? Math.min(100, Math.round((progress.checked / progress.total) * 100)) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <form action={start} className="rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-2xl backdrop-blur-2xl">
        <p className="mb-5 rounded-2xl border border-white/10 bg-white/[0.08] p-4 text-sm leading-6 text-zinc-300">
          This search runs on your device. Large ranges may impact performance.
        </p>
        <div className="space-y-4">
          <input name="phrase" placeholder="cherry grove village near spawn" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none placeholder:text-zinc-500" />
          <select name="edition" className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none">
            <option>Java</option>
            <option>Bedrock</option>
          </select>
          <button type="button" onClick={() => setAdvanced((value) => !value)} className="text-sm text-zinc-300 hover:text-white">
            {advanced ? "Hide advanced" : "Advanced"}
          </button>
          {advanced ? (
            <div className="grid gap-3">
              <input name="startSeed" defaultValue="1" type="number" className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none" />
              <input name="endSeed" defaultValue="100000" type="number" className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none" />
              <input name="maxResults" defaultValue="20" type="number" min="1" max="100" className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-white outline-none" />
            </div>
          ) : null}
          <div className="flex gap-3">
            <button disabled={running} className="flex-1 rounded-full bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-50">
              Start Search
            </button>
            <button type="button" onClick={cancel} disabled={!running} className="rounded-full border border-white/15 px-5 py-3 text-sm text-white disabled:opacity-40">
              Cancel
            </button>
          </div>
        </div>
      </form>

      <section className="rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-2xl">
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
            <div key={result.seedNumber} className="rounded-2xl border border-white/10 bg-[#111111]/80 p-4">
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
          {!results.length ? <p className="py-12 text-center text-zinc-500">Run a search to see local matches.</p> : null}
        </div>
      </section>
    </div>
  );
}
