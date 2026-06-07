import { Search } from "lucide-react";
import { FadeIn } from "@/components/chunkify/fade-in";
import { SeedCard } from "@/components/chunkify/seed-card";
import { SearchPill } from "@/components/chunkify/search-pill";
import { browseSeeds } from "@/lib/chunkify/seeds";

const popular = ["Villages", "Cherry Groves", "Islands", "Mansions", "Ancient Cities"];

export default function HomePage() {
  const featured = browseSeeds({ sort: "popular", limit: 6 });
  const trending = browseSeeds({ query: "village", limit: 3 });
  const newest = browseSeeds({ sort: "newest", limit: 3 });

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 pb-12 pt-28 text-center">
          <FadeIn>
            <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-8xl">Chunkify</h1>
            <p className="mt-5 text-xl text-white/80 sm:text-2xl">Discover incredible Minecraft worlds.</p>
            <p className="mt-3 text-base text-white/55 sm:text-lg">Browse, search, and find the perfect Minecraft seed.</p>
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

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {popular.map((item) => <SearchPill key={item} label={item} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">Featured Seeds</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Start somewhere beautiful.</h2>
          </div>
          <a href="/seeds" className="hidden text-sm text-zinc-300 transition hover:text-white sm:block">Browse all</a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((seed, index) => <SeedCard key={seed.id} seed={seed} priority={index < 3} />)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-8 lg:grid-cols-2">
        <SeedList title="Trending Seeds" seeds={trending} />
        <SeedList title="Newest Seeds" seeds={newest} />
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
