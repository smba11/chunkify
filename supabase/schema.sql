-- Chunkify Supabase schema
-- Run in Supabase SQL editor or through the Supabase CLI.

create extension if not exists pgcrypto;

create type public.seed_edition as enum ('Java', 'Bedrock');
create type public.seed_status as enum ('pending', 'approved', 'rejected');
create type public.notification_type as enum ('submission', 'favorite', 'comment', 'follow', 'system');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,32}$'),
  display_name text not null,
  avatar_url text,
  bio text default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table public.seeds (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  seed_number text not null,
  version text not null,
  edition public.seed_edition not null,
  description text not null,
  spawn_x integer not null,
  spawn_y integer not null,
  spawn_z integer not null,
  coordinates jsonb not null default '[]'::jsonb,
  biomes text[] not null default '{}',
  structures text[] not null default '{}',
  seed_score integer not null default 0 check (seed_score between 0 and 100),
  rarity_score integer not null default 0 check (rarity_score between 0 and 100),
  builder_score integer not null default 0 check (builder_score between 0 and 100),
  survival_score integer not null default 0 check (survival_score between 0 and 100),
  explorer_score integer not null default 0 check (explorer_score between 0 and 100),
  status public.seed_status not null default 'pending',
  featured boolean not null default false,
  views integer not null default 0 check (views >= 0),
  downloads integer not null default 0 check (downloads >= 0),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seed_images (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid not null references public.seeds(id) on delete cascade,
  storage_path text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.seed_categories (
  seed_id uuid references public.seeds(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (seed_id, category_id)
);

create table public.seed_tags (
  seed_id uuid references public.seeds(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (seed_id, tag_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid not null references public.seeds(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null check (length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid not null references public.seeds(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (seed_id, user_id)
);

create table public.favorites (
  seed_id uuid not null references public.seeds(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (seed_id, user_id)
);

create table public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.analytics (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid references public.seeds(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  event text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index seeds_status_created_idx on public.seeds(status, created_at desc);
create index seeds_featured_idx on public.seeds(featured) where featured = true;
create index seeds_biomes_idx on public.seeds using gin (biomes);
create index seeds_structures_idx on public.seeds using gin (structures);
create index comments_seed_idx on public.comments(seed_id, created_at desc);
create index analytics_seed_event_idx on public.analytics(seed_id, event, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.seeds enable row level security;
alter table public.seed_images enable row level security;
alter table public.seed_categories enable row level security;
alter table public.seed_tags enable row level security;
alter table public.comments enable row level security;
alter table public.ratings enable row level security;
alter table public.favorites enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;
alter table public.analytics enable row level security;

create policy "Public profiles are readable" on public.users for select using (true);
create policy "Users update own profile" on public.users for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Reference categories are readable" on public.categories for select using (true);
create policy "Reference tags are readable" on public.tags for select using (true);

create policy "Approved seeds are public" on public.seeds for select using (status = 'approved' or author_id = auth.uid() or public.is_admin());
create policy "Authenticated users submit seeds" on public.seeds for insert with check (author_id = auth.uid() and status = 'pending');
create policy "Authors update pending seeds" on public.seeds for update using (author_id = auth.uid() and status = 'pending') with check (author_id = auth.uid() and status = 'pending');
create policy "Admins manage seeds" on public.seeds for all using (public.is_admin()) with check (public.is_admin());

create policy "Seed images readable for visible seeds" on public.seed_images for select using (
  exists (select 1 from public.seeds s where s.id = seed_id and (s.status = 'approved' or s.author_id = auth.uid() or public.is_admin()))
);
create policy "Authors add seed images" on public.seed_images for insert with check (
  exists (select 1 from public.seeds s where s.id = seed_id and s.author_id = auth.uid() and s.status = 'pending')
);
create policy "Admins manage seed images" on public.seed_images for all using (public.is_admin()) with check (public.is_admin());

create policy "Seed category joins are public" on public.seed_categories for select using (true);
create policy "Seed tag joins are public" on public.seed_tags for select using (true);

create policy "Comments readable for approved seeds" on public.comments for select using (
  exists (select 1 from public.seeds s where s.id = seed_id and s.status = 'approved')
);
create policy "Users create comments" on public.comments for insert with check (user_id = auth.uid());
create policy "Users edit own comments" on public.comments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users delete own comments or admins" on public.comments for delete using (user_id = auth.uid() or public.is_admin());

create policy "Ratings are readable" on public.ratings for select using (true);
create policy "Users rate as self" on public.ratings for insert with check (user_id = auth.uid());
create policy "Users update own rating" on public.ratings for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Users read own favorites" on public.favorites for select using (user_id = auth.uid());
create policy "Users favorite as self" on public.favorites for insert with check (user_id = auth.uid());
create policy "Users remove own favorites" on public.favorites for delete using (user_id = auth.uid());

create policy "Follows are public" on public.follows for select using (true);
create policy "Users follow as self" on public.follows for insert with check (follower_id = auth.uid());
create policy "Users unfollow as self" on public.follows for delete using (follower_id = auth.uid());

create policy "Users read own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Admins read analytics" on public.analytics for select using (public.is_admin());
create policy "Authenticated analytics events" on public.analytics for insert with check (actor_id = auth.uid() or actor_id is null);

insert into public.categories (name, slug) values
  ('Survival', 'survival'),
  ('Building', 'building'),
  ('Speedrun', 'speedrun'),
  ('Village', 'village'),
  ('Mansion', 'mansion'),
  ('Cherry Grove', 'cherry-grove'),
  ('Ancient City', 'ancient-city'),
  ('Island', 'island')
on conflict do nothing;
