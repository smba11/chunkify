"use client";

import { useState } from "react";

export function CopySeedButton({ seedNumber }: { seedNumber: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(seedNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90"
    >
      {copied ? "Copied" : "Copy seed"}
    </button>
  );
}
