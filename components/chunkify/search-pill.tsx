import Link from "next/link";

export function SearchPill({ label }: { label: string }) {
  return (
    <Link
      href={`/seeds?q=${encodeURIComponent(label)}`}
      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md transition hover:bg-white/20"
    >
      {label}
    </Link>
  );
}
