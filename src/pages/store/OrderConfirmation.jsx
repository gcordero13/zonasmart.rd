import { Link, useLocation } from 'react-router-dom'

export default function OrderConfirmation() {
  const location = useLocation()
  const trackingCode = location.state?.trackingCode

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido realizado!</h1>
      <p className="text-gray-600 mb-6">
        Gracias por tu compra. Te hemos enviado un email de confirmación con los detalles de tu
        pedido.
      </p>

      {trackingCode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-amber-800 mb-2">Tu código de seguimiento es:</p>
          <p className="text-2xl font-bold text-amber-700 tracking-widest">{trackingCode}</p>
          <p className="text-sm text-amber-700 mt-3">
            Guárdalo. Puedes darle seguimiento a tu pedido desde la página{' '}
            <Link to="/seguimiento" className="underline font-medium">
              Seguimiento
            </Link>
          </p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Link
          to="/seguimiento"
          className="px-8 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
        >
          Ver estado de mi pedido
        </Link>
        <Link
          to="/tienda"
          className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}