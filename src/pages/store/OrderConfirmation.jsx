import { Link } from 'react-router-dom'

export default function OrderConfirmation() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido realizado!</h1>
      <p className="text-gray-600 mb-8">
        Gracias por tu compra. Te hemos enviado un email de confirmación con los detalles de tu
        pedido.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/tienda"
          className="px-8 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
        >
          Seguir comprando
        </Link>
        <Link
          to="/"
          className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
