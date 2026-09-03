import { useEffect, useState } from 'react'
import { fetchActiveServices } from '../services/services'
import Reveal from './Reveal'
import ServiceQuoteModal from './ServiceQuoteModal'

const iconPath = (icon) => {
  const map = {
    wrench: 'M10.34 3.66a3 3 0 014.32 0l1.4 1.4a3 3 0 010 4.24 3 3 0 010 4.24 3 3 0 010 4.24L13.31 16m-4.24-9.66a3 3 0 00-4.24 4.24l.7.7a2 2 0 01-1.41 3.4H3.5a2 2 0 00-1.41 3.4L4 20.6',
    shield: 'M9 12.75L11.25 15 15 9.75M21 12c0 5.4-3.7 7.5-9 10-5.3-2.5-9-4.6-9-10V5.3l9-3.3 9 3.3V12z',
    truck: 'M12 6H3v12h2M12 6h5l4 4v8h-2M9 8h5a2 2 0 012 2v6H6M9 19a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
    support: 'M18.36 6.64A9 9 0 115.64 17.36 9 9 0 0118.36 6.64zM12 8a3 3 0 00-3 3h2a1 1 0 012 0c0 1-.5 1.5-1 2.5V15h2v-.5c1-.5 1.5-1.5 1.5-2.5A3 3 0 0012 8zm-1 8h2v2h-2z',
    star: 'M11.48 3.5l1.9 3.85 4.25.62-3.07 3 .73 4.24-3.81-2L8.17 15.2l.73-4.23-3.07-3 4.25-.62L11.48 3.5z',
    home: 'M3 10.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z',
    lock: 'M12 3a4 4 0 00-4 4v4H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 00-4-4zm-2 4a2 2 0 114 0v4h-4V7z',
    phone: 'M3 5.5C3 4.1 4.1 3 5.5 3h2.1l1.6 3.5-2 1.5a12 12 0 005.8 5.8l1.5-2L17.4 13v2.1c0 1.4-1.1 2.5-2.5 2.5C9.6 17.6 3.4 11.4 3 5.5z',
  }
  return map[icon] || map.wrench
}

export default function ServicesSection() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [quoteService, setQuoteService] = useState(null)

  useEffect(() => {
    fetchActiveServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading || services.length === 0) return null

  return (
    <section className="bg-white border-y border-gray-100 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="inline-block gradient-brand text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Servicios
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Nuestros servicios</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Más que productos: soluciones completas de instalación, soporte y garantía para tu hogar
            y tu negocio.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 4) * 80} variant="reveal-zoom">
              <div
                className="group trust-card rounded-2xl p-6 h-full flex flex-col cursor-pointer"
                onClick={() => setQuoteService(s)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setQuoteService(s)}
              >
                <div className="w-14 h-14 gradient-brand text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-brand/20">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath(s.icon)} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-1 leading-relaxed">{s.description}</p>
                {Number(s.price) > 0 && (
                  <p className="text-brand-dark font-bold text-lg">${Number(s.price).toFixed(2)}</p>
                )}
                <p className="mt-2 text-xs font-semibold text-brand-dark group-hover:underline">
                  Cotizar este servicio →
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      {quoteService && <ServiceQuoteModal service={quoteService} onClose={() => setQuoteService(null)} />}
    </section>
  )
}