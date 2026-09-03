import { useEffect, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { fetchProducts } from '../services/products'
import { fetchSellerByUser } from '../services/sellers'
import { createQuotation, generateQuotationCode } from '../services/quotations'
import QuoteDocument from './QuoteDocument'

const WAIT_MS = 550

function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function findProductInList(products, text) {
  const t = normalize(text)
  if (!t) return null
  return products.find((p) => normalize(p.name).split(/\s+/).some((w) => w.length > 3 && t.includes(w)))
}

function orderToItems(order) {
  return Object.values(order).map(({ product, qty, installation }) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price || 0),
    install_price: Number(product.installation_price || 0),
    installation: !!installation,
    qty,
    image_url: product.image_url || null,
  }))
}

function orderTotals(order) {
  const items = orderToItems(order)
  const subtotal = items.reduce(
    (s, i) => s + (i.price + (i.installation ? i.install_price : 0)) * i.qty,
    0
  )
  return { items, subtotal }
}

function orderSummary(order) {
  const { items, subtotal } = orderTotals(order)
  const lines = items.map(
    (i) =>
      `• ${i.qty} x ${i.name} — $${(i.price * i.qty).toFixed(2)}` +
      (i.installation ? ` (incl. instalación +$${(i.install_price * i.qty).toFixed(2)})` : '')
  )
  return {
    text: lines.length
      ? `Tu pedido actual:\n\n${lines.join('\n')}\n\nSubtotal: $${subtotal.toFixed(2)}\n\nEscribe "cotización a nombre de [tu nombre]" para darte el PDF, o agrega/quita equipos.`
      : 'Tu pedido está vacío. Dime qué equipo quieres (ej. "2 cámaras con instalación").',
  }
}

const QUICK_REPLIES = ['Existencias', 'Ver mi pedido', 'Cotización a nombre de', 'Soporte']

