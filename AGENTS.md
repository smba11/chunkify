# Chunkify Agents Guide

## Product Boundary

Chunkify is a minimal Minecraft seed discovery website. It is a fast browsing experience for world seeds, not a dashboard or gaming UI.

## Design Direction

- Minimal, fast, clean, and heavily image-led.
- Inspired by seeds.gg, but simpler.
- Use white typography, #0A0A0A backgrounds, #111111 cards, #A1A1AA secondary text.
- Avoid pixel fonts, bright green gaming palettes, blocky UI, dashboards, or clutter.
- Primary workflow: search, browse seed cards, open a seed, copy seed number.
- The mountain-arch world image is the global background treatment across the app.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui source components
- Framer Motion
- Static JSON seed data for MVP

## Data

Seed data lives in `data/seeds.json`. Keep the MVP simple unless the user asks for persistence.

## Verification

Run:

```text
npm run typecheck
npm run build
```
