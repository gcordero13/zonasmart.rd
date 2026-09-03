import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                Z
              </span>
              <span className="font-bold text-white text-lg">ZonaSmart</span>
            </div>
            <p className="text-sm leading-relaxed">
              Tecnología inteligente para tu hogar. Cerraduras, cámaras de seguridad y dispositivos
              para hacer tu vida más simple y segura.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Tienda</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tienda" className="hover:text-amber-400 transition-colors">Todos los productos</Link></li>
              <li><Link to="/seguimiento" className="hover:text-amber-400 transition-colors">Seguimiento de pedido</Link></li>
              {user && <li><Link to="/mis-pedidos" className="hover:text-amber-400 transition-colors">Mis pedidos</Link></li>}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/seguimiento" className="hover:text-amber-400 transition-colors">¿Dónde está mi pedido?</Link></li>
              <li><span className="cursor-default">Envíos y entregas</span></li>
              <li><span className="cursor-default">Garantía y devoluciones</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>📱 WhatsApp: +1 809-000-0000</li>
              <li>📧 ventas@zonasmart.rd</li>
              <li>📍 República Dominicana</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} ZonaSmart. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-3 text-2xl" aria-hidden="true">
              <span className="opacity-80" title="Visa">💳</span>
              <span className="opacity-80" title="Mastercard">💳</span>
              <span className="opacity-80" title="PayPal">🅿️</span>
              <span className="opacity-80" title="Transferencia">🏦</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}