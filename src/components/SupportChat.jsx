import { useEffect, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { fetchProducts } from '../services/products'

const WAIT_MS = 500

function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function findProductInList(products, text) {
  const t = normalize(text)
  return products.find((p) => normalize(p.name).split(/\s+/).some((w) => w.length > 3 && t.includes(w)))
}

function describeTotals(match, qty, wantInstall) {
  const price = Number(match.price || 0)
  const stock = Number(match.stock || 0)
  if (qty < 1) qty = 1
  if (stock <= 0) return `El ${match.name} está agotado por el momento.`
  const limited = qty > stock
  const useQty = Math.min(qty, stock)
  let total = price * useQty
  let msg = `El ${match.name} cuesta $${price.toFixed(2)} por unidad.\n`
  let instal = 0
  if (wantInstall && match.requires_installation) {
    instal = Number(match.installation_price || 0)
    total += instal
    msg += `Incluye instalación (+$${instal.toFixed(2)}).\n`
  } else if (wantInstall && !match.requires_installation) {
    msg += `Nota: este equipo no tiene instalación disponible.\n`
  }
  msg += `Por ${useQty} unidad(es): $${(price * useQty).toFixed(2)}`
  if (instal) msg += ` + $${instal.toFixed(2)} de instalación`
  msg += `.\nTotal: $${total.toFixed(2)}.`
  if (limited) {
    msg += `\nSolo tenemos ${stock} disponible(s). Si necesitas más, te paso con un agente de soporte.`
  } else if (useQty > 1) {
    msg += `\n¿Te hago una cotización formal? Usa el Cotizador para descargarla o dime y te asesoro.`
  }
  return msg
}

function buildBotReply(rawUser, products, lastProductName) {
  const text = normalize(rawUser)

  if (/hola|buenas|saludos|hey|hi/.test(text)) {
    return (
      'Hola! Soy el asistente de ZonaSmart 🙂\n\nPuedo ayudarte con:\n• Consultar equipos en existencia\n• Calcular cuánto saldría una cantidad de equipos\n• Cotizaciones con instalación\n• Pasarte con un agente de soporte'
    )
  }

  if (/existencias|disponible|en stock|tienen en|inventario|equipos/.test(text)) {
    return buildCatalogReplies(products)
  }

  const qtyMatch = text.match(/(\d+)/)
  const wantInstall = /instalac|instalar|puesta/.test(text)
  const wantQuote = /cotiz|costo|cuesta|cuanto|cuanto saldria|precio/.test(text)

  let match = findProductInList(products, text)

  // Si no mencionó un equipo por nombre pero habló de una cantidad,
  // recordamos el último equipo mencionado en la conversación.
  if (!match && qtyMatch && lastProductName) {
    match = products.find((p) => normalize(p.name) === normalize(lastProductName)) || null
  }

  if (match) {
    const stock = Number(match.stock || 0)
    if (qtyMatch) {
      const qty = parseInt(qtyMatch[1], 10)
      return describeTotals(match, qty, wantInstall)
    }
    return stock > 0
      ? `El ${match.name} está en existencia. Tenemos ${stock} disponible(s) y su precio es $${Number(match.price).toFixed(2)}.`
      : `El ${match.name} está agotado por el momento.`
  }

  if (/soporte|agente|humano|persona|asesor|ayuda|contacto/.test(text)) {
    return 'Con gusto te paso con un agente de soporte. Usa los botones de abajo para WhatsApp o correo y atenderemos tu consulta lo antes posible.'
  }

  return wantQuote
    ? 'Para calcular un total dime el equipo y la cantidad. Por ejemplo: "3 cámaras" o "cuánto saldrían 4 cámaras".'
    : 'Hola! ¿En qué puedo ayudarte?\n\n• Escribe el nombre de un equipo para saber si está en existencia.\n• Escribe una cantidad y el equipo para calcular (ej. "4 cámaras").\n• Escribe "existencias" para ver todos los productos disponibles.\n• Escribe "soporte" para hablar con un agente.'
}

function buildCatalogReplies(products) {
  const available = products.filter((p) => p.stock > 0)
  const lines = available.map((p) => `${p.name} — $${Number(p.price).toFixed(2)}`)
  return lines.length
    ? `Estos son los equipos disponibles en existencia:\n\n${lines.join('\n')}`
    : 'Actualmente no hay equipos en existencia. Pronto reponemos inventario.'
}

export default function SupportChat() {
  const { settings } = useStore()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [products, setProducts] = useState([])
  const [lastProductName, setLastProductName] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchProducts()
      .then((all) => setProducts(all))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, open])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: 'bot',
          text: 'Hola! 👋 Soy el asistente de ZonaSmart.\nPregúntame si un equipo está en existencia o escribe "existencias" para ver todos.',
        },
      ])
    }
  }, [open, messages.length])

  const sendBot = (text) => {
    setTyping(true)
    setMessages((m) => [...m, { from: 'user', text }])
    setInput('')
    setTimeout(() => {
      const found = findProductInList(products, text)
      const reply = buildBotReply(text, products, lastProductName)
      if (found) {
        setLastProductName(found.name)
      } else if (/soporte|agente|humano|persona|asesor/.test(normalize(text))) {
        setLastProductName(null)
      }
      setMessages((m) => [...m, { from: 'bot', text: reply }])
      setTyping(false)
    }, WAIT_MS + Math.random() * 500)
  }

  const waLink = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, necesito ayuda en ZonaSmart.')}`
    : '#'
  const mailLink = settings.email
    ? `mailto:${settings.email}?subject=${encodeURIComponent('Consulta en ZonaSmart')}`
    : '#'

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

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="gradient-brand px-4 py-3 text-white">
            <p className="font-semibold">Soporte ZonaSmart</p>
            <p className="text-xs text-white/80">Agente de soporte + asistente de existencias</p>
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
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400">
                  Escribiendo...
                </div>
              </div>
            )}
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
    </>
  )
}