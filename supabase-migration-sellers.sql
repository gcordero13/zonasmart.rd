-- ============================================================
-- ZonaSmart - Migración: Sistema de Vendedores + Configuración
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ---------- 1. Tabla de vendedores ----------
create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users(id),
  name text,
  email text not null,
  commission_rate numeric not null default 10 check (commission_rate >= 0 and commission_rate <= 100),
  referrer_code text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 2. Tabla de comisiones ----------
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  order_total numeric not null default 0,
  amount numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'rejected')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- ---------- 3. Tabla de configuración de la tienda ----------
create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Valor por defecto para la tienda
insert into public.store_settings (key, value)
select 'store', jsonb_build_object(
  'store_name', 'ZonaSmart',
  'primary_color', '#f59e0b',
  'secondary_color', '#f97316',
  'hero_title', 'Tecnología que hace tu hogar inteligente',
  'hero_subtitle', 'Cerraduras inteligentes, cámaras de seguridad y dispositivos de última generación.',
  'whatsapp', '',
  'email', 'ventas@zonasmart.rd',
  'address', 'República Dominicana'
)
where not exists (select 1 from public.store_settings where key = 'store');

-- ---------- 4. RLS ----------
alter table public.sellers enable row level security;
alter table public.commissions enable row level security;
alter table public.store_settings enable row level security;

-- Sellers: lectura pública (para resolver códigos de referido), escritura autenticados
create policy "Sellers lectura pública" on public.sellers
  for select using (true);
create policy "Sellers escritura autenticados" on public.sellers
  for all using (auth.role() = 'authenticated');

-- Comisiones: lectura pública, inserción autenticados, edición autenticados
create policy "Comisiones lectura pública" on public.commissions
  for select using (true);
create policy "Comisiones inserción autenticados" on public.commissions
  for insert with check (auth.role() = 'authenticated');
create policy "Comisiones edición autenticados" on public.commissions
  for update using (auth.role() = 'authenticated');

-- Configuración: lectura pública (para aplicar colores/marca en toda la app),
-- escritura solo autenticados (para que admin la edite)
create policy "Config lectura pública" on public.store_settings
  for select using (true);
create policy "Config escritura autenticados" on public.store_settings
  for all using (auth.role() = 'authenticated');