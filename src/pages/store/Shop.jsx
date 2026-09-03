import { useEffect, useState } from 'react'
import { fetchProducts, subscribeToProducts } from '../../services/products'
import ProductCard from '../../components/ProductCard'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data)
        setFiltered(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))

    const subscription = subscribeToProducts(() => {
      fetchProducts()
        .then(setProducts)
        .catch(() => {})
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let result = products
    if (category !== 'all') {
      result = result.filter((p) => p.category === category)
    }
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFiltered(result)
  }, [search, category, products])

  const categories = ['all', ...new Set(products.map((p) => p.category))]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-10 mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Tienda</h1>
        <p className="text-gray-300 mb-6">
          Encuentra la tecnología perfecta para tu hogar inteligente
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-700 bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="text-gray-900">
                {c === 'all' ? 'Todas las categorías' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-gray-500">Cargando productos...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className="text-gray-500">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
