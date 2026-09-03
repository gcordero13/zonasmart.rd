import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchSellerByUser, getSellerStats } from '../../services/sellers'

export default function SellerPortal() {
  const { user, loading: authLoading } = useAuth()
  const [seller, setSeller] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const mySeller = await fetchSellerByUser(user.id)
        if (!mounted) return
        setSeller(mySeller)
        if (mySeller) {
          const s = await getSellerStats(mySeller.id)
          if (mounted) setStats(s)
        }
      } catch (e) {
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (user) load()
    else setLoading(false)
    return () => {
      mounted = false
    }
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-500">Cargando tu portal...</div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal de vendedor</h1>
        <p className="text-gray-500 mb-6">Inicia sesión para ver tus ganancias y comisiones.</p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-dark text-white font-semibold transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Aún no eres vendedor</h1>
        <p className="text-gray-500 mb-6">
          Esta cuenta no está registrada como vendedor. Si quieres vender y ganar comisiones por tus
          referidos, contacta al administrador o revisa tu estado en el panel.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-dark text-white font-semibold transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  const statusLabel = { pending: 'Pendiente de aprobación', active: 'Activo', suspended: 'Suspendido' }
  const statusColor = {
    pending: 'bg-amber-100 text-amber-700',
    active: 'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hola, {seller.name || 'vendedor'}</h1>
        <p className="text-gray-500 mt-1">
          Este es tu panel de ganancias como vendedor. Tu código de referido es{' '}
          <span className="font-mono text-brand-dark">{seller.referrer_code}</span>
        </p>
        <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${statusColor[seller.status]}`}>
          {statusLabel[seller.status]}
        </span>
      </header>

      {seller.status === 'suspended' && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
          Tu cuenta de vendedor está suspendida. Contacta al administrador para más información.
        </div>
      )}

      {stats && (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Ganancias acumuladas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalEarned.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Pendientes por cobrar</p>
              <p className="text-3xl font-bold text-brand-dark mt-1">${stats.pendingAmount.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Ya cobradas</p>
              <p className="text-3xl font-bold text-green-600 mt-1">${stats.paidAmount.toFixed(2)}</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Mis comisiones</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-left">
                    <th className="px-6 py-3 font-medium">Pedido</th>
                    <th className="px-6 py-3 font-medium">Venta</th>
                    <th className="px-6 py-3 font-medium">Comisión</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.commissions.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-xs text-gray-600">
                        {c.orders?.tracking_code || '—'}
                      </td>
                      <td className="px-6 py-3">${(c.order_total || 0).toFixed(2)}</td>
                      <td className="px-6 py-3 font-semibold text-brand-dark">${c.amount.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand-dark">
                          {c.status === 'paid' ? 'Cobrada' : c.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {stats.commissions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                        Todavía no tienes comisiones. Comparte tu enlace de referido para empezar a ganar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 bg-gradient-to-br from-brand to-brand-dark text-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-1">Comparte tu enlace de referido</h2>
            <p className="text-white/90 text-sm mb-3">
              Ganas una comisión del {seller.commission_rate}% por cada compra hecha con tu código.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="px-4 py-2.5 rounded-lg bg-white/15 font-mono text-sm break-all">
                {window.location.origin}/?ref={seller.referrer_code}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/?ref=${seller.referrer_code}`)}
                className="px-4 py-2.5 rounded-lg bg-white text-brand-dark font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Copiar enlace
              </button>
            </div>
          </section>
        </>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-xl border border-amber-300 bg-amber-50 text-sm text-amber-900">
          {error}
        </div>
      )}
    </div>
  )
}