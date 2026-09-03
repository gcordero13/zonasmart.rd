-- ============================================================
-- ZonaSmart - Migración: Finanzas de productos + Stock
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ---------- Productos: columnas financieras y de logística ----------
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