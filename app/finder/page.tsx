import type { Metadata } from "next";
import { FinderClient } from "@/components/chunkify/finder-client";

export const metadata: Metadata = {
  title: "Seed Finder",
  description: "Run advanced Minecraft seed searches locally in your browser."
};

export default function FinderPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Custom seed finder</h1>
        <p className="mt-3 text-zinc-400">
          Search natural language seed ideas using your own device. The worker keeps the interface responsive while scanning ranges locally.
        </p>
      </div>
      <FinderClient />
    </main>
  );
}
