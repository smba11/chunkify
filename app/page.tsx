import Image from "next/image";
import { Search } from "lucide-react";
import { FadeIn } from "@/components/chunkr/fade-in";
import { ChunkrSeedCard } from "@/components/chunkr/seed-card";
import { SearchPill } from "@/components/chunkr/search-pill";
import { allSeeds } from "@/lib/chunkr/seeds";

const popular = ["Villages", "Cherry Groves", "Islands", "Mansions", "Ancient Cities"];

export default function HomePage() {
  const featured = allSeeds.slice(0, 9);

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/hero-mountain-arch.svg"
          alt="Mountain arch Minecraft world"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 pb-12 pt-28 text-center">
          <FadeIn>
            <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-8xl">Chunkr</h1>
            <p className="mt-5 text-xl text-white/80 sm:text-2xl">Discover incredible Minecraft worlds.</p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <form action="/seeds" className="glass-search mt-10 flex w-full max-w-3xl items-center gap-3 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-white/70" />
              <input
                name="q"
                aria-label="Search seeds"
                placeholder="Seed number, Village, Mansion, Cherry Grove, Ancient City..."
                className="h-10 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/55"
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
            <p className="text-sm text-zinc-400">Featured seeds</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Start somewhere beautiful.</h2>
          </div>
          <a href="/seeds" className="hidden text-sm text-zinc-300 transition hover:text-white sm:block">Browse all</a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((seed, index) => <ChunkrSeedCard key={seed.id} seed={seed} priority={index < 3} />)}
        </div>
      </section>
    </main>
  );
}
