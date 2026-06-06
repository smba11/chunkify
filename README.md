# Chunkify

Chunkify is a premium, real-estate-style marketplace for Minecraft world seeds. It is built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Framer Motion, and Supabase-ready auth/database/storage wiring.

## Features

- Premium dark marketplace UI for browsing Minecraft seeds
- Home, listing, detail, profile, upload, admin, and auth routes
- 100 generated sample seed listings for immediate deployment
- Seed valuation scores: rarity, builder, survival, explorer, and overall seed score
- Dynamic metadata, OpenGraph data, sitemap, robots, and structured product data
- Supabase schema with tables, indexes, and RLS policies
- Vercel-ready project config named `chunkify`

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

Copy `.env.example` and fill in Supabase values when you connect a real project:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
