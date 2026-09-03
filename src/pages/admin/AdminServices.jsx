import { useEffect, useState } from 'react'
import { fetchServices, createService, updateService, deleteService } from '../../services/services'

const emptyForm = {
  title: '',
  description: '',
  price: '',
  icon: 'wrench',
  active: true,
  config: { header: '', tiers: [], items: [] },
}

const ICONS = ['wrench', 'shield', 'truck', 'support', 'star', 'home', 'lock', 'phone']

const normConfig = (c) => {
  const cfg = c && typeof c === 'object' ? c : {}
  return {
    header: cfg.header || '',
    tiers: Array.isArray(cfg.tiers) ? cfg.tiers : [],
    items: Array.isArray(cfg.items) ? cfg.items : [],
  }
}

const iconPath = (icon) => {
  const map = {
    wrench: 'M10.34 3.66a3 3 0 014.32 0l1.4 1.4a3 3 0 010 4.24 3 3 0 010 4.24 3 3 0 010 4.24L13.31 16m-4.24-9.66a3 3 0 00-4.24 4.24l.7.7a2 2 0 01-1.41 3.4H3.5a2 2 0 00-1.41 3.4L4 20.6',
    shield: 'M9 12.75L11.25 15 15 9.75M21 12c0 5.4-3.7 7.5-9 10-5.3-2.5-9-4.6-9-10V5.3l9-3.3 9 3.3V12z',
    truck: 'M12 6H3v12h2M12 6h5l4 4v8h-2M9 8h5a2 2 0 012 2v6H6M9 19a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
    support: 'M18.36 6.64A9 9 0 115.64 17.36 9 9 0 0118.36 6.64zM12 8a3 3 0 00-3 3h2a1 1 0 012 0c0 1-.5 1.5-1 2.5V15h2v-.5c1-.5 1.5-1.5 1.5-2.5A3 3 0 0012 8zm-1 8h2v2h-2z',
    star: 'M11.48 3.5l1.9 3.85 4.25.62-3.07 3 .73 4.24-3.81-2L8.17 15.2l.73-4.23-3.07-3 4.25-.62L11.48 3.5z',
    home: 'M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z',
    lock: 'M12 3a4 4 0 00-4 4v4H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 00-4-4zm-2 4a2 2 0 114 0v4h-4V7z',
    phone: 'M3 5.5C3 4.1 4.1 3 5.5 3h2.1l1.6 3.5-2 1.5a12 12 0 005.8 5.8l1.5-2L17.4 13v2.1c0 1.4-1.1 2.5-2.5 2.5C9.6 17.6 3.4 11.4 3 5.5z',
  }
  return map[icon] || map.wrench
}

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetchServices()
      .then(setServices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const handleChange = (e) => {
    if (e.target.name === 'active') {
      setForm({ ...form, active: e.target.checked })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const setConfig = (fn) => setForm((f) => ({ ...f, config: fn(normConfig(f.config)) }))

  const addTier = () =>
    setConfig((c) => ({
      ...c,
      tiers: [...c.tiers, { key: `t${Date.now()}`, label: '', price: '', description: '' }],
    }))
  const updateTier = (i, patch) =>
    setConfig((c) => ({ ...c, tiers: c.tiers.map((t, j) => (j === i ? { ...t, ...patch } : t)) }))
  const removeTier = (i) => setConfig((c) => ({ ...c, tiers: c.tiers.filter((_, j) => j !== i) }))

  const addItem = () =>
    setConfig((c) => ({
      ...c,
      items: [...c.items, { key: `i${Date.now()}`, label: '', price: '', unit: 'unidad(es)' }],
    }))
  const updateItem = (i, patch) =>
    setConfig((c) => ({ ...c, items: c.items.map((t, j) => (j === i ? { ...t, ...patch } : t)) }))
  const removeItem = (i) => setConfig((c) => ({ ...c, items: c.items.filter((_, j) => j !== i) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const data = {
        title: form.title,
        description: form.description,
        price: form.price ? Number(form.price) : 0,
        icon: form.icon || 'wrench',
        active: !!form.active,
        config: {
          header: form.config.header || '',
          tiers: (form.config.tiers || [])
            .filter((t) => t.label)
            .map((t) => ({ key: t.key, label: t.label, price: Number(t.price || 0), description: t.description || '' })),
          items: (form.config.items || [])
            .filter((it) => it.label)
            .map((it) => ({
              key: it.key,
              label: it.label,
              price: Number(it.price || 0),
              unit: it.unit || 'unidad(es)',
            })),
        },
      }
      if (editing) {
        await updateService(editing.id, data)
      } else {
        await createService(data)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (s) => {
    setEditing(s)
    setForm({
      title: s.title,
      description: s.description,
      price: s.price,
      icon: s.icon,
      active: !!s.active,
      config: normConfig(s.config),
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este servicio?')) return
    try {
      await deleteService(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
        <button
          onClick={() => {
            setEditing(null)
            setForm(emptyForm)
            setShowForm(!showForm)
          }}
          className="px-4 py-2 rounded-md bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nuevo servicio'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editing ? 'Editar servicio' : 'Nuevo servicio'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
              <select
                name="icon"
                value={form.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand bg-white"
              >
                {ICONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="w-4 h-4 accent-brand"
                />
                Visible en la tienda
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          {/* Opciones configurables del servicio */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Cotización con opciones (opcional)</p>
            <p className="text-xs text-gray-500 mb-3">
              Si activas esto, los clientes podrán elegir un nivel (básica/avanzada) e indicar cantidades por
              ítem (habitaciones, baños, unidades, etc.) para armar su cotización.
            </p>
            <div className="sm:col-span-2 mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto guía</label>
              <input
                type="text"
                value={form.config.header}
                onChange={(e) => setConfig((c) => ({ ...c, header: e.target.value }))}
                placeholder="ej: ¿Cuántas habitaciones y baños necesitas limpiar?"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            {/* Niveles (tiers) */}
            <p className="text-sm font-semibold text-gray-700 mb-2">Niveles (ej. Básica / Avanzada)</p>
            <div className="space-y-2 mb-3">
              {form.config.tiers.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <input
                    type="text"
                    value={t.label}
                    onChange={(e) => updateTier(i, { label: e.target.value })}
                    placeholder="Nombre del nivel"
                    className="flex-1 px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    type="number"
                    min="0"
                    value={t.price}
                    onChange={(e) => updateTier(i, { price: e.target.value })}
                    placeholder="Precio $"
                    className="w-28 px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => removeTier(i)}
                    className="px-2 text-red-500 hover:bg-red-50 rounded"
                    title="Quitar nivel"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTier}
                className="px-3 py-1.5 rounded-md text-sm text-brand-dark font-medium border border-brand/40 hover:bg-brand/10 transition"
              >
                + Nivel
              </button>
            </div>

            {/* Ítems por cantidad */}
            <p className="text-sm font-semibold text-gray-700 mb-2">Ítems por cantidad (ej. habitaciones, baños)</p>
            <div className="space-y-2 mb-3">
              {form.config.items.map((it, i) => (
                <div key={i} className="flex items-start gap-2">
                  <input
                    type="text"
                    value={it.label}
                    onChange={(e) => updateItem(i, { label: e.target.value })}
                    placeholder="Nombre del ítem"
                    className="flex-1 px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    type="number"
                    min="0"
                    value={it.price}
                    onChange={(e) => updateItem(i, { price: e.target.value })}
                    placeholder="Precio $/unidad"
                    className="w-32 px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="px-2 text-red-500 hover:bg-red-50 rounded"
                    title="Quitar ítem"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1.5 rounded-md text-sm text-brand-dark font-medium border border-brand/40 hover:bg-brand/10 transition"
              >
                + Ítem
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 px-6 py-2 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear servicio'}
          </button>
        </form>
      )}

      {loading && <p className="text-gray-500">Cargando servicios...</p>}

      {!loading && services.length === 0 && <p className="text-gray-500">Aún no hay servicios.</p>}

      {!loading && services.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Servicio</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Visible</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand/10 text-brand-dark rounded flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath(s.icon)} />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">{s.title}</span>
                      {normConfig(s.config).items.length > 0 && (
                        <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand-dark">
                          con opciones
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {normConfig(s.config).tiers.length > 0
                      ? 'Desde $' + Math.min(...normConfig(s.config).tiers.map((t) => Number(t.price || 0))).toFixed(2)
                      : `$${Number(s.price).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.active ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(s)}
                      className="px-3 py-1 rounded text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-3 py-1 rounded text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}