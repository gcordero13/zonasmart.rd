import { supabase } from '../lib/supabaseClient'

const TABLE = 'orders'

export const generateTrackingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `ZS-${code}`
}

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
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const fetchOrdersByUser = async (userId) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const trackOrderByCode = async (trackingCode, email) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('tracking_code', trackingCode)
    .eq('email', email)
    .maybeSingle()
  if (error) throw error
  return data
}

export const subscribeToOrders = (callback) => {
  return supabase
    .channel('orders-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLE }, (payload) => {
      callback(payload.new)
    })
    .subscribe()
}