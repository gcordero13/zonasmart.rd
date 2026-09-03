import { supabase } from '../lib/supabaseClient'
import { generateTrackingCode } from './orders'

export const fetchSellers = async () => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*, profiles:seller_id (...)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const fetchSellerByUser = async (userId) => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('seller_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export const createSeller = async ({ seller_id, name, email, commission_rate, referrer_code }) => {
  const { data, error } = await supabase
    .from('sellers')
    .insert({
      seller_id,
      name,
      email,
      commission_rate,
      referrer_code,
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateSeller = async (id, updates) => {
  const { data, error } = await supabase.from('sellers').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const approveSeller = async (id, commissionRate) => {
  const { data, error } = await supabase
    .from('sellers')
    .update({ status: 'active', commission_rate: commissionRate })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const suspendSeller = async (id) => {
  const { data, error } = await supabase
    .from('sellers')
    .update({ status: 'suspended' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getSellerStats = async (sellerId) => {
  const { data, error } = await supabase
    .from('commissions')
    .select('*, order:order_id (tracking_code, total)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
  if (error) throw error

  const totalEarned = data
    .filter((c) => c.status !== 'rejected')
    .reduce((sum, c) => sum + c.amount, 0)
  const paid = data.filter((c) => c.status === 'paid')
  const pending = data.filter((c) => c.status === 'pending')
  const paidAmount = paid.reduce((sum, c) => sum + c.amount, 0)
  const pendingAmount = pending.reduce((sum, c) => sum + c.amount, 0)

  return { commissions: data, totalEarned, paidAmount, pendingAmount }
}

export const markCommissionPaid = async (id) => {
  const { data, error } = await supabase
    .from('commissions')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const markCommissionRejected = async (id) => {
  const { data, error } = await supabase
    .from('commissions')
    .update({ status: 'rejected' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const fetchAllCommissions = async () => {
  const { data, error } = await supabase
    .from('commissions')
    .select('*, seller:seller_id (name, email), order:order_id (tracking_code)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const generateReferrerCode = () => {
  return `ZS-${Math.floor(Math.random() * 9000 + 1000)}`
}

export const resolveSellerByCode = async (code) => {
  if (!code) return null
  const normalized = String(code).trim().toUpperCase()
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('referrer_code', normalized)
    .eq('status', 'active')
    .maybeSingle()
  if (error) throw error
  return data
}

export const recordCommission = async ({ order_id, seller_id, amount, order_total }) => {
  const { data, error } = await supabase.from('commissions').insert({
    order_id,
    seller_id,
    amount,
    order_total,
    status: 'pending',
    created_at: new Date().toISOString(),
  }).select().single()
  if (error) throw error
  return data
}

export { generateTrackingCode }