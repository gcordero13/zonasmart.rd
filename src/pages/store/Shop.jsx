import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchProducts, subscribeToProducts } from '../../services/products'
import ProductCard from '../../components/ProductCard'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('recent')

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
    const sorted = [...result]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price-desc':
        sorted.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    setFiltered(sorted)
  }, [search, category, sort, products])

  const categories = ['all', ...new Set(products.map((p) => p.category))]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-10 mb-8 shadow-lg"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-white mb-2"
        >
          Tienda
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-300 mb-6"
        >
          Encuentra la tecnología perfecta para tu hogar inteligente
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-4xl">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0a6.5 6.5 0 10-9.2 0 6.5 6.5 0 009.2 0z" />
              </svg>
            </span>
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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-700 bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="recent" className="text-gray-900">Más recientes</option>
            <option value="price-asc" className="text-gray-900">Precio: menor a mayor</option>
            <option value="price-desc" className="text-gray-900">Precio: mayor a menor</option>
            <option value="name" className="text-gray-900">Nombre (A-Z)</option>
          </select>
        </div>
      </motion.div>

      {loading && <p className="text-gray-500">Cargando productos...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500"
            >
              No se encontraron productos.
            </motion.p>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.045,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
