import { useEffect, useState } from 'react'
import { subscribeToOrders } from '../services/orders'

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const subscription = subscribeToOrders((order) => {
      const msg = {
        id: order.id,
        title: 'Nuevo pedido',
        text: `${order.customer_name || 'Cliente'} · ${order.tracking_code} · $${Number(order.total).toFixed(2)}`,
        time: new Date().toLocaleTimeString(),
      }
      setAlerts((prev) => [msg, ...prev].slice(0, 20))
    })
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const dismiss = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id))

  return (
    <div className="relative">
      <span className="inline-block relative p-2 text-gray-400 hover:text-white" title="Notificaciones">
        🔔
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </span>

      {alerts.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100 font-semibold text-gray-900 text-sm">
            Nuevas notificaciones
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {alerts.map((alert) => (
              <li key={alert.id} className="p-3 border-b border-gray-50 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600">{alert.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="text-gray-400 hover:text-gray-600 text-xs ml-2"
                    title="Descartar"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}