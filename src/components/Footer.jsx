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
                {settings.whatsapp ? (
                  <a href={`tel:${settings.whatsapp}`} className="hover:text-brand transition-colors">
                    {settings.whatsapp}
                  </a>
                ) : (
                  <span>Disponible por WhatsApp</span>
                )}
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-sm">
              © {new Date().getFullYear()} {settings.store_name}. Todos los derechos reservados.
            </p>
            <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Pago seguro · Garantía · Soporte 24/7
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 mr-1">Pagamos con:</span>
              {[
                ['Visa', 'M3 6l2 12h3l2-12H9.5l-.8 5h-2.4l-.8-5H3zM17 6c-2 0-3.5 1.4-3.5 3.3C13.5 12 17 13.5 17 15c0 .6-.5 1.2-1.3 1.2-.6 0-1.1-.3-1.4-.7l-.8 1.1c.6.7 1.4 1 2.3 1 2.1 0 3.7-1.4 3.7-3.4 0-1.9-3.5-3.2-3.5-4.4 0-.5.4-.9 1-.9.5 0 1 .2 1.4.6l.7-1.1C18.4 6.4 17.6 6 17 6z'],
                ['Mastercard', 'M12 7.5A4.5 4.5 0 1012 16.5 4.5 4.5 0 0012 7.5zm0 7.5a3 3 0 110-6 3 3 0 010 6zM21 10.5a7.5 7.5 0 01-7.5 7.5h-3L9 20.5V18a7.5 7.5 0 1112-7.5z'],
                ['PayPal', 'M7 3h7a4 4 0 014 4c0 .1 0 .2-.01.3A4.8 4.8 0 0113.5 12H11.6l-.7 6H8l.8-7H6.5L7 3z'],
                ['Apple Pay', 'M4.5 2.5H19.5a2 2 0 012 2v15a2 2 0 01-2 2H4.5a2 2 0 01-2-2v-15a2 2 0 012-2zM8 8 6.5 14h1l1-5H8zm2.5 0-.8 6h.9l.7-6h-.8zm3.5 2.4c.5.7.7 1.2.8 1.6h-.3A3.6 3.6 0 0014 10a4 4 0 00-.5.4z'],
              ].map(([name]) => (
                <span
                  key={name}
                  title={name}
                  className="px-2.5 py-1 rounded-md bg-white/5 border border-gray-700 text-[11px] font-semibold text-gray-300"
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacidad" className="hover:text-brand transition-colors">Privacidad</Link>
              <Link to="/terminos" className="hover:text-brand transition-colors">Términos</Link>
              <Link to="/devoluciones" className="hover:text-brand transition-colors">Devoluciones</Link>
              <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-brand transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9c0-.9.3-1.5 1.6-1.5H16.7V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.5v7h3z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-brand transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
                </a>
                <a href="#" aria-label="WhatsApp" className="text-gray-400 hover:text-brand transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.6 12.8c-.2.5-1.1 1-1.6 1s-.9.2-3-.6c-1.7-.7-2.9-1.9-3.8-3.5-.6-.9-.6-1.4-.7-1.8-.1-.5 0-1 .2-1.4.2-.3.4-.5.6-.6l.5-.5c.2-.2.3-.2.4-.2h.5c.1 0 .3.1.7 1.1.1.2.2.4 0 .6-.1.2-.4.6-.5.7-.1.2-.2.3-.1.5.4.7.9 1.3 1.4 1.7.4.3.7.5 1.1.7.1.1.3-.1.5-.3l.7-.9c.2-.2.3-.3.5-.2s1.3.6 1.5.7c.2.1.4.2.4.3.1.1.1.4-.1.9z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}