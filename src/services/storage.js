import { supabase } from '../lib/supabaseClient'

const BUCKET = 'product-images'

export const uploadImage = async (file, path) => {
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) throw error
  return data
}

export const getPublicUrl = (path) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export const deleteImage = async (paths) => {
  const { error } = await supabase.storage.from(BUCKET).remove(paths)
  if (error) throw error
}
