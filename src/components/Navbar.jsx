import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { signOut } from '../services/auth'

export default function Navbar() {
  const { user } = useAuth()
  const { totalItems } = useCart()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message)
    }
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-amber-400' : 'text-gray-300 hover:text-white'
    }`

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-white">
              Zona<span className="text-amber-400">Smart</span>
            </Link>
<div className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={linkClass} end>
                Inicio
              </NavLink>
              <NavLink to="/tienda" className={linkClass}>
                Tienda
              </NavLink>
              <NavLink to="/seguimiento" className={linkClass}>
                Seguimiento
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/carrito" className="relative text-gray-300 hover:text-white">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/mis-pedidos"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Mis pedidos
                </Link>
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Panel
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
