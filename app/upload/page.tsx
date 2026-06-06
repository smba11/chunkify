import type { Metadata } from "next";
import { ImagePlus, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { biomeFilters, popularCategories, structureFilters, versions } from "@/lib/chunkify/constants";

export const metadata: Metadata = {
  title: "Upload a Seed",
  description: "Submit a Minecraft seed for Chunkify admin approval."
};

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Badge variant="premium" className="mb-4">Submit listing</Badge>
      <h1 className="text-4xl font-semibold">List a new Chunkify seed</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Submissions enter the admin approval queue before appearing publicly. Storage-ready image fields map to Supabase Storage.
      </p>

      <form className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader><CardTitle>Seed details</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <Input name="name" placeholder="Seed Name" required />
            <Input name="seed_number" placeholder="Seed Number" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="version" className="input" defaultValue={versions[0]}>
                {versions.map((version) => <option key={version}>{version}</option>)}
              </select>
              <select name="edition" className="input" defaultValue="Java">
                <option>Java</option>
                <option>Bedrock</option>
              </select>
            </div>
            <Textarea name="description" placeholder="Description" required />
            <Textarea name="coordinates" placeholder="Coordinates, one per line. Example: Village: 240 72 -180" />
            <Input name="tags" placeholder="Tags, comma separated" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {popularCategories.map((category) => <label key={category} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground"><input className="mr-2" type="checkbox" name="categories" value={category} />{category}</label>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Biomes & Structures</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <select name="biomes" className="input" multiple>
                {biomeFilters.map((biome) => <option key={biome}>{biome}</option>)}
              </select>
              <select name="structures" className="input" multiple>
                {structureFilters.map((structure) => <option key={structure}>{structure}</option>)}
              </select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Images</CardTitle></CardHeader>
            <CardContent className="rounded-b-lg border-t border-white/10 p-5">
              <div className="grid min-h-36 place-items-center rounded-lg border border-dashed border-white/20 bg-white/[0.03] text-center">
                <div>
                  <ImagePlus className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Supabase Storage upload dropzone placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full">
            <Send className="h-4 w-4" />
            Submit for approval
          </Button>
        </div>
      </form>
    </main>
  );
}
