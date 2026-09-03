import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'

export default function Footer() {
  const { user } = useAuth()
  const { settings } = useStore()

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="gradient-brand text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-md">
                Z
              </span>
              <span className="font-bold text-white text-xl">{settings.store_name}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Tecnología inteligente para tu hogar y tu negocio. Cerraduras, cámaras de seguridad y
              dispositivos de última generación con instalación y soporte profesional.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-gray-300 font-medium">
              <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Compra 100% segura
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tienda</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/tienda" className="hover:text-brand transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link to="/seguimiento" className="hover:text-brand transition-colors">
                  Seguimiento de pedido
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/mis-pedidos" className="hover:text-brand transition-colors">
                    Mis pedidos
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link to="/portal-vendedor" className="hover:text-brand transition-colors">
                    Portal de vendedor
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Servicios</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="cursor-default flex items-center gap-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 3.66a3 3 0 014.32 0l1.4 1.4a3 3 0 010 4.24l-1.4 1.4.7-.7" />
                </svg>
                Instalación profesional
              </li>
              <li className="cursor-default flex items-center gap-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.36 6.64A9 9 0 115.64 17.36 9 9 0 0118.36 6.64zM12 8a3 3 0 00-3 3h2a1 1 0 012 0c0 1-.5 1.5-1 2.5V15h2v-.5" />
                </svg>
                Soporte y reparación
              </li>
              <li className="cursor-default flex items-center gap-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Garantía extendida
              </li>
              <li className="cursor-default flex items-center gap-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375" />
                </svg>
                Atención 24/7
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.69l1.1 3.31a1 1 0 01-.59 1.25l-1.46.58a11.04 11.04 0 005.88 5.88l.58-1.46a1 1 0 011.25-.59l3.31 1.1a1 1 0 01.69.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                </svg>
                <a href={`tel:${settings.whatsapp}`} className="hover:text-brand transition-colors">
                  {settings.whatsapp ? settings.whatsapp : '+1 809-000-0000'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${settings.email}`} className="hover:text-brand transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.66 16.66A8 8 0 116.34 7.5a8 8 0 0111.32 9.16zM12 21v-5" />
                </svg>
                {settings.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} {settings.store_name}. Todos los derechos reservados.
            </p>
            <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Pago seguro · Garantía · Soporte
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}