import { Search } from "lucide-react";
import { FadeIn } from "@/components/chunkify/fade-in";
import { SearchPill } from "@/components/chunkify/search-pill";

const popular = ["Villages", "Cherry Groves", "Islands", "Mansions", "Ancient Cities"];
const searches = [
  ["Cherry Grove Village", "cherry grove village near spawn"],
  ["Island Mansion", "mansion on an island with an ocean view"],
  ["Snowy Ancient City", "ancient city under snowy mountains"],
  ["Speedrun Stronghold", "stronghold close to spawn with multiple villages nearby"]
];

export default function HomePage() {
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
            <h2 className="text-3xl font-semibold tracking-tight text-white">Start a Cubiomes search</h2>
          </div>
          <a href="/finder" className="hidden text-sm text-zinc-300 transition hover:text-white sm:block">AI Finder</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {searches.map(([label, query]) => (
            <a key={query} href={`/seeds?q=${encodeURIComponent(query)}`} className="group rounded-[1.65rem] border border-white/10 bg-black/30 p-5 shadow-[0_22px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-black/40">
              <p className="text-sm text-zinc-500">Local search</p>
              <h3 className="mt-10 text-2xl font-semibold tracking-tight text-white">{label}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{query}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
