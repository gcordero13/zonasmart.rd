import { NavLink, Outlet, Link } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/clientes', label: 'Clientes' },
]

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-500 text-white'
        : 'text-gray-300 hover:text-white hover:bg-gray-800'
    }`

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link to="/" className="text-lg font-bold text-white">
            Zona<span className="text-amber-400">Smart</span>
            <span className="block text-xs text-gray-400 mt-1">Panel de administración</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}