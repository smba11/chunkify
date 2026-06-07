import { redirect } from "next/navigation";

export default async function LegacySeedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/seed/${slug}`);
}
