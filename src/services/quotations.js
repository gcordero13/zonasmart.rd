import { supabase } from '../lib/supabaseClient'

const TABLE = 'quotations'

export const generateQuotationCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `COT-${code}`
}

export const fetchQuotations = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, sellers(name, email)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const fetchQuotationsBySeller = async (sellerId) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const fetchQuotationById = async (id) => {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export const createQuotation = async (quote) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...quote,
      quotation_code: quote.quotation_code || generateQuotationCode(),
      status: quote.status || 'pending',
      created_at: quote.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateQuotation = async (id, updates) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteQuotation = async (id) => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}