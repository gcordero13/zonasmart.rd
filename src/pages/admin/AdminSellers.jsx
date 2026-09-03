import { useEffect, useState } from 'react'
import {
  fetchSellers,
  updateSeller,
  approveSeller,
  suspendSeller,
  createSeller,
  fetchAllCommissions,
  markCommissionPaid,
  markCommissionRejected,
  generateReferrerCode,
} from '../../services/sellers'
import { sendSellerWelcome } from '../../services/emails'
import { useStore } from '../../context/StoreContext'

export default function AdminSellers() {
  const { settings } = useStore()
  const [sellers, setSellers] = useState([])
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('vendedores')
  const [errors, setErrors] = useState({})
  const [loadError, setLoadError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', name: '', commission_rate: 10 })

  const load = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const [s, c] = await Promise.all([fetchSellers(), fetchAllCommissions()])
      setSellers(s)
      setCommissions(c)
    } catch (e) {
      console.error('Error cargando vendedores:', e)
      setLoadError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpdate = async (id, updates) => {
    try {
      await updateSeller(id, updates)
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.email) err.email = 'El email es obligatorio'
    if (!form.commission_rate || form.commission_rate <= 0) err.commission_rate = 'El % debe ser mayor a 0'
    setErrors(err)
    if (Object.keys(err).length) return
    try {
      const code = generateReferrerCode()
      await createSeller({
        name: form.name,
        email: form.email,
        commission_rate: Number(form.commission_rate),
        referrer_code: code,
      })
      if (form.email) {
        sendSellerWelcome({
          to: form.email,
          name: form.name,
          referrerCode: code,
          storeName: settings.store_name,
        }).catch(() => null)
      }
      setShowForm(false)
      setForm({ email: '', name: '', commission_rate: 10 })
      setErrors({})
      await load()
    } catch (err2) {
      const msg = err2.message || 'No se pudo crear el vendedor.'
      if (msg.toLowerCase().includes('does not exist') || msg.toLowerCase().includes('relation') || msg.toLowerCase().includes('not found')) {
        setErrors({
          general:
            'Falta la tabla "sellers" en Supabase. Ejecuta el script supabase-migration-sellers.sql en el SQL Editor antes de crear vendedores.',
        })
      } else {
        setErrors({ general: msg })
      }
    }
  }

  const totals = commissions.reduce(
    (acc, c) => {
      if (c.status === 'paid') acc.paid += c.amount
      else if (c.status === 'pending') acc.pending += c.amount
      acc.total += c.amount
      return acc
    },
    { paid: 0, pending: 0, total: 0 }
  )

  const statusBadge = (s) => {
    const map = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-brand/10 text-brand-dark',
      suspended: 'bg-red-100 text-red-700',
    }
    const labels = { active: 'Activo', pending: 'Pendiente', suspended: 'Suspendido' }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[s] || 'bg-gray-100 text-gray-600'}`}>
        {labels[s] || s}
      </span>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendedores y comisiones</h1>
          <p className="text-sm text-gray-500">Gestiona vendedores, su % de comisión y los pagos.</p>
        </div>
        {tab === 'vendedores' && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Nuevo vendedor'}
          </button>
        )}
      </div>

      {loadError && (
        <div className="mb-6 p-4 rounded-xl border border-amber-300 bg-amber-50 text-sm text-amber-900 animate-scale-in">
          <p className="font-semibold mb-1 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            No se pudieron cargar los vendedores
          </p>
          <p>{loadError}</p>
          <p className="mt-2 text-xs">
            Si el error menciona que la tabla <code className="font-mono">sellers</code> o{' '}
            <code className="font-mono">commissions</code> no existe, ejecuta el script{' '}
            <code className="font-mono">supabase-migration-sellers.sql</code> en el SQL Editor de Supabase.
          </p>
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('vendedores')}
          className={`pb-2 px-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'vendedores' ? 'border-brand text-brand-dark' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Vendedores
        </button>
        <button
          onClick={() => setTab('comisiones')}
          className={`pb-2 px-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'comisiones' ? 'border-brand text-brand-dark' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Comisiones
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre del vendedor"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@vendedor.com"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">% de comisión por venta</label>
            <input
              type="number"
              min="1"
              max="100"
              value={form.commission_rate}
              onChange={(e) => setForm({ ...form, commission_rate: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.commission_rate && <p className="text-xs text-red-600 mt-1">{errors.commission_rate}</p>}
            {errors.general && <p className="text-xs text-red-600 mt-1">{errors.general}</p>}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark">
              Crear vendedor
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm bg-white rounded-xl shadow-sm p-10 text-center">Cargando...</div>
      ) : tab === 'vendedores' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left">
                  <th className="px-4 py-3 font-medium">Vendedor</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Código</th>
                  <th className="px-4 py-3 font-medium">%</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sellers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name || 'Sin nombre'}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{s.referrer_code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={s.commission_rate}
                        onChange={(e) => handleUpdate(s.id, { commission_rate: Number(e.target.value) })}
                        className="w-16 px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <span className="text-gray-500">%</span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(s.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {s.status !== 'active' && (
                        <button
                          onClick={() => approveSeller(s.id, s.commission_rate).then(load)}
                          className="text-green-600 hover:text-green-700 font-medium mr-3"
                        >
                          Aprobar
                        </button>
                      )}
                      {s.status === 'active' && (
                        <button
                          onClick={() => suspendSeller(s.id).then(load)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Suspender
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {sellers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-gray-400">
                      No hay vendedores todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Comisiones acumuladas</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">${totals.total.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Pendientes por pagar</div>
              <div className="text-2xl font-bold text-brand-dark mt-1">${totals.pending.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Pagadas</div>
              <div className="text-2xl font-bold text-green-600 mt-1">${totals.paid.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-left">
                    <th className="px-4 py-3 font-medium">Vendedor</th>
                    <th className="px-4 py-3 font-medium">Pedido</th>
                    <th className="px-4 py-3 font-medium">Venta</th>
                    <th className="px-4 py-3 font-medium">Comisión</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {commissions.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{c.sellers?.name || c.sellers?.email || '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.orders?.tracking_code || '—'}</td>
                      <td className="px-4 py-3">${(c.order_total || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-brand-dark">${c.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">{statusBadge(c.status)}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {c.status === 'pending' && (
                          <>
                            <button
                              onClick={() => markCommissionPaid(c.id).then(load)}
                              className="text-green-600 hover:text-green-700 font-medium mr-3"
                            >
                              Marcar pagada
                            </button>
                            <button
                              onClick={() => markCommissionRejected(c.id).then(load)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {commissions.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-10 text-center text-gray-400">
                        No hay comisiones registradas todavía.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}