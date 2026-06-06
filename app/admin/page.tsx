import type { Metadata } from "next";
import { BarChart3, CheckCircle2, Shield, Star, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seedListings } from "@/lib/chunkify/mock-data";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Chunkify approval queue, analytics, user management, and featured seed controls."
};

export default function AdminPage() {
  const pending = seedListings.filter((seed) => seed.status === "pending");
  const approved = seedListings.filter((seed) => seed.status === "approved");

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="premium" className="mb-4">Admin</Badge>
          <h1 className="text-4xl font-semibold">Chunkify command center</h1>
          <p className="mt-3 text-muted-foreground">Approve submissions, feature seeds, manage users, and monitor marketplace analytics.</p>
        </div>
        <Button variant="secondary"><Shield className="h-4 w-4" /> Role protected by Supabase RLS</Button>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={CheckCircle2} label="Approved" value={approved.length.toString()} />
        <Metric icon={BarChart3} label="Total views" value={approved.reduce((sum, seed) => sum + seed.views, 0).toLocaleString()} />
        <Metric icon={Users} label="Users" value="5,842" />
        <Metric icon={Star} label="Avg rating" value="4.6" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Approval Queue</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {pending.map((seed) => (
                <div key={seed.id} className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-medium">{seed.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{seed.edition} · {seed.version} · submitted by {seed.author}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm"><CheckCircle2 className="h-4 w-4" /> Approve</Button>
                    <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Feature Seeds</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {approved.slice(0, 6).map((seed) => (
              <div key={seed.id} className="flex items-center justify-between rounded-md border border-white/10 p-3">
                <div>
                  <p className="text-sm font-medium">{seed.name}</p>
                  <p className="text-xs text-muted-foreground">Score {seed.scores.seed}</p>
                </div>
                <Button size="sm" variant={seed.featured ? "default" : "secondary"}>{seed.featured ? "Featured" : "Feature"}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card className="p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-4 text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}
