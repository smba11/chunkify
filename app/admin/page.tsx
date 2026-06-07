import type { Metadata } from "next";
import { allSeeds } from "@/lib/chunkify/seeds";

export const metadata: Metadata = {
  title: "Admin",
  description: "Simple Chunkify seed admin panel."
};

export default function AdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-20 pt-28 sm:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Admin</h1>
        <p className="mt-3 text-zinc-400">Simple MVP controls for managing seed listings.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form className="rounded-3xl bg-[#111111] p-6">
          <h2 className="text-xl font-semibold text-white">Add seed</h2>
          <div className="mt-5 space-y-3">
            {["Seed name", "Seed number", "Edition", "Version", "Tags"].map((label) => (
              <input key={label} placeholder={label} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500" />
            ))}
            <textarea placeholder="Description" className="min-h-28 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500" />
            <button type="button" className="w-full rounded-full bg-white py-3 text-sm font-medium text-black">Add seed</button>
          </div>
        </form>

        <div className="rounded-3xl bg-[#111111]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-xl font-semibold text-white">Seeds</h2>
          </div>
          <div className="divide-y divide-white/10">
            {allSeeds.slice(0, 12).map((seed) => (
              <div key={seed.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-white">{seed.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">#{seed.seedNumber}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">Edit</button>
                  <button className="rounded-full bg-white px-4 py-2 text-sm text-black">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
