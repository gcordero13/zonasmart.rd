-- ============================================================
-- ZonaSmart - Migración: Pedidos (columnas envío/geolocalización)
-- + Cotizador (quotations) + Items de cotización
-- Idempotente. Ejecutar en Supabase SQL Editor.
-- ============================================================

-- ---------- A. Asegurar columnas del pedido ----------
alter table public.orders add column if not exists address text;
alter table public.orders add column if not exists city text;
alter table public.orders add column if not exists zip text;
alter table public.orders add column if not exists whatsapp text;
alter table public.orders add column if not exists subtotal numeric;
alter table public.orders add column if not exists shipping numeric;
alter table public.orders add column if not exists lat double precision;
alter table public.orders add column if not exists lng double precision;

-- ---------- B. Cotizaciones ----------
create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_code text not null unique,
  seller_id uuid references public.sellers(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_whatsapp text,
  notes text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'converted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotations enable row level security;
create policy "Cotizaciones lectura autenticados" on public.quotations
  for select using (auth.role() = 'authenticated');
create policy "Cotizaciones inserción autenticados" on public.quotations
  for insert with check (auth.role() = 'authenticated');
create policy "Cotizaciones edición autenticados" on public.quotations
  for update using (auth.role() = 'authenticated');