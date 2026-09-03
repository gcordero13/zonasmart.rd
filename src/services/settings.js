import { supabase } from '../lib/supabaseClient'

const TABLE = 'store_settings'
const DEFAULT_KEY = 'store'

const CACHE_KEY = 'zs_settings_cache_v1'

export const DEFAULT_SETTINGS = {
  store_name: 'ZonaSmart',
  primary_color: '#f59e0b',
  secondary_color: '#f97316',
  hero_title: 'Tecnología que hace tu hogar inteligente',
  hero_subtitle: 'Cerraduras inteligentes, cámaras de seguridad y dispositivos de última generación.',
  whatsapp: '',
  email: 'ventas@zonasmart.rd',
  address: 'República Dominicana',
}

export const loadCachedSettings = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const cacheSettings = (value) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value))
  } catch {
    /* sin problema si el navegador bloquea el almacenamiento */
  }
}

export const fetchSettings = async () => {
  const cached = loadCachedSettings()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('key', DEFAULT_KEY)
    .maybeSingle()
  if (error) {
    return cached ? { ...DEFAULT_SETTINGS, ...cached } : DEFAULT_SETTINGS
  }
  if (data) {
    const merged = { ...DEFAULT_SETTINGS, ...data.value }
    cacheSettings(merged)
    return merged
  }
  return cached ? { ...DEFAULT_SETTINGS, ...cached } : DEFAULT_SETTINGS
}

export const saveSettings = async (value) => {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert({ key: DEFAULT_KEY, value }, { onConflict: 'key' })
    .select()
    .single()
  if (error) throw error
  return data ? value : value
}