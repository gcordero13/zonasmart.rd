-- ============================================================
-- ZonaSmart - Migración: Galería de imágenes en productos +
-- Opciones configurables en servicios (tiers + line items)
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ---------- 1. Galería de imágenes en productos ----------
-- Arreglo de URLs de imágenes adicionales. La portada sigue siendo image_url.
alter table public.products add column if not exists image_gallery text[] not null default '{}';

-- ---------- 2. Opciones configurables de servicios ----------
-- config es un jsonb con la estructura opcional:
-- {
--   "header": "texto guía opcional",
--   "tiers": [ { "key": "basica", "label": "Limpieza básica", "price": 1500, "description": "..." } ],
--   "items": [ { "key": "habitaciones", "label": "Habitaciones", "price": 500, "unit": "unidad(es)" } ]
-- }
-- Los servicios sin config se muestran como antes (titulo + precio fijo).
alter table public.services add column if not exists config jsonb not null default '{}'::jsonb;
