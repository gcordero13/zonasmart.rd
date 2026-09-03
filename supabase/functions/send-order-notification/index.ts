import { sendEmail, corsHeaders, jsonResponse } from '../_shared/resend.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, customerName, trackingCode, total, shipping, status, items, storeName } = await req.json()

    if (!to) {
      return jsonResponse({ error: 'Falta el destinatario (to).' }, 400)
    }

    const brand = storeName || 'ZonaSmart'
    const itemRows = Array.isArray(items)
      ? items
          .map(
            (i) =>
              `<tr>
                <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;">${i.name || ''}</td>
                <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;text-align:center;">${i.quantity || 0}</td>
                <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;text-align:right;">$${Number(i.price || 0).toFixed(2)}</td>
              </tr>`
          )
          .join('')
      : ''

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;">
        <h1 style="font-size:22px;margin:0 0 8px;color:#111827;">Venta realizada en ${brand}</h1>
        <p style="font-size:15px;line-height:1.6;color:#374151;">
          Se registró una nueva venta con tu código de referido. ¡Buen trabajo!
        </p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Cliente</td>
            <td style="padding:6px 0;text-align:right;color:#111827;font-weight:600;">${customerName || '—'}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Código de pedido</td>
            <td style="padding:6px 0;text-align:right;color:#111827;font-weight:600;">${trackingCode || '—'}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Estado</td>
            <td style="padding:6px 0;text-align:right;color:#111827;font-weight:600;text-transform:capitalize;">${status || 'pendiente'}</td>
          </tr>
        </table>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
          <thead>
            <tr style="color:#6b7280;">
              <th style="text-align:left;padding:8px 0;">Producto</th>
              <th style="text-align:center;padding:8px 0;">Cant.</th>
              <th style="text-align:right;padding:8px 0;">Precio</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <table style="width:100%;margin-top:12px;font-size:15px;">
          <tr>
            <td style="padding:4px 0;color:#6b7280;">Subtotal</td>
            <td style="padding:4px 0;text-align:right;color:#111827;">$${Number(total || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6b7280;">Envío</td>
            <td style="padding:4px 0;text-align:right;color:#111827;">$${Number(shipping || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:700;color:#111827;">Total</td>
            <td style="padding:6px 0;text-align:right;font-weight:700;color:#111827;">$${Number(total || 0).toFixed(2)}</td>
          </tr>
        </table>
      </div>
    `

    await sendEmail({
      to,
      subject: `Nueva venta ${trackingCode ? `(${trackingCode})` : ''} · ${brand}`,
      html,
    })

    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Error al enviar el correo.' }, 500)
  }
})