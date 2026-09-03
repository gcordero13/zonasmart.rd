import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProductById } from '../../services/products'
import { useCart } from '../../context/CartContext'

function getProductImages(product) {
  const list = []
  if (product.image_url) list.push(product.image_url)
  if (Array.isArray(product.image_gallery)) {
    product.image_gallery.forEach((u) => u && u !== product.image_url && list.push(u))
  }
  return list
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [withInstallation, setWithInstallation] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    setActiveImg(0)
    fetchProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const images = product ? getProductImages(product) : []
  const currentImage = images[activeImg % Math.max(1, images.length)] || null

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
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
                key={currentImage}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow transition"
                  aria-label="Imagen anterior"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow transition"
                  aria-label="Siguiente imagen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <span className="absolute bottom-3 right-3 text-xs font-medium bg-black/50 text-white px-2 py-1 rounded-md">
                  {activeImg + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 transition ${
                    i === activeImg ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Imagen ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
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
        </motion.div>
      </div>
    </div>
  )
}
