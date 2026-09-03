import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProducts } from '../../services/products'
import ProductCard from '../../components/ProductCard'
import ReviewsSection from '../../components/ReviewsSection'
import ServicesSection from '../../components/ServicesSection'
import Reveal from '../../components/Reveal'
import { useStore } from '../../context/StoreContext'

export default function Home() {
  const { settings } = useStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const featured = products.slice(0, 8)

  const trustBars = [
    {
      title: 'Pago seguro',
      desc: 'Transacciones protegidas',
      svg: (
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      ),
    },
    {
      title: 'Envío rápido',
      desc: 'A todo el país',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 8.25L18.74 5.8A2.25 2.25 0 0017.06 5H6.75A2.25 2.25 0 004.5 7.25v9.5A2.25 2.25 0 006.75 19h10.5a2.25 2.25 0 001.86-1M12 9h6l3 4m-15 3a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm9 0a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z"
        />
      ),
    },
    {
      title: 'Garantía',
      desc: 'Calidad garantizada',
      svg: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
    {
      title: 'Atención 24/7',
      desc: 'Soporte al cliente',
      svg: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      ),
    },
  ]

  const steps = [
    {
      title: 'Elige tu producto',
      desc: 'Explora el catálogo y añade al carrito',
      svg: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      ),
    },
    {
      title: 'Paga seguro',
      desc: 'Métodos de pago protegidos y sencillos',
      svg: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      ),
    },
    {
      title: 'Recíbelo en casa',
      desc: 'Envío a todo el país con seguimiento',
      svg: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.25 21.75v-2.25m0 0h7.5m-7.5 0V16.5m-6 9h16.5a1.5 1.5 0 001.5-1.5V9a1.5 1.5 0 00-1.5-1.5H6a1.5 1.5 0 00-1.5 1.5v10.5A1.5 1.5 0 006 21.75h13.5m-3-9h3m-1.5 4.5h1.5" />
      ),
    },
    {
      title: 'Disfruta y confía',
      desc: 'Calidad garantizada y soporte 24/7',
      svg: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5c1.2-1.06 2.56-1.5 3.94-1.5 1.5 0 2.92.56 3.75 1.5.87 1 1.31 2.34 1.31 3.81 0 3.13-1.5 6.06-4.06 8.44A17.7 17.7 0 0112 18.75a17.7 17.7 0 01-4.94-2.06C4.5 14.31 3 11.38 3 8.31c0-1.47.44-2.81 1.31-3.81.83-.94 2.25-1.5 3.75-1.5C9.44 3 10.8 3.44 12 4.5z" />
      ),
    },
  ]

  const servicePromises = [
    {
      title: 'Instalación profesional',
      desc: 'Técnicos certificados instalan y configuran tu producto donde lo necesites.',
      icon: (
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 3.66a3 3 0 014.32 0l1.4 1.4a3 3 0 010 4.24 3 3 0 010 4.24 3 3 0 010 4.24L13.31 16m-4.24-9.66a3 3 0 00-4.24 4.24l.7.7a2 2 0 01-1.41 3.4H3.5a2 2 0 00-1.41 3.4L4 20.6" />
        </svg>
      ),
    },
    {
      title: 'Soporte 24/7',
      desc: 'Atención real todos los días para instalación, dudas y configuración de tu equipo.',
      icon: (
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.36 6.64A9 9 0 115.64 17.36 9 9 0 0118.36 6.64zM12 8a3 3 0 00-3 3h2a1 1 0 012 0c0 1-.5 1.5-1 2.5V15h2v-.5c1-.5 1.5-1.5 1.5-2.5A3 3 0 0012 8zm-1 8h2v2h-2z" />
        </svg>
      ),
    },
    {
      title: 'Garantía respaldada',
      desc: 'Cobertura real en cada compra. Si algo falla, lo resolvemos sin complicaciones.',
      icon: (
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Envío con seguimiento',
      desc: 'Entregas a todo el país y rastreo de tu pedido en tiempo real, paso a paso.',
      icon: (
        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6H3v12h2M12 6h5l4 4v8h-2M9 8h5a2 2 0 012 2v6H6M9 19a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
    },
  ]

  const hero = {
    title: settings.hero_title || 'Tecnología que hace tu hogar inteligente',
    subtitle:
      settings.hero_subtitle ||
      'Cerraduras inteligentes, cámaras de seguridad y dispositivos de última generación. Compra con confianza y recibe tu pedido donde estés.',
  }

  const titleParts = hero.title.split('inteligente')
  const titlePrefix = titleParts[0] || hero.title

  return (
    <div>
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-brand-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand/20 rounded-full blur-3xl animate-soft-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-dark/30 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/2 w-40 h-40 bg-brand-light/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="animate-fade-in-up"
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="inline-block animate-soft-pulse bg-brand/20 text-brand-light border border-brand/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              Instalación y soporte profesional incluidos
            </motion.span>
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
              }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-6"
            >
              {titlePrefix}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-dark">
                inteligente
              </span>
            </motion.h1>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: 'easeOut' } },
              }}
              className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg"
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' } },
              }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/tienda"
                className="gradient-animated group inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-bold hover:scale-[1.03] transition-transform shadow-lg shadow-brand/30"
              >
                Ver catálogo
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/seguimiento"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-gray-600 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Seguir mi pedido
              </Link>
            </motion.div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 max-w-md">
              <div>
                <p className="text-2xl font-bold text-white">Garantía</p>
                <p className="text-xs text-gray-400 mt-0.5">en cada compra</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-gray-400 mt-0.5">soporte real</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-gray-400 mt-0.5">pago seguro</p>
              </div>
            </div>
          </motion.div>

          <div className="hidden md:block animate-float-lively">
            <div className="shine-hover relative overflow-hidden bg-gradient-to-br from-brand-light/20 to-brand-dark/20 rounded-3xl p-8 border border-brand/20">
              <div className="gradient-brand text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto animate-soft-pulse">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.72 11.06a2.96 2.96 0 00-3.09-4.08 7.5 7.5 0 10-6.85 11.16 2.96 2.96 0 003.09-4.08 1.5 1.5 0 112.5 0 2.96 2.96 0 003.09 4.08l-.74-3.08zM13.5 8.5h.01M8.5 15.5h.01"
                  />
                </svg>
              </div>
              <p className="text-center text-white font-semibold text-lg mt-4">
                Seguridad inteligente para tu hogar
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustBars.map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="trust-card rounded-xl p-5 flex items-start gap-3">
                <span className="gradient-brand text-white w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-brand/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.svg}
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Productos destacados</h2>
            <p className="text-gray-500">Lo más vendido para hacer tu hogar inteligente</p>
          </div>
          <Link to="/tienda" className="group hidden sm:inline-flex items-center gap-1 text-brand-dark font-semibold">
            Ver todo
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </Reveal>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        )}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 80} variant="reveal-zoom">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-gray-500 py-10 text-center">Aún no hay productos publicados. Vuelve pronto.</p>
            )}
          </>
        )}
      </section>

      <ServicesSection />

      <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <span className="inline-block gradient-brand text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Nuestro compromiso
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              No solo vendemos. Te acompañamos.
            </h2>
            <p className="text-gray-500">
              Un equipo que instala, configura y te da soporte de verdad, para que tu inversión
              funcione desde el primer día.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicePromises.map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="trust-card rounded-2xl p-6">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="gradient-brand text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.69l1.1 3.31a1 1 0 01-.59 1.25l-1.46.58a11.04 11.04 0 005.88 5.88l.58-1.46a1 1 0 011.25-.59l3.31 1.1a1 1 0 01.69.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">¿Necesitas ayuda para decidir?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Escríbenos y un asesor te orienta en la elección, instalación y configuración.
                </p>
              </div>
            </div>
            <a
              href={settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}` : '#'}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-brand text-white font-semibold hover:brightness-110 transition whitespace-nowrap shadow-md shadow-brand/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Hablar con un asesor
            </a>
          </Reveal>
        </div>
      </section>

      <section className="gradient-brand py-14">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" variant="reveal-zoom">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Seguridad y confort, en un solo lugar</h2>
          <p className="text-white/90 mb-8">Cerraduras inteligentes · Cámaras de seguridad · Sensores y más</p>
          <Link
            to="/tienda"
            className="inline-block px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white text-brand-dark font-bold hover:bg-gray-50 hover:scale-105 transition shadow-lg"
          >
            Explorar la tienda
          </Link>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              ¿Cómo comprar en {settings.store_name}?
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4 group">
                  <span className="absolute inset-0 gradient-brand rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                  <span className="gradient-brand text-white w-14 h-14 rounded-2xl flex items-center justify-center relative group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.svg}
                    </svg>
                  </span>
                  <span className="absolute -top-2 -right-2 bg-brand-dark text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center animate-soft-pulse">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 px-4">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
    </div>
  )
}