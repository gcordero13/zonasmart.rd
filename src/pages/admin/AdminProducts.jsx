import { useEffect, useState } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/products'
import { uploadImage, getPublicUrl } from '../../services/storage'

const emptyForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  delivery_days: '',
  details: '',
  color: '',
  weight: '',
  cost_per_unit: '',
  purchase_link: '',
  additional_expenses: '',
  low_stock_threshold: '',
  shipping_price: '',
  shipping_type: 'standard',
  requires_installation: false,
  installation_price: '',
  shipping_zones: '',
}

const parseShippingZones = (text) => {
  const zones = {}
  if (!text) return zones
  text.split('\n').forEach((line) => {
    const idx = line.indexOf('=')
    if (idx > -1) {
      const key = line.slice(0, idx).trim()
      const val = parseFloat(line.slice(idx + 1).trim())
      if (key && !isNaN(val)) zones[key] = val
    }
  })
  return zones
}

const stringifyShippingZones = (obj) =>
  Object.entries(obj || {})
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetchProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const resetForm = () => {
    setForm(emptyForm)
    setImageFile(null)
    setEditing(null)
    setShowForm(false)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        delivery_days: form.delivery_days ? Number(form.delivery_days) : null,
        details: form.details || null,
        color: form.color || null,
        weight: form.weight ? Number(form.weight) : null,
        cost_per_unit: form.cost_per_unit ? Number(form.cost_per_unit) : 0,
        purchase_link: form.purchase_link || null,
        additional_expenses: form.additional_expenses ? Number(form.additional_expenses) : 0,
        low_stock_threshold: form.low_stock_threshold ? Number(form.low_stock_threshold) : 5,
        shipping_price: form.shipping_price ? Number(form.shipping_price) : 0,
        shipping_type: form.shipping_type,
        requires_installation: !!form.requires_installation,
        installation_price: form.installation_price ? Number(form.installation_price) : 0,
        shipping_zones: parseShippingZones(form.shipping_zones),
      }

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `products/${Date.now()}_${editing?.id || 'new'}.${ext}`
        await uploadImage(imageFile, path)
        data.image_url = getPublicUrl(path)
      }

      if (editing) {
        await updateProduct(editing.id, data)
      } else {
        await createProduct(data)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      delivery_days: product.delivery_days ?? '',
      details: product.details ?? '',
      color: product.color ?? '',
      weight: product.weight ?? '',
      cost_per_unit: product.cost_per_unit ?? '',
      purchase_link: product.purchase_link ?? '',
      additional_expenses: product.additional_expenses ?? '',
      low_stock_threshold: product.low_stock_threshold ?? '',
      shipping_price: product.shipping_price ?? '',
      shipping_type: product.shipping_type || 'standard',
      requires_installation: !!product.requires_installation,
      installation_price: product.installation_price ?? '',
      shipping_zones: stringifyShippingZones(product.shipping_zones),
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return
    try {
      await deleteProduct(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button
          onClick={() => {
            setEditing(null)
            setForm(emptyForm)
            setShowForm(!showForm)
          }}
          className="px-4 py-2 rounded-md bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nuevo producto'}
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
            {editing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alerta de stock mínimo</label>
              <input
                type="number"
                name="low_stock_threshold"
                value={form.low_stock_threshold}
                onChange={handleChange}
                min="0"
                placeholder="ej: 5"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <p className="text-xs text-gray-400 mt-1">Te avisamos cuando el stock esté en o por debajo de este número.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de entrega (días)
              </label>
              <input
                type="number"
                name="delivery_days"
                value={form.delivery_days}
                onChange={handleChange}
                min="0"
                placeholder="ej: 3"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <h3 className="mt-6 mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Finanzas del producto (en $)
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio de venta ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo por unidad ($)</label>
              <input
                type="number"
                name="cost_per_unit"
                value={form.cost_per_unit}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gastos adicionales por unidad ($)</label>
              <input
                type="number"
                name="additional_expenses"
                value={form.additional_expenses}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="envío, aduana, etc."
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enlace donde lo compras</label>
              <input
                type="url"
                name="purchase_link"
                value={form.purchase_link}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <h3 className="mt-6 mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Detalles y envío
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="ej: Blanco"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="ej: 1.5"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio de envío ($)</label>
              <input
                type="number"
                name="shipping_price"
                value={form.shipping_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="sm:col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de envío</label>
              <select
                name="shipping_type"
                value={form.shipping_type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand bg-white"
              >
                <option value="standard">Estándar</option>
                <option value="express">Express</option>
                <option value="pickup">Recogida en tienda</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio de envío por zona</label>
              <textarea
                name="shipping_zones"
                value={form.shipping_zones}
                onChange={handleChange}
                rows="3"
                placeholder="Santo Domingo=200&#10;Santiago=300&#10;La Altagracia=350"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Escribe una zona por línea con formato <code className="font-mono">Zona=precio</code>. Si una
                zona no aparece, se usa el precio de envío base.
              </p>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="requires_installation"
                    checked={form.requires_installation}
                    onChange={(e) => setForm({ ...form, requires_installation: e.target.checked })}
                    className="w-4 h-4 accent-brand"
                  />
                  Este producto requiere instalación
                </span>
              </label>
            </div>
            {form.requires_installation && (
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio de instalación ($)
                </label>
                <input
                  type="number"
                  name="installation_price"
                  value={form.installation_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-40 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            )}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detalles importantes del producto</label>
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                rows="2"
                placeholder="Especificaciones, características, variedad, etc."
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-6 px-6 py-2 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </form>
      )}

      {loading && <p className="text-gray-500">Cargando productos...</p>}

      {!loading && products.length === 0 && (
        <p className="text-gray-500">Aún no hay productos.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Costo</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ganancia</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            -
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    ${(Number(p.cost_per_unit || 0) + Number(p.additional_expenses || 0)).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    ${(Number(p.price) - Number(p.cost_per_unit || 0) - Number(p.additional_expenses || 0)).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        p.stock <= 0
                          ? 'text-red-600 font-semibold'
                          : p.stock <= (p.low_stock_threshold ?? 5)
                            ? 'text-amber-600 font-semibold'
                            : 'text-gray-600'
                      }
                    >
                      {p.stock}
                    </span>
                    {p.stock > 0 && p.stock <= (p.low_stock_threshold ?? 5) && (
                      <span className="ml-2 text-xs text-amber-600">bajo</span>
                    )}
                    {p.stock <= 0 && <span className="ml-2 text-xs text-red-600">agotado</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 rounded text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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