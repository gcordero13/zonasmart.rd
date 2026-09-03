import { createContext, useContext, useEffect, useState } from 'react'
import { fetchSettings, DEFAULT_SETTINGS } from '../services/settings'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        setSettings(s)
        applyTheme(s)
      })
      .catch(() => {})
  }, [])

  return (
    <StoreContext.Provider value={{ settings, setSettings }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore debe usarse dentro de StoreProvider')
  return context
}

export function applyTheme(settings) {
  const root = document.documentElement
  const primary = settings.primary_color || '#f59e0b'
  root.style.setProperty('--brand', primary)
  root.style.setProperty('--brand-dark', shade(primary, -15))
  root.style.setProperty('--brand-light', shade(primary, 15))
}

function shade(hex, percent) {
  const num = hex.replace('#', '')
  const full = num.length === 3 ? num.split('').map((c) => c + c).join('') : num
  const r = parseInt(full.substring(0, 2), 16)
  const g = parseInt(full.substring(2, 4), 16)
  const b = parseInt(full.substring(4, 6), 16)
  const factor = 1 + percent / 100
  const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)))
  return `#${[r, g, b]
    .map((v) => clamp(v * factor).toString(16).padStart(2, '0'))
    .join('')}`
}