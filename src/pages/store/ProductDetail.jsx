import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../../services/products'
import { useCart } from '../../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    fetchProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray-500 p-8">Cargando producto...</p>
  if (error) return <p className="text-red-600 p-8">Error: {error}</p>
  if (!product) return <p className="text-gray-500 p-8">Producto no encontrado.</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-amber-600">Inicio</Link>
        <span> / </span>
        <Link to="/tienda" className="hover:text-amber-600">Tienda</Link>
        <span> / </span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-amber-600 font-semibold uppercase mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-sm text-gray-500">
              {product.stock > 0 ? (
                <span className="text-green-600">En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="text-red-600">Agotado</span>
              )}
            </p>
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="w-full md:w-auto px-8 py-4 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
