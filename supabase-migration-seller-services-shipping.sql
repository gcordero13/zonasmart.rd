-- ============================================================
-- ZonaSmart - Migración COMPLETA (segunda etapa)
-- Incluye: finanzas de productos, stock, instalación, envío por
-- zona y servicios. Idempotente. Ejecutar en Supabase SQL Editor.
-- ============================================================

-- ---------- A. Productos: finanzas y logística ----------
alter table public.products add column if not exists details text;
alter table public.products add column if not exists weight numeric;
alter table public.products add column if not exists color text;
alter table public.products add column if not exists cost_per_unit numeric not null default 0;
alter table public.products add column if not exists purchase_link text;
alter table public.products add column if not exists additional_expenses numeric not null default 0;
alter table public.products add column if not exists low_stock_threshold integer not null default 5;
alter table public.products add column if not exists shipping_price numeric not null default 0;
alter table public.products add column if not exists shipping_type text not null default 'standard'
  check (shipping_type in ('standard', 'express', 'pickup'));

-- Instalación por producto
alter table public.products add column if not exists requires_installation boolean not null default false;
alter table public.products add column if not exists installation_price numeric not null default 0;

-- Envío por zona: jsonb con { "Santo Domingo": 200, "Santiago": 300, ... }
alter table public.products add column if not exists shipping_zones jsonb not null default '{}'::jsonb;

-- ---------- B. Servicios del catálogo ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null default 0,
  icon text default 'wrench',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
create policy "Servicios lectura pública" on public.services
  for select using (true);
create policy "Servicios escritura autenticados" on public.services
  for all using (auth.role() = 'authenticated');