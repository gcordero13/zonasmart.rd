import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <Link to={`/producto/${product.id}`} className="block">
        <div className="aspect-square bg-gray-200 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-amber-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="px-3 py-2 rounded-md bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
