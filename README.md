# Chunkr

Chunkr is a modern, ultra-simple Minecraft seed discovery website. It is inspired by seeds.gg, but cleaner and quieter: fullscreen cinematic hero, fast search, simple seed cards, and one-click seed copying.

Live Vercel deployment: https://chunkrseeds.vercel.app

## Features

- Fullscreen hero with cinematic world imagery
- Glassmorphism search bar and popular searches
- Minimal seed card grid with hover lift and image zoom
- Seed detail pages with copy button, structures, coordinates, description, gallery, and similar seeds
- Simple admin panel for add/edit/delete MVP controls
- 50 realistic example seeds stored in JSON

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
NEXT_PUBLIC_SITE_URL=
```
