import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchOrdersByUser } from '../../services/orders'
import TrackingStatus from '../../components/TrackingStatus'
import OrderItems from '../../components/OrderItems'

export default function MyOrders() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoadingOrders(true)
    fetchOrdersByUser(user.id)
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingOrders(false))
  }, [user])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h1>

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
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Código</p>
                  <p className="font-bold text-gray-900 tracking-wider">{order.tracking_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                </div>
              </div>

              <TrackingStatus status={order.status} />

              <OrderItems items={order.items} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}