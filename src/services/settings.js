import { supabase } from '../lib/supabaseClient'

const TABLE = 'store_settings'
const DEFAULT_KEY = 'store'

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

export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('key', DEFAULT_KEY)
    .maybeSingle()
  if (error) throw error
  return data ? { ...DEFAULT_SETTINGS, ...data.value } : DEFAULT_SETTINGS
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