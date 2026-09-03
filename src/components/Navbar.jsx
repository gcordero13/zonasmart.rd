import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { signOut } from '../services/auth'

export default function Navbar() {
  const { user } = useAuth()
  const { totalItems } = useCart()
  const { settings } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message)
    }
  }

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-brand' : 'text-gray-300 hover:text-white'
    }`

  const mobileLink = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-brand' : 'text-gray-300 hover:text-white'
    }`

  const storeShort = settings.store_name ? settings.store_name.replace('Zona', '') : 'Smart'

  return (
    <header className="sticky top-0 z-50">
      <div className="gradient-brand gradient-animated text-white text-center text-sm font-medium py-1.5 px-4">
        Envíos a todo el país · Pago seguro · Ofertas de lanzamiento
      </div>

      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                <span className="gradient-brand text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg">
                  Z
                </span>
                <span className="text-white">
                  Zona<span className="text-brand">{storeShort}</span>
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

            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                to="/carrito"
                className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Carrito"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2m0 0L7 13h11l2-8H5.4M7 13a2 2 0 100 4 2 2 0 000-4zm9 0a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/mis-pedidos"
                    className="hidden lg:block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Mis pedidos
                  </Link>
                  <Link
                    to="/admin"
                    className="hidden lg:block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Panel
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium transition-colors shadow-md"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium transition-colors shadow-md"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 space-y-1">
            <NavLink to="/" className={mobileLink} end onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
            <NavLink to="/tienda" className={mobileLink} onClick={() => setMenuOpen(false)}>
              Tienda
            </NavLink>
            <NavLink to="/seguimiento" className={mobileLink} onClick={() => setMenuOpen(false)}>
              Seguimiento
            </NavLink>
            {user && (
              <>
                <NavLink to="/mis-pedidos" className={mobileLink} onClick={() => setMenuOpen(false)}>
                  Mis pedidos
                </NavLink>
                <NavLink to="/admin" className={mobileLink} onClick={() => setMenuOpen(false)}>
                  Panel
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium transition-colors"
                >
                  Salir
                </button>
              </>
            )}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-700 text-sm font-medium text-white"
                >
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="flex-1 text-center px-3 py-2 rounded-lg bg-brand text-white text-sm font-medium">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}