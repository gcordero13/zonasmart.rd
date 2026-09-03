import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchProducts } from '../../services/products'
import { fetchSellerByUser } from '../../services/sellers'
import { uploadImage, getPublicUrl } from '../../services/storage'
import {
  fetchQuotations,
  createQuotation,
  deleteQuotation,
  generateQuotationCode,
} from '../../services/quotations'
import QuoteDocument from '../../components/QuoteDocument'

const empty = {
  customer_name: '',
  customer_email: '',
  customer_whatsapp: '',
  notes: '',
  items: [],
}

export default function Cotizador() {
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [quotes, setQuotes] = useState([])
  const [mySeller, setMySeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(empty)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [qty, setQty] = useState(1)
  const [shipping, setShipping] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [status, setStatus] = useState('pending')
  const [previewQuote, setPreviewQuote] = useState(null)
  const [coverIndex, setCoverIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [coverImages, setCoverImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const admin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin'

  useEffect(() => {
    const load = async () => {
      setError(null)
      try {
        const [prods] = await Promise.all([fetchProducts()])
        setProducts(prods)
        let qs = []
        let slider = null
        if (user) {
          slider = await fetchSellerByUser(user.id).catch(() => null)
          setMySeller(slider)
          qs = await fetchQuotations().catch(() => [])
        }
        setQuotes(qs)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const subtotal = useMemo(
    () => form.items.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 1), 0),
    [form.items]
  )
  const total = Math.max(0, subtotal + Number(shipping || 0) - Number(discount || 0))

  const addItem = () => {
    const prod = products.find((p) => p.id === selectedProduct)
    if (!prod) return
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        {
          id: prod.id,
          name: prod.name,
          price: Number(prod.price),
          qty: Number(qty || 1),
          image_url: prod.image_url || null,
        },
      ],
    }))
    setSelectedProduct('')
    setQty(1)
  }

  const removeItem = (idx) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const path = `quotations/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      await uploadImage(file, path)
      setCoverImages((imgs) => [...imgs, getPublicUrl(path)])
    } catch (err) {
      setError('No se pudo subir la imagen: ' + err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeCover = (url) => setCoverImages((imgs) => imgs.filter((i) => i !== url))

  const handleSubmit = async () => {
    if (!form.customer_name || form.items.length === 0) {
      setError('Debes indicar el nombre del cliente y al menos un producto.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const productImages = form.items.map((i) => i.image_url).filter(Boolean)
      const cover_images = [...new Set([...coverImages, ...productImages])]
      const quote = {
        seller_id: mySeller?.id || null,
        customer_name: form.customer_name,
        customer_email: form.customer_email || null,
        customer_whatsapp: form.customer_whatsapp || null,
        notes: form.notes || null,
        items: form.items,
        cover_images,
        subtotal,
        shipping: Number(shipping || 0),
        discount: Number(discount || 0),
        total,
        status,
        quotation_code: generateQuotationCode(),
      }
      const created = await createQuotation(quote)
      setQuotes((q) => [created, ...q])
      setPreviewQuote(created)
      resetForm()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setForm(empty)
    setShipping(0)
    setDiscount(0)
    setStatus('pending')
    setCoverImages([])
  }

  const openPreview = (q) => {
    setCoverIndex(0)
    setPreviewQuote(q)
  }

  const handleCover = (dir) => {
    const len = (previewQuote?.cover_images || []).filter(Boolean).length
    if (len <= 1) return
    setCoverIndex((i) =>
      dir === 'next' ? (i + 1) % len : (i - 1 + len) % len
    )
  }

  // Autoplay del carrousel en preview
  useEffect(() => {
    if (!previewQuote) return
    const len = (previewQuote.cover_images || []).filter(Boolean).length
    if (len <= 1) return
    const t = setInterval(() => setCoverIndex((i) => (i + 1) % len), 3500)
    return () => clearInterval(t)
  }, [previewQuote])

  const printQuote = () => {
    if (!previewQuote) return
    setCoverIndex(0) // fijar primera imagen al imprimir
    setTimeout(() => window.print(), 80)
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-500">Cargando cotizador...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cotizador</h1>
          <p className="text-gray-500">Crea cotizaciones profesionales con tu marca y compártelas en segundos.</p>
        </div>
        <Link to="/" className="text-sm text-brand-dark font-medium hover:underline">
          ← Volver a la tienda
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="gradient-brand text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Nueva cotización
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente / Comprador *</label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Nombre del cliente"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email del cliente</label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp del cliente</label>
                <input
                  type="text"
                  value={form.customer_whatsapp}
                  onChange={(e) => setForm({ ...form, customer_whatsapp: e.target.value })}
                  placeholder="+1 809-000-0000"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Agregar productos */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Agregar productos</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand bg-white"
                >
                  <option value="">Selecciona un producto...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${Number(p.price).toFixed(2)}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-20 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button
                    onClick={addItem}
                    disabled={!selectedProduct}
                    className="px-4 py-2 rounded-md gradient-brand text-white text-sm font-semibold hover:brightness-110 disabled:opacity-40 transition"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Items actuales */}
            {form.items.length > 0 && (
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-800">
                      {item.name} <span className="text-gray-400">× {item.qty}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Quitar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Imágenes de portada */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Imágenes de portada</p>
              <p className="text-xs text-gray-500 mb-3">
                Se usan de fondo en relieve. Se agregan automáticamente las de tus productos; también puedes subir imágenes.
              </p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              <div className="flex flex-wrap gap-2">
                {coverImages.map((url) => (
                  <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={url} alt="Portada" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeCover(url)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Quitar"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="inline-block w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Envío ($)</label>
                <input
                  type="number"
                  min="0"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descuento ($)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea
                rows="2"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Condiciones, validez, observaciones..."
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand bg-white"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
                <option value="converted">Convertida en venta</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-3 rounded-xl gradient-brand text-white font-semibold hover:brightness-110 disabled:opacity-50 transition shadow-md shadow-brand/20"
              >
                {saving ? 'Guardando...' : 'Guardar y previsualizar'}
              </button>
            </div>
          </div>
        </div>

        {/* Listado de cotizaciones */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cotizaciones creadas</h2>
          {quotes.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">
              Aún no has creado cotizaciones.
            </p>
          ) : (
            <ul className="space-y-3">
              {quotes.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                        {q.quotation_code}
                      </span>
                      <span className="font-medium text-gray-900">{q.customer_name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${Number(q.total || 0).toFixed(2)} · {new Date(q.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openPreview(q)}
                      className="px-3 py-1.5 rounded-md text-sm text-brand-dark font-medium hover:bg-brand/10 transition"
                    >
                      Vista
                    </button>
                    {admin && (
                      <button
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta cotización?')) {
                            deleteQuotation(q.id).then(() => setQuotes((qs) => qs.filter((x) => x.id !== q.id)))
                          }
                        }}
                        className="px-2 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Vista previa */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl mt-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Vista previa</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={printQuote}
                  className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-semibold hover:brightness-110 transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir / Guardar PDF
                </button>
                <button
                  onClick={() => setPreviewQuote(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                  title="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-6">
              <QuoteDocument
                quote={previewQuote}
                sellerName={mySeller?.name}
                coverIndex={coverIndex}
                onCover={handleCover}
              />
            </div>
          </div>
        </div>
      )}

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quote-print-area, #quote-print-area * { visibility: visible; }
          #quote-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          #quote-print-area { box-shadow: none !important; }
          #quote-print-area { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}