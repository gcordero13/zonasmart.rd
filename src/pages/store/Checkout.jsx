import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder, generateTrackingCode } from '../../services/orders'
import { resolveSellerByCode, recordCommission } from '../../services/sellers'
import { decrementProductStock } from '../../services/products'
import { estimateLocation } from '../../services/geo'

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)
  const [locInfo, setLocInfo] = useState(null)
  const [refCode, setRefCode] = useState(() => localStorage.getItem('zs_ref') || '')
  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
  })

  const detectLocation = async () => {
    setLocating(true)
    setError(null)
    try {
      const loc = await estimateLocation()
      setLocInfo(loc)
      setForm((f) => ({ ...f, city: loc.city || f.city }))
    } catch (e) {
      setError(e.message)
    } finally {
      setLocating(false)
    }
  }

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      localStorage.setItem('zs_ref', ref.trim().toUpperCase())
      setRefCode(ref.trim().toUpperCase())
    }
  }, [searchParams])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const zoneShipping = (item) => {
  const zones = item.shipping_zones || {}
  const cityKey = (form.city || '').trim().toLowerCase()
  if (cityKey && zones) {
    const matched = Object.keys(zones).find((k) => k.toLowerCase() === cityKey)
    if (matched !== undefined) return Number(zones[matched])
  }
  return Number(item.shipping_price || 0)
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Debes iniciar sesión para completar la compra.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const shipping = items.reduce((acc, i) => acc + zoneShipping(i) * i.quantity, 0)
      const order = {
        user_id: user.id,
        email: form.email,
        customer_name: form.name,
        tracking_code: generateTrackingCode(),
        address: form.address,
        city: form.city,
        zip: form.zip,
        items: items.map(({ id, name, price, quantity, image_url, delivery_days, shipping_price }) => ({
          id,
          name,
          price,
          quantity,
          image_url,
          delivery_days,
          shipping_price: Number(shipping_price || 0),
        })),
        subtotal: totalPrice,
        shipping,
        total: totalPrice + shipping,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const created = await createOrder(order)

      for (const item of items) {
        await decrementProductStock(item.id, item.quantity).catch(() => null)
      }

      if (refCode) {
        const seller = await resolveSellerByCode(refCode).catch(() => null)
        if (seller && seller.id !== user.id && seller.seller_id !== user.id) {
          const amount = order.total * (seller.commission_rate / 100)
          await recordCommission({
            order_id: created.id,
            seller_id: seller.id,
            amount: Number(amount.toFixed(2)),
            order_total: order.total,
          }).catch(() => null)
        }
      }

      clearCart()
      navigate('/confirmacion', { state: { trackingCode: created.tracking_code } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No hay productos para pagar</h1>
        <Link
          to="/tienda"
          className="inline-block px-8 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  const shipping = items.reduce((acc, i) => acc + zoneShipping(i) * i.quantity, 0)
  const grandTotal = totalPrice + shipping

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 mb-4">Datos de envío</h2>
        <button
          type="button"
          onClick={detectLocation}
          disabled={locating}
          className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-md border border-brand/40 text-sm font-medium text-brand-dark hover:bg-brand/10 disabled:opacity-50 transition-colors"
        >
          {locating ? (
            <span className="inline-block w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9 0 6.21-7.03 10.35-8.5 11-.37.16-.63.49-.63.87 0 .36.28.63.63.63H6a2 2 0 01-2-2V5a2 2 0 012-2h6zm4 7H8m8 0H8" />
            </svg>
          )}
          {locating ? 'Detectando ubicación...' : 'Detectar mi ubicación'}
        </button>
        {locInfo && form.city && (
          <p className="text-xs text-gray-500 mb-4">
            Ubicación detectada: {locInfo.city || '—'}
            {locInfo.province ? `, ${locInfo.province}` : ''}. Puedes editarla abajo.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={!!user}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Envío</span>
            <span className="font-medium">
              {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Gratis'}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código de referido (opcional)
          </label>
          <input
            type="text"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.trim().toUpperCase())}
            placeholder="Ej. ZS-1234"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand uppercase"
          />
          <p className="mt-1 text-xs text-gray-400">
            Aplicado automáticamente desde tu link de referido si vienes de un vendedor.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Procesando...' : 'Pagar ahora'}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Nota: la pasarela de pagos (Stripe/PayPal) se integra en el siguiente paso. Por ahora se
          registra el pedido como &quot;pendiente de pago&quot;.
        </p>
      </form>
    </div>
  )
}