import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "positive" | "negative" | "neutral";
};

export function StatCard({ label, value, detail, tone = "neutral" }: StatCardProps) {
  const toneClass =
    tone === "positive" ? "text-emerald-300" : tone === "negative" ? "text-rose-300" : "text-muted-foreground";

  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-50">{value}</p>
      <p className={`mt-2 text-sm ${toneClass}`}>{detail}</p>
    </Card>
  );
}
