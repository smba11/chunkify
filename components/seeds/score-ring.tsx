import { cn } from "@/lib/utils";

export function ScoreRing({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="grid h-14 w-14 place-items-center rounded-full text-sm font-bold text-primary"
        style={{
          background: `conic-gradient(#d6b36a ${value * 3.6}deg, rgba(255,255,255,0.08) 0deg)`
        }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-full bg-card">{value}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">Valuation score</p>
      </div>
    </div>
  );
}
