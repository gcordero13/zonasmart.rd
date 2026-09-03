import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const price = Number(product.price)

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-amber-200">
      <Link to={`/producto/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              📦
            </div>
          )}
        </div>
        {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            ¡Solo quedan {product.stock}!
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-amber-600 font-medium uppercase mb-1">
          {product.category || 'Tecnología'}
        </span>
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="font-bold text-lg text-gray-900">
              ${price.toFixed(2)}
            </span>
            {product.delivery_days > 0 && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                🚚 {product.delivery_days} día{product.delivery_days > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:brightness-110 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-500/20"
          >
            {product.stock === 0 ? 'Agotado' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}