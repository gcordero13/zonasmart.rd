import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const price = Number(product.price)
  const soldOut = product.stock === 0
  const lowStock = !soldOut && product.stock !== undefined && product.stock <= 5

  return (
    <div className="shine-hover group relative bg-white rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-brand-light">
      <Link to={`/producto/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0a6.5 6.5 0 10-9.2 0 6.5 6.5 0 009.2 0z" />
              </svg>
            </div>
          )}
        </div>
        {lowStock && (
          <span className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-2 py-1 rounded-full animate-soft-pulse">
            Solo quedan {product.stock}
          </span>
        )}
        {soldOut && (
          <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Agotado
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-brand font-medium uppercase mb-1">
          {product.category || 'Tecnología'}
        </span>
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-brand transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        <div className="mt-auto flex flex-col gap-3 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-gray-900">${price.toFixed(2)}</span>
            {product.delivery_days > 0 && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {product.delivery_days} día{product.delivery_days > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={soldOut}
            className="w-full px-3 py-2.5 rounded-lg gradient-brand text-white text-sm font-semibold hover:brightness-110 hover:scale-[1.02] active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand/20"
          >
            {soldOut ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}