import { supabase } from '../lib/supabaseClient'

const TABLE = 'reviews'

export const fetchReviews = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createReview = async (review) => {
  const { data, error } = await supabase.from(TABLE).insert(review).select().single()
  if (error) throw error
  return data
}

export const deleteReview = async (id) => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

export const subscribeToReviews = (callback) => {
  return supabase
    .channel('reviews-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLE }, (payload) => {
      callback(payload.new)
    })
    .subscribe()
}