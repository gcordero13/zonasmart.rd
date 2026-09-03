import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { computeServiceQuote, serviceConfig } from '../services/services'
import { createQuotation, generateQuotationCode } from '../services/quotations'
import { fetchSellerByUser } from '../services/sellers'
import QuoteDocument from './QuoteDocument'

export default function ServiceQuoteModal({ service, onClose }) {
  const { settings } = useStore()
  const { user } = useAuth() || {}
  const cfg = useMemo(() => serviceConfig(service), [service])
  const hasOptions = cfg.tiers.length > 0 || cfg.items.length > 0

  const [tierKey, setTierKey] = useState(cfg.tiers[0]?.key || null)
  const [qty, setQty] = useState({})
  const [customerName, setCustomerName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [previewQuote, setPreviewQuote] = useState(null)

  const { tier, lines, tierPrice, total } = useMemo(
    () => computeServiceQuote(service, { tierKey, qty }),
    [service, tierKey, qty]
  )

  const description = useMemo(() => {
    if (!hasOptions) return service.description || ''
    const parts = []
    if (tier) parts.push('Nivel: ' + tier.label)
    lines.forEach((l) => parts.push(l.qty + ' x ' + l.label + ' ($' + l.price.toFixed(2) + ' c/u)'))
    return parts.join('\n')
  }, [hasOptions, tier, lines, service])

  const setItemQty = (key, v) => {
    setQty((q) => ({ ...q, [key]: Math.max(0, Number(v) || 0) }))
  }

  const waLink = settings.whatsapp
    ? 'https://wa.me/' + settings.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(
        'Hola, quiero cotizar el servicio "' + service.title + '".\n\n' + description + '\n\nTotal (est.): $' + total.toFixed(2)
      )
    : '#'
  const mailLink = settings.email
    ? 'mailto:' + settings.email + '?subject=' + encodeURIComponent('Cotizacion de servicio: ' + service.title) + '&body=' + encodeURIComponent(
        'Servicio: ' + service.title + '\n\n' + description + '\n\nTotal (est.): $' + total.toFixed(2) + '\n\nNombre: ' + customerName
      )
    : '#'

  const handleCreateQuote = async () => {
    setSaving(true)
    setError(null)
    try {
      const items = [
        {
          name: service.title,
          price: 0,
          qty: 1,
          install_price: 0,
          installation: false,
          image_url: null,
        },
      ]
      const quote = {
        seller_id: null,
        customer_name: customerName.trim() || 'Cliente',
        customer_email: null,
        customer_whatsapp: null,
        notes: service.title + '\n' + description + '\n\nCotizacion de servicio generada.',
        items,
        cover_images: [],
        subtotal: total,
        shipping: 0,
        discount: 0,
        total,
        status: 'pending',
        quotation_code: generateQuotationCode(),
      }
      if (user?.id) {
        quote.seller_id = (await fetchSellerByUser(user.id, user.email).catch(() => null))?.id || null
      }
      const created = await createQuotation(quote)
      setPreviewQuote(created)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const printQuote = () => {
    if (previewQuote) setTimeout(() => window.print(), 80)
  }

  return (
    <>
      {/* Modal de cotizacion de servicio */}
      <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-lg mt-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900">{service.title}</h3>
              <p className="text-xs text-gray-500">Cotizacion del servicio</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            {hasOptions ? (
              <>
                {cfg.header && <p className="text-sm text-gray-600 mb-4">{cfg.header}</p>}

                {cfg.tiers.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Elige el nivel</p>
                    <div className="space-y-2">
                      {cfg.tiers.map((t) => (
                        <label
                          key={t.key}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition ${
                            tierKey === t.key ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="tier"
                              checked={tierKey === t.key}
                              onChange={() => setTierKey(t.key)}
                              className="w-4 h-4 accent-brand"
                            />
                            <span>
                              <span className="block text-sm font-medium text-gray-900">{t.label}</span>
                              {t.description && <span className="block text-xs text-gray-500">{t.description}</span>}
                            </span>
                          </span>
                          <span className="font-semibold text-brand-dark">${Number(t.price).toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {cfg.items.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Indica las cantidades</p>
                    <div className="space-y-2">
                      {cfg.items.map((it) => (
                        <div key={it.key} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-700">
                            {it.label}
                            <span className="block text-xs text-gray-400">
                              ${Number(it.price).toFixed(2)} por {it.unit || 'unidad'}
                            </span>
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={qty[it.key] || 0}
                            onChange={(e) => setItemQty(it.key, e.target.value)}
                            className="w-20 px-2 py-1.5 rounded-md border border-gray-300 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Desglose */}
                <div className="mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                  {tier && (
                    <div className="flex justify-between text-gray-600 mb-1">
                      <span>{tier.label}</span>
                      <span>${tierPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {lines.map((l) => (
                    <div key={l.key} className="flex justify-between text-gray-600 mb-1">
                      <span>{l.qty} x {l.label}</span>
                      <span>${l.total.toFixed(2)}</span>
                    </div>
                  ))}
                  {lines.length === 0 && !tier && (
                    <p className="text-gray-400 text-xs">Selecciona un nivel o indica cantidades.</p>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre (opcional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="A nombre de quien?"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleCreateQuote}
                    disabled={saving}
                    className="w-full py-3 rounded-xl gradient-brand text-white font-semibold hover:brightness-110 disabled:opacity-50 transition shadow-md shadow-brand/20"
                  >
                    {saving ? 'Guardando...' : 'Solicitar cotizacion'}
                  </button>
                  <div className="flex gap-2">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={mailLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-dark transition"
                    >
                      Correo
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                {Number(service.price) > 0 && (
                  <p className="text-lg font-bold text-gray-900 mb-4">${Number(service.price).toFixed(2)}</p>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre (opcional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="A nombre de quien?"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  />
                </div>
                <button
                  onClick={handleCreateQuote}
                  disabled={saving}
                  className="w-full py-3 rounded-xl gradient-brand text-white font-semibold hover:brightness-110 disabled:opacity-50 transition shadow-md shadow-brand/20"
                >
                  {saving ? 'Guardando...' : 'Solicitar cotizacion'}
                </button>
                <div className="flex gap-2 mt-2">
                  <a href={waLink} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition">
                    WhatsApp
                  </a>
                  <a href={mailLink} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-dark transition">
                    Correo
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Vista previa de la cotizacion en PDF */}
      {previewQuote && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl mt-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Cotizacion {previewQuote.quotation_code}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={printQuote}
                  className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-semibold hover:brightness-110 transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir / Guardar PDF
                </button>
                <button
                  onClick={() => setPreviewQuote(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                  title="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-6">
              <QuoteDocument quote={previewQuote} />
            </div>
          </div>
        </div>
      )}

      {/* Estilos de impresion */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quote-print-area, #quote-print-area * { visibility: visible; }
          #quote-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          #quote-print-area { box-shadow: none !important; }
          #quote-print-area { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  )
}
