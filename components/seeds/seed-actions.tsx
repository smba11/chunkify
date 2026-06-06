"use client";

import { useState } from "react";
import { Check, Copy, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SeedActions({ seedNumber, title }: { seedNumber: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copySeed() {
    await navigator.clipboard.writeText(seedNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function shareSeed() {
    if (navigator.share) {
      await navigator.share({ title, text: `View ${title} on Chunkify`, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Button onClick={copySeed} variant="secondary">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        Copy seed
      </Button>
      <Button variant="secondary">
        <Heart className="h-4 w-4" />
        Save seed
      </Button>
      <Button onClick={shareSeed} variant="secondary">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
}
