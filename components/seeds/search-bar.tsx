import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/seeds" className="glass-panel flex w-full flex-col gap-3 rounded-lg p-2 sm:flex-row">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          aria-label="Search seeds"
          placeholder="Search by seed number, biome, structure, or keyword"
          className="h-12 border-transparent bg-transparent pl-10 text-base focus-visible:ring-0"
        />
      </div>
      <Button type="submit" size={compact ? "default" : "lg"} className="shrink-0">
        Search Estate
      </Button>
    </form>
  );
}
