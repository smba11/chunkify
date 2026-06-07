# Chunkify

Chunkify is a modern Minecraft seed discovery website inspired by seeds.gg: cinematic full-site imagery, fast search, simple seed cards, an interactive map, and one-click seed copying.

Live Vercel deployment: https://chunkifyseeds.vercel.app

## Features

- Full-site cinematic mountain-arch background with a dark premium tint
- Glassmorphism search bar and popular searches
- Minimal seed card grid with hover lift and image zoom
- Seed detail pages with copy button, structures, coordinates, description, gallery, and similar seeds
- Interactive seed map with highlight markers
- Browser-based custom seed finder worker
- Simple admin panel for add/edit/delete MVP controls
- 100 realistic example seeds stored in JSON

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run build
npm audit
```

## Environment

Optional public site URL:

```bash
NEXT_PUBLIC_SITE_URL=https://chunkifyseeds.vercel.app
```
