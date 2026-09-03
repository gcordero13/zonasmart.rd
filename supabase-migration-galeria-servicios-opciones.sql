-- ============================================================
-- ZonaSmart - Migracion: Galeria de imagenes en productos +
-- Opciones configurables en servicios (tiers + line items)
-- Ejecutar en Supabase SQL Editor
-- Nota: las columnas usan IF NOT EXISTS para no fallar si ya existen
-- ============================================================

-- ---------- 1. Galeria de imagenes en productos ----------
-- Arreglo de URLs de imagenes adicionales. La portada sigue siendo image_url.
alter table public.products add column if not exists image_gallery text[] not null default '{}';

-- ---------- 2. Opciones configurables de servicios ----------
-- config es un jsonb con la estructura opcional:
-- {
--   "header": "texto guia opcional",
--   "tiers": [ { "key": "basica", "label": "Limpieza basica", "price": 1500, "description": "..." } ],
--   "items": [ { "key": "habitaciones", "label": "Habitaciones", "price": 500, "unit": "unidad(es)" } ]
-- }
-- Los servicios sin config se muestran como antes (titulo + precio fijo).
alter table public.services add column if not exists config jsonb not null default '{}'::jsonb;
