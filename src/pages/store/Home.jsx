import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../../services/products'
import ProductCard from '../../components/ProductCard'

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
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenido a <span className="text-amber-400">ZonaSmart</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Encuentra los mejores productos tecnológicos al mejor precio.
          </p>
          <Link
            to="/tienda"
            className="inline-block px-8 py-4 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos destacados</h2>

        {loading && <p className="text-gray-500">Cargando productos...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-gray-500">
            Aún no hay productos publicados. Vuelve pronto.
          </p>
        )}
      </section>
    </div>
  )
}
