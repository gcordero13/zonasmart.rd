import { useStore } from '../context/StoreContext'

export default function QuoteDocument({ quote, sellerName, coverIndex = 0, onCover = () => {} }) {
  const { settings } = useStore()
  const storeName = settings.store_name || 'ZonaSmart'
  const items = quote.items || []
  const subtotal = Number(quote.subtotal || 0)
  const shipping = Number(quote.shipping || 0)
  const discount = Number(quote.discount || 0)
  const total = Number(quote.total || subtotal + shipping - discount)
  const created = quote.created_at ? new Date(quote.created_at) : new Date()

  const covers = (quote.cover_images || []).filter(Boolean)
  const activeCover = covers.length ? covers[coverIndex % covers.length] : null
  const lineTotal = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)

  const statusLabel = {
    pending: 'Pendiente de aprobación',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    converted: 'Convertida en venta',
  }

  return (
    <div id="quote-print-area" className="relative bg-white text-gray-900 overflow-hidden">
      {/* Fondo en relieve opaco (marca de agua) */}
      {activeCover && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={activeCover}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.06, filter: 'grayscale(1) blur(6px)' }}
          />
        </div>
      )}

      {/* Contenido encima */}
      <div className="relative z-10 p-8">
        {/* Marca */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 bg-white/85 rounded-xl px-4 py-4 -mx-2">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))' }}
            >
              {(storeName || 'Z').replace('Zona', '').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">{storeName}</p>
              {settings.address && <p className="text-xs text-gray-500">{settings.address}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="gradient-brand inline-block text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Cotización
            </p>
            <p className="text-sm font-semibold mt-2 text-gray-800">{quote.quotation_code}</p>
            <p className="text-xs text-gray-500">{created.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Datos cliente + vendedor */}
        <div className="grid grid-cols-2 gap-6 py-6">
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Cliente</p>
            <p className="font-semibold text-gray-900">{quote.customer_name}</p>
            {quote.customer_email && <p className="text-sm text-gray-500">{quote.customer_email}</p>}
            {quote.customer_whatsapp && <p className="text-sm text-gray-500">{quote.customer_whatsapp}</p>}
          </div>
          {sellerName && (
            <div className="text-right bg-white/80 rounded-lg p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Emisor</p>
              <p className="font-semibold text-gray-900">{sellerName}</p>
              <p className="text-sm text-gray-500">{storeName}</p>
            </div>
          )}
        </div>

        {/* Items en tarjeta */}
        <div className="bg-white/90 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="py-2.5 px-3">Producto</th>
                <th className="py-2.5 px-3 text-center">Cant.</th>
                <th className="py-2.5 px-3 text-right">Precio</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const price = Number(item.price || 0)
                const qty = Number(item.qty || 1)
                return (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2.5 px-3 text-gray-800">
                      <div className="flex items-center gap-2.5">
                        {item.image_url && (
                          <img src={item.image_url} alt="" className="w-8 h-8 rounded-md object-cover" />
                        )}
                        {item.name}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{qty}</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">${price.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-gray-800">${(price * qty).toFixed(2)}</td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">
                    Sin productos agregados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="flex justify-end mt-6">
          <div className="w-64 space-y-1.5 text-sm bg-white/80 rounded-lg p-3">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${lineTotal.toFixed(2)}</span>
            </div>
            {shipping > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Descuento</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {quote.notes && (
          <div className="mt-6 p-3 rounded-lg bg-white/80 text-sm text-gray-600 border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Notas</p>
            {quote.notes}
          </div>
        )}

        {covers.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onCover('prev')}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition print:hidden"
              title="Imagen anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs text-gray-500 print:hidden">
              Imagen {coverIndex + 1} de {covers.length}
            </span>
            <button
              type="button"
              onClick={() => onCover('next')}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition print:hidden"
              title="Siguiente imagen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Estado y pie */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-xs text-gray-400">
            {storeName} · {settings.email || ''}
          </span>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background:
                quote.status === 'approved'
                  ? 'rgba(16,185,129,0.12)'
                  : quote.status === 'rejected'
                    ? 'rgba(239,68,68,0.12)'
                    : 'rgba(245,158,11,0.12)',
              color:
                quote.status === 'approved'
                  ? '#059669'
                  : quote.status === 'rejected'
                    ? '#dc2626'
                    : '#b45309',
            }}
          >
            {statusLabel[quote.status] || quote.status}
          </span>
        </div>
      </div>
    </div>
  )
}