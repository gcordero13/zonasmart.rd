import { supabase } from '../lib/supabaseClient'

const TABLE = 'orders'

export const createOrder = async (order) => {
  const { data, error } = await supabase.from(TABLE).insert(order).select().single()
  if (error) throw error
  return data
}

export const fetchOrders = async () => {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const fetchOrderById = async (id) => {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase.from(TABLE).update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}
