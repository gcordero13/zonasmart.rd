import { useEffect, useState } from 'react'
import { fetchOrders, updateOrderStatus } from '../../services/orders'

const statusColors = {
  pending: 'bg-orange-100 text-orange-700',
  paid: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    fetchOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedidos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-500">Cargando pedidos...</p>}

      {!loading && orders.length === 0 && <p className="text-gray-500">No hay pedidos.</p>}

      {!loading && orders.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
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