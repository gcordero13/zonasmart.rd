import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchProducts } from '../../services/products'
import ProductCard from '../../components/ProductCard'
import ReviewsSection from '../../components/ReviewsSection'
import ServicesSection from '../../components/ServicesSection'
import Reveal from '../../components/Reveal'
import AnimatedCounter from '../../components/AnimatedCounter'
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
      <section className="relative bg-gray-950 overflow-hidden">
        {/* Fondo animado en capas */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-brand-dark/40" />
          <div className="bg-grid-faint absolute inset-0 opacity-40" />
          <motion.div
            className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-brand/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 16, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-brand-dark/25 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], x: [0, 24, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 right-1/2 w-64 h-64 rounded-full bg-brand-light/10 blur-3xl"
            animate={{ y: [0, -24, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Partículas decorativas */}
          {[
            ['top-[18%] left-[12%]', 0],
            ['top-[30%] right-[16%]', 0.6],
            ['bottom-[24%] right-[28%]', 1.2],
            ['top-[55%] left-[28%]', 1.8],
          ].map(([pos], i) => (
            <motion.span
              key={i}
              className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-brand-light/70`}
              animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-28 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium text-brand-light mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-light opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-light" />
              </span>
              Instalación y soporte profesional incluidos
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] } },
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] text-white mb-6"
            >
              {titlePrefix}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand to-brand-dark">
                inteligente
                <motion.span
                  className="absolute left-0 right-0 -bottom-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand-light to-brand-dark"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: 'easeOut' } },
              }}
              className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed"
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
                className="gradient-animated group inline-flex items-center gap-2 px-7 sm:px-8 py-4 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-bold hover:scale-[1.04] transition-transform shadow-brand-glow"
              >
                Explorar la tienda
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/cotizador"
                className="group inline-flex items-center gap-2 px-7 sm:px-8 py-4 rounded-xl border border-white/15 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-brand-light" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Cotizar sin compromiso
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.35, ease: 'easeOut' } },
              }}
              className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-7 max-w-md"
            >
              <div>
                <AnimatedCounter value={100} suffix="%" className="text-2xl font-extrabold text-white" />
                <p className="text-xs text-gray-400 mt-1">Pago protegido</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white">24/7</span>
                <p className="text-xs text-gray-400 mt-1">Soporte real</p>
              </div>
              <div>
                <AnimatedCounter value={1} className="text-2xl font-extrabold text-white" />
                <p className="text-xs text-gray-400 mt-1">Garantía incluida</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual de portada con fotos reales de productos */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block relative"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="shine-hover relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-white">
                {/* Imagen principal de portada: primer producto destacado */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {featured[0]?.image_url ? (
                    <>
                      <img
                        src={featured[0].image_url}
                        alt={featured[0].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">
                          {featured[0].category || 'Destacado'}
                        </span>
                        <p className="text-white font-bold text-lg leading-tight mt-0.5">
                          {featured[0].name}
                        </p>
                        <p className="text-white/80 text-sm mt-0.5">
                          desde ${Number(featured[0].price).toFixed(2)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/20 to-brand-dark/30">
                      <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0a6.5 6.5 0 10-9.2 0 6.5 6.5 0 009.2 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Tira de miniaturas con los siguientes destacados */}
                {featured.slice(1, 5).length > 0 && featured[0]?.image_url && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50">
                    {featured.slice(1, 5).map((p) => (
                      <div key={p.id} className="relative h-24 overflow-hidden rounded-xl group">
                        {p.image_url ? (
                          <>
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute bottom-1.5 left-2 right-2 text-[11px] text-white font-medium truncate">
                              {p.name}
                            </span>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                            Sin imagen
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2"
              >
                <span className="text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-gray-500">Entrega</p>
                  <p className="text-sm font-bold text-gray-900">Todo el país</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2"
              >
                <span className="flex -space-x-2">
                  {['bg-brand', 'bg-brand-dark', 'bg-brand-light'].map((c, i) => (
                    <span key={i} className={`w-6 h-6 rounded-full border-2 border-white ${c}`} />
                  ))}
                </span>
                <div>
                  <p className="text-xs text-gray-500">Clientes</p>
                  <p className="text-sm font-bold text-gray-900">+1,000 confían</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
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

      <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <span className="inline-block gradient-brand text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Preguntas frecuentes
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Resolvemos tus dudas
            </h2>
          </Reveal>

          <div className="space-y-3">
            {[
              ['¿Cómo realizo una compra?', 'Agrega los productos al carrito, completa tus datos de envío y confirma tu pedido. Recibirás un código de seguimiento para monitorear la entrega.'],
              ['¿Cuánto tarda la entrega?', 'Realizamos envíos a todo el país. La mayoría de los pedidos se despachan en 24 horas y el plazo de entrega depende de tu zona.'],
              ['¿Ofrecen instalación profesional?', 'Sí. Muchos de nuestros productos pueden incluir instalación profesional realizada por técnicos certificados para garantizar que todo funcione desde el primer día.'],
              ['¿Qué métodos de pago aceptan?', 'Aceptamos pagos con tarjeta de crédito, débito y otros métodos seguros. La pasarela de pago se está integrando, pero tu pedido queda registrado de forma segura.'],
              ['¿Puedo cotizar varios productos?', 'Claro. Usa nuestro cotizador para seleccionar varios equipos, elegir si requieren instalación y generar una cotización profesional descargable.'],
              ['¿Qué pasa si algo sale mal?', 'Todos nuestros productos cuentan con garantía. Si tienes algún problema, nuestro equipo de soporte 24/7 te atiende por WhatsApp o correo para resolverlo.'],
            ].map(([q, a], i) => (
              <FaqItem key={i} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-16">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-white/10 text-brand-light text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Novedades y ofertas
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Recibe las mejores ofertas
          </h2>
          <p className="text-gray-400 mb-8">
            Suscríbete a nuestro boletín y entérate de lanzamientos, promociones exclusivas y consejos para tu hogar inteligente.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const email = e.currentTarget.email.value
              if (email) {
                window.location.href = settings.whatsapp
                  ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`¡Hola! Me quiero suscribir a novedades con el correo: ${email}`)}`
                  : `mailto:${settings.email}?subject=Suscripción a novedades&body=${encodeURIComponent(`Me quiero suscribir con el correo: ${email}`)}`
              }
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="tu@correo.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl gradient-brand text-white font-semibold hover:brightness-110 transition shadow-brand-glow"
            >
              Suscribirme
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Sin spam. Cancela cuando quieras.
          </p>
        </Reveal>
      </section>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="font-semibold text-gray-900">{question}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}