function buildBotReply(rawUser, ctx) {
  const { products, order } = ctx
  const text = normalize(rawUser)
  let myOrder = order

  // Saludos
  if (/hola|buenas|saludos|hey|hi/.test(text)) {
    return {
      reply:
        'Hola! Soy el asistente de ZonaSmart 🙂\n\nPuedo ayudarte a:\n• Armar un pedido (ej. "2 cámaras con instalación")\n• Consultar existencias y precios\n• Darte una cotización en PDF\n\nEmpecemos: ¿qué equipo te interesa?',
    }
  }

  // Catálogo / existencias
  if (/existencias|disponible|en stock|inventario|todas|lista|equipos/.test(text)) {
    return { reply: buildCatalogReplies(products) }
  }

  // Ver pedido / carrito / resumen
  if (/carrito|pedido|resumen|mi orden|ver lo que/.test(text)) {
    return { reply: orderSummary(myOrder).text }
  }

  // Quitar producto del pedido
  const removeMatch = text.match(/quitar|quita|elimina|quitar del pedido|sacar/)
  if (removeMatch) {
    const target = findProductInList(products, text)
    if (target && myOrder[target.id]) {
      const rest = { ...myOrder }
      delete rest[target.id]
      myOrder = rest
      return {
        reply: `Listo, quité ${target.name} de tu pedido. ${orderSummary(myOrder).text}`,
        order: myOrder,
      }
    }
  }

  const wantInstallText = /con instalac|con puesta|instalar|instalacion/.test(text)
  const wantNoInstall = /sin instalac|sin puesta|sin instalar/.test(text)
  const qtyMatch = text.match(/(\d+)/)
  const anyProduct = findProductInList(products, text)

  // Soporte debe evaluarse después de productos
  if (/soporte|agente|humano|persona|asesor|hablar con/.test(text) && !anyProduct) {
    return {
      reply:
        'Con gusto te paso con un agente de soporte. Usa los botones de WhatsApp o Correo de abajo y atenderemos tu consulta lo antes posible.',
      lastProductName: null,
    }
  }

  // Agregar / actualizar pedido
  let match = anyProduct
  if (!match && qtyMatch && ctx.lastProductName) {
    match = products.find((p) => normalize(p.name) === normalize(ctx.lastProductName)) || null
  }

  if (match) {
    const id = match.id
    const stock = Number(match.stock || 0)
    const current = myOrder[id] ? myOrder[id].qty : 0
    const installation = wantNoInstall ? false : wantInstallText ? true : myOrder[id]?.installation ?? (Number(match.installation_price || 0) > 0)
    const unitPrice = Number(match.price || 0)
    const instPrice = Number(match.installation_price || 0)

    // ¿Es una adición ("agregale otra") o un valor exacto ("necesito solo 1")?
    const isAdditive = /otra|agrega|a[ñn]ade|agregar|mas\b|mas de/.test(text)
    let newQty
    if (qtyMatch) {
      const wanted = parseInt(qtyMatch[1], 10)
      newQty = isAdditive && myOrder[id] ? current + wanted : wanted
    } else if (isAdditive && myOrder[id]) {
      newQty = current + 1
    } else {
      newQty = current || 1
    }

    // Cap al stock
    const limited = stock > 0 && newQty > stock
    if (limited) newQty = stock

    myOrder = {
      ...myOrder,
      [id]: { product: match, qty: newQty, installation: installation && instPrice > 0 },
    }

    const entry = myOrder[id]
    const line = unitPrice * entry.qty
    const inst = entry.installation ? instPrice * entry.qty : 0
    let reply = `${entry.qty} x ${match.name}\nPrecio: $${(unitPrice * entry.qty).toFixed(2)}`
    if (entry.installation) reply += `\nInstalación: +$${inst.toFixed(2)} ($${instPrice.toFixed(2)}/unidad)`
    reply += `\nSubtotal de este equipo: $${(line + inst).toFixed(2)}`
    if (limited) {
      reply += `\n\nSolo tenemos ${stock} disponible(s) y ya los agregué. Si necesitas más, te paso con un agente.`
    }
    const total = orderTotals(myOrder).subtotal
    reply += `\n\nTu pedido hasta ahora: $${total.toFixed(2)}.`
    reply += `\n\nPuedo agregar otro equipo, darte la cotización en PDF (ej. "cotización a nombre de Juan") o pasarte con soporte.`

    return { reply, order: myOrder, lastProductName: match.name }
  }

  // Solicitud de cotización / PDF / finalizar
  const wantQuote = /cotizacion|cotiza|pdf|finalizar|total final|cierra mi pedido|dame el pedido/.test(text)
  if (wantQuote) {
    if (Object.keys(myOrder).length === 0) {
      return {
        reply:
          'Aún no tienes equipos en tu pedido. Dime el equipo y la cantidad, por ejemplo "2 cámaras con instalación", y te genero la cotización.',
      }
    }
    const nameMatch = rawUser.match(/a nombre de\s+([^,.]+)/i) || rawUser.match(/nombre\s+([^,.]+)/i)
    const customerName = nameMatch ? nameMatch[1].trim() : 'Cliente'
    return {
      reply: `Perfecto, genero tu cotización a nombre de ${customerName}.`,
      order: myOrder,
      lastProductName: ctx.lastProductName,
      quote: { customerName },
    }
  }

  // Fallback
  return {
    reply:
      'Puedo ayudarte a armar tu pedido. Prueba con:\n• "Existencias" para ver el inventario.\n• "2 cámaras con instalación" para agregar al pedido.\n• "Cotización a nombre de Pedro" para el PDF.\n• "Ver mi pedido" para el resumen.\n• "Soporte" para hablar con un agente.',
  }
}

function buildCatalogReplies(products) {
  const available = products.filter((p) => Number(p.stock || 0) > 0)
  const lines = available.map((p) => `${p.name} — $${Number(p.price).toFixed(2)}`)
  return lines.length
    ? `Estos son los equipos disponibles:\n\n${lines.join('\n')}\n\n¿Cuál te interesa? Dime una cantidad (ej. "2 cámaras") y lo agrego a tu pedido.`
    : 'Actualmente no hay equipos en existencia. Pronto reponemos inventario.'
}

