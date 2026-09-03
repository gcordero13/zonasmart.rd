import { supabase } from '../lib/supabaseClient'

export const sendSellerWelcome = async ({ to, name, referrerCode, storeName }) => {
  const { error } = await supabase.functions.invoke('send-seller-welcome', {
    body: { to, name, referrerCode, storeName },
  })
  if (error) throw error
}

export const sendOrderNotification = async ({ to, customerName, trackingCode, total, shipping, status, items, storeName }) => {
  const { error } = await supabase.functions.invoke('send-order-notification', {
    body: { to, customerName, trackingCode, total, shipping, status, items, storeName },
  })
  if (error) throw error
}