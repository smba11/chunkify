import type { Metadata } from "next";
import { FinderClient } from "@/components/chunkify/finder-client";

export const metadata: Metadata = {
  title: "AI Seed Finder",
  description: "Describe a Minecraft world and search matching seeds locally in your browser."
};

export default function FinderPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">AI Seed Finder</h1>
        <p className="mt-3 text-zinc-400">
          Describe the world you want. Chunkify parses your prompt into search conditions and scans locally in a Web Worker.
        </p>
      </div>
      <FinderClient />
    </main>
  );
}
