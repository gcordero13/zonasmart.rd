import { useState, useEffect } from 'react'
import { useStore } from '../../context/StoreContext'
import { saveSettings, DEFAULT_SETTINGS } from '../../services/settings'

const COLORS = [
  { name: 'Ámbar (clásico)', value: '#f59e0b' },
  { name: 'Naranja vivo', value: '#f97316' },
  { name: 'Azul eléctrico', value: '#2563eb' },
  { name: 'Verde esmeralda', value: '#059669' },
  { name: 'Rojo pasión', value: '#dc2626' },
  { name: 'Morado real', value: '#7c3aed' },
  { name: 'Negro elegante', value: '#111827' },
  { name: 'Gris azulado', value: '#475569' },
]

export default function AdminSettings() {
  const { settings, setSettings } = useStore()
  const [form, setForm] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings(form)
      setSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const input = 'w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand'

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración de la tienda</h1>
        <p className="text-sm text-gray-500">Personaliza la marca, textos y colores de toda la tienda.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Marca</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
              <input name="store_name" value={form.store_name} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
              <input name="email" value={form.email} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+18090000000" className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input name="address" value={form.address} onChange={handleChange} className={input} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Colores</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color principal</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primary_color"
                  value={form.primary_color}
                  onChange={handleChange}
                  className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                />
                <span className="font-mono text-sm text-gray-500">{form.primary_color}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color secundario</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondary_color"
                  value={form.secondary_color}
                  onChange={handleChange}
                  className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                />
                <span className="font-mono text-sm text-gray-500">{form.secondary_color}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onClick={() => setForm((f) => ({ ...f, primary_color: c.value }))}
                className="h-9 w-9 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Página principal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del hero</label>
              <input name="hero_title" value={form.hero_title} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo del hero</label>
              <textarea name="hero_subtitle" value={form.hero_subtitle} onChange={handleChange} rows={2} className={input} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Cambios guardados</span>}
        </div>
      </form>
    </div>
  )
}