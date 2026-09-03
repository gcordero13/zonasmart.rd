import { supabase } from '../lib/supabaseClient'

const TABLE = 'products'

export const fetchProducts = async () => {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const fetchProductById = async (id) => {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export const createProduct = async (product) => {
  const { data, error } = await supabase.from(TABLE).insert(product).select().single()
  if (error) throw error
  return data
}

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteProduct = async (id) => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

export const subscribeToProducts = (callback) => {
  return supabase
    .channel('products-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (payload) => {
      callback(payload)
    })
    .subscribe()
}
