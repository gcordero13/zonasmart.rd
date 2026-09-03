export const searchLocation = async (query) => {
  if (!query.trim()) return []
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
    query.trim()
  )}&limit=6&accept-language=es`
  const res = await fetch(url)
  const data = await res.json()
  return (data || []).map((r) => ({
    lat: Number(r.lat),
    lng: Number(r.lon),
    label: r.display_name,
    city:
      r.address?.city ||
      r.address?.town ||
      r.address?.village ||
      r.address?.county ||
      r.address?.municipality ||
      '',
    province: r.address?.state || r.address?.province || '',
  }))
}

export const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`
  const res = await fetch(url)
  const data = await res.json()
  const address = data.address || {}
  return {
    city:
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      address.municipality ||
      '',
    province: address.state || address.province || '',
  }
}

export const estimateLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no soporta geolocalización.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=es`
          const res = await fetch(url)
          const data = await res.json()
          const address = data.address || {}
          const city = address.city || address.town || address.village || address.county || ''
          const province = address.state || address.province || ''
          resolve({ latitude, longitude, city, province })
        } catch {
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, city: '', province: '' })
        }
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })