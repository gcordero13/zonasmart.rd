import { supabase } from '../lib/supabaseClient'

const TABLE = 'services'

export const fetchServices = async () => {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const fetchActiveServices = async () => {
  const { data, error } = await supabase.from(TABLE).select('*').eq('active', true).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createService = async (service) => {
  const { data, error } = await supabase.from(TABLE).insert(service).select().single()
  if (error) throw error
  return data
}

export const updateService = async (id, updates) => {
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteService = async (id) => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

// ---- Utilidades para cotización de servicios con opciones ----

// Devuelve las opciones configuradas (o vacías) de un servicio
export const serviceConfig = (service) => {
  const cfg = service && typeof service.config === 'object' ? service.config : {}
  return {
    header: cfg.header || '',
    tiers: Array.isArray(cfg.tiers) ? cfg.tiers : [],
    items: Array.isArray(cfg.items) ? cfg.items : [],
  }
}

// Calcula el desglose y total de una cotización de servicio.
// state: { tierKey, qty: { itemKey: n } }
export const computeServiceQuote = (service, state = {}) => {
  const cfg = serviceConfig(service)
  const tier = cfg.tiers.find((t) => t.key === state.tierKey)
  const tierPrice = Number(tier?.price || 0)
  const lines = []
  for (const item of cfg.items) {
    const qty = Math.max(0, Number(state.qty?.[item.key] || 0))
    if (qty > 0) {
      lines.push({
        key: item.key,
        label: item.label,
        unit: item.unit || 'unidad(es)',
        qty,
        price: Number(item.price || 0),
        total: qty * Number(item.price || 0),
      })
    }
  }
  const itemTotal = lines.reduce((s, l) => s + l.total, 0)
  const total = tierPrice + itemTotal
  return { cfg, tier, lines, tierPrice, itemTotal, total }
}