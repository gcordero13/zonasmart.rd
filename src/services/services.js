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