import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Agrega productos para comenzar a comprar.</p>
        <Link
          to="/tienda"
          className="inline-block px-8 py-4 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Carrito de compras ({totalItems} items)
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow p-4 flex gap-4 items-center"
            >
              <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Link to={`/producto/${item.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                </Link>
                <p className="text-sm text-gray-500">
                  ${Number(item.price).toFixed(2)} c/u
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <div className="text-right w-24">
                <p className="font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-600 hover:text-red-700 mt-1"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Envío</span>
            <span className="font-medium">Calculado al checkout</span>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between mb-6">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center px-6 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
          >
            Proceder al pago
          </Link>
        </div>
      </div>
    </div>
  )
}
