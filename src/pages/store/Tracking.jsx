import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trackOrderByCode } from '../../services/orders'
import TrackingStatus from '../../components/TrackingStatus'

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)
    try {
      const found = await trackOrderByCode(trackingCode.trim().toUpperCase(), email.trim())
      if (!found) {
        setError('No encontramos un pedido con ese código y email. Verifícalos e intenta de nuevo.')
      } else {
        setOrder(found)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Seguimiento de pedido</h1>
      <p className="text-gray-600 mb-8">
        Ingresa tu código de seguimiento (formato ZS-XXXXXXXX) y el email con el que compraste.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de seguimiento
            </label>
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              placeholder="ZS-XXXXXXXX"
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full px-6 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar mi pedido'}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Código</p>
              <p className="font-bold text-gray-900 tracking-wider">{order.tracking_code}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
            </div>
          </div>

          <TrackingStatus status={order.status} />

          <div className="mt-6 border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Productos</h3>
            <ul className="divide-y divide-gray-100">
              {(order.items || []).map((item, i) => (
                <li key={i} className="py-2 flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Última actualización:{' '}
            {order.updated_at ? new Date(order.updated_at).toLocaleString() : '—'}
          </p>
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          ¿Compraste con una cuenta?{' '}
          <Link to="/mis-pedidos" className="text-amber-600 hover:text-amber-700 font-medium">
            Revisa tus pedidos aquí
          </Link>
        </p>
      </div>
    </div>
  )
}