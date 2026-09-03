-- ============================================================
-- ZonaSmart - Servicios de ejemplo para la tienda
-- Ejecutar en Supabase SQL Editor (después de la migración completa)
-- ============================================================

insert into public.services (title, description, price, icon, active) values
  ('Instalación profesional', 'Instalamos y configuramos tu producto en tu hogar u oficina.', 0, 'wrench', true),
  ('Reparación y soporte', 'Diagnóstico y reparación de tus dispositivos inteligentes.', 0, 'support', true),
  ('Garantía extendida', 'Cobertura adicional sobre tu compra para mayor tranquilidad.', 0, 'shield', true),
  ('Envío e instalación', 'Llevamos tu equipo y lo dejamos listo para funcionar.', 0, 'truck', true)
on conflict do nothing;