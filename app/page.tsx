import { Search } from "lucide-react";
import { FadeIn } from "@/components/chunkify/fade-in";
import { SeedCard } from "@/components/chunkify/seed-card";
import { SearchPill } from "@/components/chunkify/search-pill";
import { browseSeeds } from "@/lib/chunkify/seeds";

const popular = ["Villages", "Cherry Groves", "Islands", "Mansions", "Ancient Cities"];

export default function HomePage() {
  const featured = browseSeeds({ sort: "popular", limit: 8 });
  const newest = browseSeeds({ sort: "newest", limit: 4 });

  return (
    <main>
      <section className="relative min-h-[94vh] overflow-hidden">
        <div className="mx-auto flex min-h-[94vh] max-w-6xl flex-col items-center justify-center px-5 pb-10 pt-28 text-center">
          <FadeIn>
            <h1 className="font-['Times_New_Roman',Times,serif] text-7xl font-normal leading-none tracking-normal text-white drop-shadow-[0_18px_50px_rgba(0,0,0,0.55)] sm:text-9xl lg:text-[11rem]">
              Chunkify
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/82 sm:text-2xl">Discover incredible Minecraft worlds.</p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <form action="/seeds" className="glass-search mt-10 flex w-full max-w-3xl flex-col gap-3 p-3 sm:flex-row sm:items-center sm:px-5 sm:py-4">
              <Search className="h-5 w-5 shrink-0 text-white/70" />
              <input
                name="q"
                aria-label="Search seeds"
                placeholder="Seed number, village, mansion, cherry grove..."
                className="h-10 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/55"
              />
              <button className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
                Search
              </button>
            </form>
          </FadeIn>

          <div className="mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
            {popular.map((item) => <SearchPill key={item} label={item} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Featured seeds</h2>
          </div>
          <a href="/seeds" className="hidden text-sm text-zinc-300 transition hover:text-white sm:block">Browse all</a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((seed, index) => <SeedCard key={seed.id} seed={seed} priority={index < 3} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <SeedList title="Newest seeds" seeds={newest} />
      </section>
    </main>
  );
}

function SeedList({ title, seeds }: { title: string; seeds: ReturnType<typeof browseSeeds> }) {
  return (
    <div className="glass rounded-[2rem] p-5">
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
      <div className="space-y-3">
        {seeds.map((seed) => (
          <a key={seed.id} href={`/seed/${seed.slug}`} className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.04] p-4 transition hover:bg-white/[0.08]">
            <div>
              <p className="font-medium text-white">{seed.name}</p>
              <p className="mt-1 text-sm text-zinc-400">#{seed.seedNumber}</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">{seed.score}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
