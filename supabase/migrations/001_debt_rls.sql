-- The Debt ledger: multi-tenant clients + markers with strict per-user RLS.
-- Apply in Supabase SQL Editor (or supabase db push). Idempotent.

create extension if not exists "pgcrypto";

-- --- Clients (Entity 1) ---
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) >= 2),
  influence_tier text not null default 'Local'
    check (influence_tier in ('Local', 'Federal', 'Global Syndicate')),
  status text not null default 'Active'
    check (status in ('Active', 'Settled', 'In Default')),
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;

drop policy if exists "clients_select_own" on public.clients;
create policy "clients_select_own" on public.clients
  for select using (auth.uid() = user_id);

drop policy if exists "clients_insert_own" on public.clients;
create policy "clients_insert_own" on public.clients
  for insert with check (auth.uid() = user_id);

drop policy if exists "clients_update_own" on public.clients;
create policy "clients_update_own" on public.clients
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clients_delete_own" on public.clients;
create policy "clients_delete_own" on public.clients
  for delete using (auth.uid() = user_id);

-- --- Markers (Entity 2, FK -> clients) ---
create table if not exists public.markers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  favor_type text not null check (char_length(favor_type) >= 3),
  leverage_value int not null check (leverage_value between 1 and 10),
  status text not null default 'Outstanding'
    check (status in ('Outstanding', 'Called In', 'Defaulted')),
  created_at timestamptz not null default now()
);

alter table public.markers enable row level security;

drop policy if exists "markers_select_own" on public.markers;
create policy "markers_select_own" on public.markers
  for select using (auth.uid() = user_id);

drop policy if exists "markers_insert_own" on public.markers;
create policy "markers_insert_own" on public.markers
  for insert with check (auth.uid() = user_id);

drop policy if exists "markers_update_own" on public.markers;
create policy "markers_update_own" on public.markers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "markers_delete_own" on public.markers;
create policy "markers_delete_own" on public.markers
  for delete using (auth.uid() = user_id);

-- --- Two-user proof (run as user two, expect 42501 / zero rows) ---
-- 1) As user two, both lists are empty:
--    select * from public.clients;  -- 0 rows
--    select * from public.markers;  -- 0 rows
-- 2) Inserting a marker for user one's client fails:
--    insert into public.markers (user_id, client_id, favor_type, leverage_value)
--    values (auth.uid(), '<user-one-client-uuid>', 'Alibi', 7);  -- ERROR 42501
