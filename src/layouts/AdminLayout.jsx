import { NavLink, Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import AdminNotifications from '../components/AdminNotifications'

const navItems = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/vendedores', label: 'Vendedores' },
  { to: '/admin/resenas', label: 'Reseñas' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/configuracion', label: 'Configuración' },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-brand text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
    }`

  const sidebar = (
    <>
      <div className="p-4 border-b border-gray-800">
        <Link to="/" className="text-lg font-bold text-white">
          Zona<span className="text-brand">Smart</span>
          <span className="block text-xs text-gray-400 mt-1">Panel de administración</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} end={item.end} onClick={() => setOpen(false)}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          ← Volver a la tienda
        </Link>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="hidden lg:flex w-64 bg-gray-900 flex-col shrink-0">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-gray-900 flex flex-col">{sidebar}</aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        <div className="flex items-center gap-3 px-3 sm:px-5 py-2 bg-white border-b border-gray-200">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-gray-700 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <AdminNotifications />
        </div>
        <div className="p-4 sm:p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}