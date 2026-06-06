# Chunkify Agents Guide

## Product Boundary

Chunkify is a premium real-estate-style marketplace for Minecraft world seeds. It helps users discover, save, rate, upload, and review simulated seed listings. It is not affiliated with Mojang, Microsoft, Zillow, or Airbnb.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS and shadcn/ui source components
- Framer Motion for restrained page animation
- Supabase Auth, Postgres, RLS, and Storage
- Vercel deployment

## Implementation Rules

- Keep the app premium, modern, dark, and information-dense.
- Use real marketplace UI patterns before game-like UI patterns.
- Avoid pixel fonts, blocky controls, and cheap gaming aesthetics.
- Do not expose Supabase service-role keys in browser code.
- Do not rely on middleware as the only admin/auth boundary; verify authorization in server routes and database RLS.
- Use `SeedListing`, `SeedScores`, `Coordinate`, and `Edition` naming for seed domain code.

## Current Data Mode

The app ships with 100 generated sample seed listings for immediate Vercel deployment. Supabase schema and API routes are included so persistence can be enabled with environment variables and database setup.

## Supabase Tables

Expected tables: `users`, `seeds`, `seed_images`, `comments`, `ratings`, `favorites`, `follows`, `notifications`, `categories`, `tags`, and `analytics`, plus join tables for seed categories and tags.

## Verification

Before handing off meaningful changes, run:

```text
npm run typecheck
npm run build
npm audit
```
