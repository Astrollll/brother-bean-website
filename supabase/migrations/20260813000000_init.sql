-- Brother Bean Coffee House — initial schema
-- Content tables + RLS for the public site and the admin dashboard.

-- ============================================================
-- Helper functions
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- Admin profiles (tied to Supabase Auth users)
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Returns true when the authenticated user is an active admin (owner or staff).
create or replace function public.has_admin_role()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
      and p.role in ('owner', 'staff')
  );
$$;

-- ============================================================
-- Content tables
-- ============================================================

-- Key/value JSON content: announcement, site_info, page_copy, home_sections
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Upcoming events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null default '',
  time text not null default '',
  description text not null default '',
  price text not null default '',
  day text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Gallery photos
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  storage_path text,
  alt_text text not null default '',
  caption text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Menu items
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price text not null default '',
  category text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog posts (markdown bodies)
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  body_markdown text not null default '',
  published_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- updated_at triggers
-- ============================================================

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.events;
create trigger set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.gallery_images;
create trigger set_updated_at
  before update on public.gallery_images
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.menu_items;
create trigger set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.blog_posts;
create trigger set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.events enable row level security;
alter table public.gallery_images enable row level security;
alter table public.menu_items enable row level security;
alter table public.blog_posts enable row level security;

-- Public can read content; only admins can modify.
create policy "public read site_content" on public.site_content
  for select using (true);
create policy "admin write site_content" on public.site_content
  for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());

create policy "public read events" on public.events
  for select using (true);
create policy "admin write events" on public.events
  for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());

create policy "public read gallery_images" on public.gallery_images
  for select using (true);
create policy "admin write gallery_images" on public.gallery_images
  for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());

create policy "public read menu_items" on public.menu_items
  for select using (true);
create policy "admin write menu_items" on public.menu_items
  for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());

create policy "public read blog_posts" on public.blog_posts
  for select using (true);
create policy "admin write blog_posts" on public.blog_posts
  for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());

-- Profiles: read your own; admins can read all.
create policy "profiles read own" on public.profiles
  for select using (auth.uid() = id or public.has_admin_role());
create policy "admin write profiles" on public.profiles
  for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());

-- ============================================================
-- Storage bucket for site images
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do nothing;

create policy "public read site-images" on storage.objects
  for select using (bucket_id = 'site-images');

create policy "admin upload site-images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-images' and public.has_admin_role());

create policy "admin update site-images" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-images' and public.has_admin_role());

create policy "admin delete site-images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-images' and public.has_admin_role());
