-- ============================================================
-- ZonaSmart - Migración: Servicios + Instalación + Envío por zona
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ---------- 1. Instalación por producto ----------
alter table public.products add column if not exists requires_installation boolean not null default false;
alter table public.products add column if not exists installation_price numeric not null default 0;

-- Envío por zona: jsonb con { "Santo Domingo": 200, "Santiago": 300, ... }
-- Si no se configura, se usa shipping_price como base.
alter table public.products add column if not exists shipping_zones jsonb not null default '{}'::jsonb;

-- ---------- 2. Tabla de servicios del catálogo ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null default 0,
  icon text default 'wrench',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS: lectura pública, escritura autenticados
alter table public.services enable row level security;
create policy "Servicios lectura pública" on public.services
  for select using (true);
create policy "Servicios escritura autenticados" on public.services
  for all using (auth.role() = 'authenticated');