import { supabase } from '../lib/supabaseClient'

export const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })
  if (error) throw error
  return data
}

export const upsertProfile = async ({ id, email, name }) => {
  try {
    const { error } = await supabase.from('profiles').upsert({ id, email, name })
    if (error && !error.message.includes('does not exist')) {
      console.warn('No se pudo guardar el perfil:', error.message)
    }
  } catch {
    // el perfil es opcional; no debe bloquear la autenticación
  }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

export const onAuthStateChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
  return data.subscription
}

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
  return data
}
