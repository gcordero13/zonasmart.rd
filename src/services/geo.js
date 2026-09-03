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