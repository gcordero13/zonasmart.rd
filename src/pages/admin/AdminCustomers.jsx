import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
        if (error) throw error
        setCustomers(data || [])
      } catch (e) {
        setError(
          e.message.includes('does not exist')
            ? 'La tabla "profiles" no existe en Supabase. Créala siguiendo las instrucciones del README.'
            : e.message
        )
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  if (loading) return <p className="text-gray-500">Cargando clientes...</p>

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h1>
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
          {error}
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Para listar clientes de forma segura (sin exponer la clave secreta del servidor), se
          recomienda crear la tabla <code className="bg-gray-100 px-1 rounded">profiles</code> en
          Supabase. El README incluye el SQL necesario.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h1>

      {customers.length === 0 ? (
        <p className="text-gray-500">No hay clientes registrados.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Registrado</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Última actualización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(c.updated_at).toLocaleDateString()}
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