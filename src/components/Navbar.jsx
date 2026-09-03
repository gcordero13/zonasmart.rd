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
    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-amber-400' : 'text-gray-300 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50">
      {/* Barra de promoción */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white text-center text-sm font-medium py-1.5 px-4">
        🚚 Envíos a todo el país · Pago seguro · ¡Ofertas de lanzamiento!
      </div>

      <nav className="bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                <span className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg">
                  Z
                </span>
                <span className="text-white">
                  Zona<span className="text-amber-400">Smart</span>
                </span>
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

            <div className="flex items-center gap-3">
              <Link
                to="/carrito"
                className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <span className="text-2xl">🛒</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/mis-pedidos"
                    className="hidden sm:block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    Mis pedidos
                  </Link>
                  <Link
                    to="/admin"
                    className="hidden sm:block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    Panel
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors shadow-md"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors shadow-md"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}