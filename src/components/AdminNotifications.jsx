import { useEffect, useState } from 'react'
import { subscribeToOrders } from '../services/orders'

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState([])
  const [open, setOpen] = useState(false)

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
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2 rounded-lg text-gray-400 hover:text-gray-700 transition-colors ${open ? 'bg-gray-100' : ''}`}
        title="Notificaciones"
      >
        <svg className={`w-6 h-6 ${alerts.length > 0 ? 'animate-soft-pulse' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-scale-in">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">Notificaciones</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600" title="Cerrar">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
            {alerts.length === 0 && (
              <li className="p-6 text-center text-sm text-gray-400">Sin notificaciones nuevas.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}