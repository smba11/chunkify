import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SeedCard } from "@/components/seeds/seed-card";
import { getSeedsByProfile, profiles } from "@/lib/chunkify/mock-data";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = profiles.find((item) => item.username === username);
  return { title: profile ? `${profile.displayName}'s Profile` : "Profile" };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = profiles.find((item) => item.username === username);
  if (!profile) notFound();
  const uploads = getSeedsByProfile(username).slice(0, 9);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback>{profile.displayName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Badge variant="premium">Verified curator</Badge>
            <h1 className="mt-3 text-4xl font-semibold">{profile.displayName}</h1>
            <p className="mt-2 text-muted-foreground">@{profile.username} · {profile.bio}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:w-56">
            <div className="rounded-md border border-white/10 p-3"><p className="font-semibold">{profile.followers.toLocaleString()}</p><p className="text-xs text-muted-foreground">Followers</p></div>
            <div className="rounded-md border border-white/10 p-3"><p className="font-semibold">{profile.following}</p><p className="text-xs text-muted-foreground">Following</p></div>
          </div>
        </div>
      </Card>
      <div className="mt-8 grid gap-8">
        <section>
          <h2 className="mb-5 text-2xl font-semibold">Uploaded Seeds</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {uploads.map((seed) => <SeedCard key={seed.id} seed={seed} />)}
          </div>
        </section>
        <section className="grid gap-5 md:grid-cols-2">
          <Card className="p-5"><h2 className="text-xl font-semibold">Saved Seeds</h2><p className="mt-2 text-muted-foreground">Personal saved listings are loaded from Supabase favorites when auth is configured.</p></Card>
          <Card className="p-5"><h2 className="text-xl font-semibold">Liked Seeds</h2><p className="mt-2 text-muted-foreground">Likes use the ratings and favorites tables with user-owned RLS policies.</p></Card>
        </section>
      </div>
    </main>
  );
}
