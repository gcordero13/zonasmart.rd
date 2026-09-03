import { sendEmail, corsHeaders, jsonResponse } from '../_shared/resend.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, name, referrerCode, storeName } = await req.json()

    if (!to) {
      return jsonResponse({ error: 'Falta el destinatario (to).' }, 400)
    }

    const brand = storeName || 'ZonaSmart'

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;">
        <h1 style="font-size:24px;margin:0 0 16px;color:#111827;">¡Bienvenido a ${brand}!</h1>
        <p style="font-size:16px;line-height:1.6;color:#374151;">
          Hola${name ? ` ${name}` : ''},
        </p>
        <p style="font-size:16px;line-height:1.6;color:#374151;">
          Te damos la bienvenida a la plataforma como <strong>vendedor</strong>. Ya formas parte de
          ${brand} y puedes empezar a ganar comisiones por cada venta que se haga a través de tu código de referido.
        </p>
        ${
          referrerCode
            ? `<p style="font-size:16px;line-height:1.6;color:#374151;">
            Tu código de referido es: <strong style="font-size:18px;color:#f59e0b;">${referrerCode}</strong>. Compártelo para empezar a ganar.
          </p>`
            : ''
        }
        <p style="font-size:14px;line-height:1.6;color:#6b7280;margin-top:24px;">
          Tu cuenta de vendedor aún debe ser aprobada por el administrador antes de generar comisiones.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#6b7280;">
          Si tienes dudas, escríbenos y con gusto te ayudamos.
        </p>
      </div>
    `

    await sendEmail({
      to,
      subject: `¡Bienvenido a ${brand} como vendedor!`,
      html,
    })

    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Error al enviar el correo.' }, 500)
  }
})