export default function SupportChat() {
  const { settings } = useStore()
  const { user } = useAuth() || {}
  const storeName = settings.store_name || 'ZonaSmart'
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [products, setProducts] = useState([])
  const [lastProductName, setLastProductName] = useState(null)
  const [order, setOrder] = useState({})
  const [previewQuote, setPreviewQuote] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, open, previewQuote])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: 'bot',
          text:
            `Hola! 👋 Soy el asistente de ${storeName}.\n` +
            'Dime qué equipo necesitas (ej. "2 cámaras con instalación") y armo tu pedido. Escribe "existencias" para ver todo lo disponible.',
        },
      ])
    }
  }, [open, messages.length, storeName])

  const pushBot = (text) => setMessages((m) => [...m, { from: 'bot', text }])
  const pushUser = (text) => setMessages((m) => [...m, { from: 'user', text }])

  const finalizeQuote = async (customerName, orderRef) => {
    const { items, subtotal } = orderTotals(orderRef)
    let seller = null
    if (user?.id) {
      seller = await fetchSellerByUser(user.id, user.email).catch(() => null)
    }
    const quote = {
      seller_id: seller?.id || null,
      customer_name: customerName || 'Cliente',
      customer_email: null,
      customer_whatsapp: null,
      notes: 'Cotización generada desde el chat de soporte.',
      items,
      cover_images: [],
      subtotal,
      shipping: 0,
      discount: 0,
      total: subtotal,
      status: 'pending',
      quotation_code: generateQuotationCode(),
    }
    const created = await createQuotation(quote)
    return created
  }

  const sendBot = async (raw) => {
    const text = raw.trim()
    if (!text) return
    pushUser(text)
    setInput('')
    setTyping(true)
    await new Promise((r) => setTimeout(r, WAIT_MS + Math.random() * 400))

    let result
    try {
      result = buildBotReply(text, { products, order, lastProductName })
    } catch {
      result = { reply: 'Ups, algo salió mal. Intenta de nuevo o escríbele a un agente.' }
    }

    if (result.order) setOrder(result.order)
    if (result.lastProductName !== undefined) setLastProductName(result.lastProductName)

    if (result.quote) {
      try {
        const created = await finalizeQuote(result.quote.customerName, result.order)
        setOrder({})
        setLastProductName(null)
        setMessages((m) => [
          ...m,
          {
            from: 'bot',
            text:
              `✅ Cotización Creada (${created.quotation_code}) a nombre de ${created.customer_name}.\n` +
              `Items: ${created.items.length} · Total: $${Number(created.total).toFixed(2)}.\n\nPuedes verla e imprimirla en la ventana que se abre.`,
          },
        ])
        setPreviewQuote(created)
      } catch (e) {
        setMessages((m) => [
          ...m,
          { from: 'bot', text: `Hubo un error al guardar tu cotización (${e.message}). Escríbele a un agente para ayudarte.` },
        ])
      }
    } else {
      pushBot(result.reply)
    }
    setTyping(false)
  }

  const handleQuick = (q) => {
    if (q === 'Existencias') return sendBot('existencias')
    if (q === 'Ver mi pedido') return sendBot('ver mi pedido')
    if (q === 'Soporte') return sendBot('soporte')
    if (q === 'Cotización a nombre de') return sendBot('cotización a nombre de Cliente')
  }

  const waLink = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, necesito ayuda en ${storeName}.`)}`
    : '#'
  const mailLink = settings.email
    ? `mailto:${settings.email}?subject=${encodeURIComponent(`Consulta en ${storeName}`)}`
    : '#'

  const printQuote = () => {
    if (!previewQuote) return
    setTimeout(() => window.print(), 80)
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Soporte"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full gradient-brand text-white flex items-center justify-center shadow-lg shadow-brand/30 hover:scale-105 transition-transform"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        )}
      </button>

      {/* Vista previa de cotización (PDF imprimible) */}
      {previewQuote && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl mt-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">
                Cotización {previewQuote.quotation_code}
              </h3>
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

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="gradient-brand px-4 py-3 text-white">
            <p className="font-semibold">Soporte {storeName}</p>
            <p className="text-xs text-white/80">Asistente de pedidos + agente</p>
          </div>

          {/* Mensajes */}
          <div className="flex-1 max-h-80 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-xl px-3 py-2 text-sm ${
                    m.from === 'user'
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.15s]" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            {/* Quick replies */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuick(q)}
                  className="px-2.5 py-1 rounded-full border border-brand/40 text-brand-dark text-[11px] font-medium hover:bg-brand/10 transition"
                >
                  {q}
                </button>
              ))}
            </div>
            <div ref={bottomRef} />
          </div>

          {/* Acciones de contacto */}
          <div className="px-3 py-2 border-t border-gray-100 flex gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={mailLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-dark transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Correo
            </a>
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) sendBot(input.trim())
              }}
              placeholder="Escribe tu consulta..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
            <button
              type="button"
              onClick={() => input.trim() && sendBot(input.trim())}
              className="px-3 py-2 rounded-lg gradient-brand text-white text-sm font-medium hover:brightness-110 transition"
              aria-label="Enviar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Estilos de impresión */}
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
