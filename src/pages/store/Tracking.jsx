import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { trackOrderByCode, fetchOrdersByUser } from '../../services/orders'
import TrackingStatus from '../../components/TrackingStatus'
import OrderItems from '../../components/OrderItems'

export default function Tracking() {
  const { user } = useAuth()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Seguimiento de pedido</h1>
      {user ? <LoggedOrders user={user} /> : <GuestTracking />}
    </div>
  )
}

function LoggedOrders({ user }) {
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoadingOrders(true)
    fetchOrdersByUser(user.id)
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingOrders(false))
  }, [user])

  return (
    <>
      <p className="text-gray-600 mb-6">
        Revisa el estado de tus pedidos directamente, sin necesidad de código.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {loadingOrders && <p className="text-gray-500">Cargando tus pedidos...</p>}

      {!loadingOrders && orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Aún no tienes pedidos.</p>
          <Link
            to="/tienda"
            className="inline-block px-6 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition-colors"
          >
            Comprar ahora
          </Link>
        </div>
      )}

      {!loadingOrders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          ¿Quieres seguir un pedido por código?{' '}
          <Link to="/login" className="text-brand hover:text-brand-dark font-medium">
            Cierra tu sesión para usar el formulario
          </Link>
        </p>
      </div>
    </>
  )
}

function GuestTracking() {
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
    <>
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
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand uppercase"
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
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full px-6 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark disabled:opacity-50 transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar mi pedido'}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {order && <OrderCard order={order} />}

      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          ¿Compraste con una cuenta?{' '}
          <Link to="/mis-pedidos" className="text-brand hover:text-brand-dark font-medium">
            Revisa tus pedidos aquí
          </Link>
        </p>
      </div>
    </>
  )
}

function OrderCard({ order }) {
  return (
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

      <OrderItems items={order.items} />

      <p className="mt-4 text-sm text-gray-500">
        Última actualización:{' '}
        {order.updated_at ? new Date(order.updated_at).toLocaleString() : '—'}
      </p>
    </div>
  )
}