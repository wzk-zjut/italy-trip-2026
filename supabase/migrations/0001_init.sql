-- =====================================================================
-- 意大利旅行 2026 —— Supabase 初始化（Phase 2）
-- 建表 + 行级安全策略（RLS）。在 Supabase SQL Editor 里整段粘贴执行，
-- 或用 Supabase CLI：supabase db reset（会自动跑 migrations + seed）。
-- =====================================================================

-- 自动维护 updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------- trip_days -------------------------------
create table if not exists public.trip_days (
  id            text primary key default gen_random_uuid()::text,
  date          date not null,
  weekday       text not null default '',
  city          text not null default '',
  hotel_id      text,
  title         text not null,
  pace          text not null default 'medium' check (pace in ('easy','medium','busy')),
  summary       text not null default '',
  morning       text not null default '',
  afternoon     text not null default '',
  evening       text not null default '',
  optional_plan text,
  transport_note text,
  food_note     text,
  reminder      text,
  map_url       text,
  spots         jsonb not null default '[]'::jsonb,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists trip_days_date_idx on public.trip_days (date);

-- -------------------------------- hotels --------------------------------
create table if not exists public.hotels (
  id             text primary key default gen_random_uuid()::text,
  city           text not null default '',
  name           text not null,
  check_in       date not null,
  check_out      date not null,
  nights         integer not null default 1,
  area_note      text not null default '',
  transport_note text not null default '',
  public_note    text,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ------------------------------- bookings -------------------------------
create table if not exists public.bookings (
  id           text primary key default gen_random_uuid()::text,
  type         text not null default 'other' check (type in ('flight','train','ticket','hotel','todo','other')),
  title        text not null,
  date         date not null,
  time         text,
  city         text,
  status       text not null default 'todo' check (status in ('booked','todo','optional','cancelled')),
  is_important boolean not null default false,
  public_note  text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists bookings_date_idx on public.bookings (date);

-- ----------------------------- private_notes -----------------------------
-- 敏感信息单独存放，公开角色（anon）完全无法访问。
create table if not exists public.private_notes (
  id          text primary key default gen_random_uuid()::text,
  entity_type text not null check (entity_type in ('trip_day','hotel','booking')),
  entity_id   text not null,
  note        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists private_notes_entity_idx
  on public.private_notes (entity_type, entity_id);

-- updated_at 触发器
drop trigger if exists trg_trip_days_updated on public.trip_days;
create trigger trg_trip_days_updated before update on public.trip_days
  for each row execute function public.set_updated_at();
drop trigger if exists trg_hotels_updated on public.hotels;
create trigger trg_hotels_updated before update on public.hotels
  for each row execute function public.set_updated_at();
drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings
  for each row execute function public.set_updated_at();
drop trigger if exists trg_private_notes_updated on public.private_notes;
create trigger trg_private_notes_updated before update on public.private_notes
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 行级安全（RLS）
--   公开表：anon 只读；authenticated 可写。
--   private_notes：anon 无任何权限；仅 authenticated 可读写。
--   注：后台若用 service_role key（服务端）写入，会绕过 RLS —— 因此
--       service_role key 绝不能出现在前端，只能在服务器使用。
-- =====================================================================
alter table public.trip_days     enable row level security;
alter table public.hotels        enable row level security;
alter table public.bookings      enable row level security;
alter table public.private_notes enable row level security;

-- 公开只读
create policy "trip_days public read"  on public.trip_days for select using (true);
create policy "hotels public read"     on public.hotels    for select using (true);
create policy "bookings public read"   on public.bookings  for select using (true);

-- 登录用户可写（Phase 2 若改用 Supabase Auth 时生效）
create policy "trip_days auth write" on public.trip_days
  for all to authenticated using (true) with check (true);
create policy "hotels auth write" on public.hotels
  for all to authenticated using (true) with check (true);
create policy "bookings auth write" on public.bookings
  for all to authenticated using (true) with check (true);

-- 私密备注：仅登录用户可读写；anon 无策略 => 完全不可见
create policy "private_notes auth all" on public.private_notes
  for all to authenticated using (true) with check (true);
