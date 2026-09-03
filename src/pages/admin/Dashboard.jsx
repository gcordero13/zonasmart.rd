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
    invested: 0,
    potentialProfit: 0,
    lostStockValue: 0,
    lowStockCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [products, orders] = await Promise.all([fetchProducts(), fetchOrders()])
        const revenue = orders
          .filter((o) => o.status === 'paid' || o.status === 'completed')
          .reduce((acc, o) => acc + Number(o.total || 0), 0)
        const invested = products.reduce(
          (acc, p) => acc + Number(p.stock || 0) * (Number(p.cost_per_unit || 0) + Number(p.additional_expenses || 0)),
          0
        )
        const potentialProfit = products.reduce(
          (acc, p) =>
            acc +
            Number(p.stock || 0) *
              (Number(p.price) - Number(p.cost_per_unit || 0) - Number(p.additional_expenses || 0)),
          0
        )
        const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= (p.low_stock_threshold ?? 5)).length
        const lostStockValue = products
          .filter((p) => p.stock <= 0)
          .reduce((acc, p) => acc + Number(p.cost_per_unit || 0), 0)
        setStats({
          products: products.length,
          totalStock: products.reduce((acc, p) => acc + Number(p.stock || 0), 0),
          orders: orders.length,
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          revenue,
          invested,
          potentialProfit,
          lowStockCount,
          lostStockValue,
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

  const warehouseCards = [
    { label: 'Invertido en almacén', value: `$${stats.invested.toFixed(2)}`, color: 'text-gray-800' },
    { label: 'Ganancia potencial al vender todo', value: `$${stats.potentialProfit.toFixed(2)}`, color: 'text-green-600' },
    {
      label: 'Almacén en valor (invertido + ganancia)',
      value: `$${(stats.invested + stats.potentialProfit).toFixed(2)}`,
      color: 'text-brand-dark',
    },
    {
      label: 'Productos con stock bajo',
      value: stats.lowStockCount,
      color: stats.lowStockCount > 0 ? 'text-amber-600' : 'text-gray-500',
    },
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

      <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Almacén e inventario</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {warehouseCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {stats.lowStockCount > 0 && (
        <div className="mt-4 p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800">
          <span className="font-semibold">Alerta de stock:</span>{' '}
          {stats.lowStockCount} producto(s) están por debajo del mínimo. Revisa la sección Productos.
        </div>
      )}
    </div>
  )
}