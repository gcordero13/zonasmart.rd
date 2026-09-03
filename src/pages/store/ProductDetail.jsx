import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../../services/products'
import { useCart } from '../../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [withInstallation, setWithInstallation] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    fetchProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    if (product.requires_installation && withInstallation) {
      addItem({
        ...product,
        price: Number(product.price) + Number(product.installation_price || 0),
        installation: true,
      })
    } else {
      addItem(product)
    }
  }

  if (loading) return <p className="text-gray-500 p-8">Cargando producto...</p>
  if (error) return <p className="text-red-600 p-8">Error: {error}</p>
  if (!product) return <p className="text-gray-500 p-8">Producto no encontrado.</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-dark">Inicio</Link>
        <span> / </span>
        <Link to="/tienda" className="hover:text-brand-dark">Tienda</Link>
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
          <p className="text-sm text-brand font-semibold uppercase mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            $
            {(
              Number(product.price) +
              (product.requires_installation && withInstallation ? Number(product.installation_price || 0) : 0)
            ).toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {(product.details || product.color || product.weight) && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">Detalles del producto</p>
              <dl className="space-y-1 text-sm text-gray-600">
                {product.details && (
                  <p className="whitespace-pre-line">{product.details}</p>
                )}
                {product.color && (
                  <p>
                    <span className="font-medium text-gray-800">Color:</span> {product.color}
                  </p>
                )}
                {product.weight != null && (
                  <p>
                    <span className="font-medium text-gray-800">Peso:</span> {product.weight} kg
                  </p>
                )}
              </dl>
            </div>
          )}

          {product.requires_installation && (
            <label className="flex items-start gap-3 mb-6 p-4 rounded-lg border border-brand/30 bg-brand/5 cursor-pointer">
              <input
                type="checkbox"
                checked={withInstallation}
                onChange={(e) => setWithInstallation(e.target.checked)}
                className="w-5 h-5 accent-brand mt-0.5"
              />
              <span>
                <span className="font-semibold text-gray-900">Agregar instalación</span>
                <span className="block text-sm text-gray-600">
                  Instalación profesional por ${Number(product.installation_price || 0).toFixed(2)}
                </span>
              </span>
            </label>
          )}

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
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="w-full md:w-auto px-8 py-4 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
