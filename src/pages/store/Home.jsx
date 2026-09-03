import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../../services/products'
import ProductCard from '../../components/ProductCard'
import ReviewsSection from '../../components/ReviewsSection'

export default function Home() {
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

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-amber-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              🚚 Envíos a todo el país
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-6">
              Tecnología que hace tu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                hogar inteligente
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Cerraduras inteligentes, cámaras de seguridad y dispositivos de última generación.
              Compra con confianza y recibe tu pedido donde estés.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tienda"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/30"
              >
                Ver catálogo
              </Link>
              <Link
                to="/seguimiento"
                className="px-8 py-4 rounded-xl border border-gray-600 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Seguir mi pedido
              </Link>
            </div>
          </div>

          <div className="hidden md:block animate-float">
            <div className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-3xl p-8 border border-amber-500/20">
              <div className="text-[120px] text-center">🔒</div>
              <p className="text-center text-white font-semibold text-lg mt-4">
                Seguridad inteligente para tu hogar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BARRAS DE CONFIANZA */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🔒', title: 'Pago seguro', desc: 'Transacciones protegidas' },
            { icon: '🚚', title: 'Envío rápido', desc: 'A todo el país' },
            { icon: '🛡️', title: 'Garantía', desc: 'Calidad garantizada' },
            { icon: '💬', title: 'Atención 24/7', desc: 'Soporte al cliente' },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`flex items-start gap-3 animate-fade-in-up delay-${i + 1}00`}
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Productos destacados
            </h2>
            <p className="text-gray-500">Lo más vendido para hacer tu hogar inteligente</p>
          </div>
          <Link
            to="/tienda"
            className="hidden sm:inline-flex items-center gap-1 text-amber-600 font-semibold hover:text-amber-700"
          >
            Ver todo →
          </Link>
        </div>

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
                <div key={product.id} className={`animate-scale-in delay-${((i % 4) + 1) * 100}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-gray-500 py-10 text-center">
                Aún no hay productos publicados. Vuelve pronto.
              </p>
            )}
          </>
        )}
      </section>

      {/* BANNER CATEGORÍAS */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Seguridad y confort, en un solo lugar
          </h2>
          <p className="text-white/90 mb-8">
            Cerraduras inteligentes · Cámaras de seguridad · Sensores y más
          </p>
          <Link
            to="/tienda"
            className="inline-block px-8 py-4 rounded-xl bg-white text-amber-600 font-bold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Explorar la tienda
          </Link>
        </div>
      </section>

      {/* CÓMO COMPRAR */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            ¿Cómo comprar en ZonaSmart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: '🛒', title: 'Elige tu producto', desc: 'Explora el catálogo y añade al carrito' },
              { step: '2', icon: '💳', title: 'Paga seguro', desc: 'Métodos de pago protegidos y sencillos' },
              { step: '3', icon: '📦', title: 'Recíbelo en casa', desc: 'Envío a todo el país con seguimiento' },
              { step: '4', icon: '✅', title: 'Disfruta y confía', desc: 'Calidad garantizada y soporte 24/7' },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`text-center animate-fade-in-up delay-${(i + 1) * 100}`}
              >
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                  <span className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl opacity-20" />
                  <span className="text-4xl relative">{item.icon}</span>
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
    </div>
  )
}