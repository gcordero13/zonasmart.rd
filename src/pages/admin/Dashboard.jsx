import { useEffect, useState } from 'react'
import { fetchProducts } from '../../services/products'
import { fetchOrders } from '../../services/orders'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    totalStock: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [products, orders] = await Promise.all([fetchProducts(), fetchOrders()])
        const revenue = orders
          .filter((o) => o.status === 'paid' || o.status === 'completed')
          .reduce((acc, o) => acc + Number(o.total || 0), 0)
        setStats({
          products: products.length,
          totalStock: products.reduce((acc, p) => acc + Number(p.stock || 0), 0),
          orders: orders.length,
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          revenue,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Productos', value: stats.products, color: 'text-blue-600' },
    { label: 'Unidades en stock', value: stats.totalStock, color: 'text-green-600' },
    { label: 'Pedidos', value: stats.orders, color: 'text-indigo-600' },
    { label: 'Pedidos pendientes', value: stats.pendingOrders, color: 'text-orange-600' },
    { label: 'Ingresos', value: `$${stats.revenue.toFixed(2)}`, color: 'text-emerald-600' },
  ]

  if (loading) return <p className="text-gray-500">Cargando panel...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}