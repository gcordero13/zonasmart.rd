# Sistema de correos electrónicos (Supabase Edge Functions + Resend)

Este proyecto incluye dos funciones de correo (Edge Functions) que usan el servicio
[Resend](https://resend.com) para enviar emails de verdad:

1. **`send-seller-welcome`** — Correo de bienvenida al crear un vendedor.
2. **`send-order-notification`** — Copia de cada venta al vendedor con el código de referido.

## 1. Configurar Resend

1. Crea una cuenta en https://resend.com
2. Ve a **API Keys** y crea una nueva clave.
3. (Recomendado) Agrega y verifica tu dominio en **Domains** para poder usar
   `FROM_EMAIL` con tu dominio (ej. `ventas@tuempresa.com`).
   - Sin dominio verificado, solo puedes enviar desde `onboard@resend.dev`, que es
     el valor por defecto si no defines `FROM_EMAIL`.

## 2. Instalar el CLI de Supabase (una vez)

```bash
# Puedes usar npx sin instalación global
npx supabase@latest --version
```

## 3. Logearte y conectar el proyecto

```bash
npx supabase@latest login
npx supabase@latest link --project-ref TU_PROJECT_REF
```

El `TU_PROJECT_REF` es la parte corta de tu URL de Supabase
(para `https://hyzmviguzipqqluzjujc.supabase.co` sería `hyzmviguzipqqluzjujc`).

## 4. Configurar los secretos

```bash
npx supabase@latest secrets set RESEND_API_KEY=re_xxxxxxxx
npx supabase@latest secrets set FROM_EMAIL="ventas@tuempresa.com"
```

## 5. Desplegar las funciones

```bash
npx supabase@latest functions deploy send-seller-welcome
npx supabase@latest functions deploy send-order-notification
```

## 6. Verificar

Cuando crees un vendedor en el panel, debería llegarle el correo de bienvenida.
Cuando un cliente compre con el código de referido de un vendedor, a ese vendedor
le llegará la copia de la venta.

## Nota importante

- Si las tablas/columnas nuevas no existen, ejecuta primero estos SQL en el SQL Editor:
  - `supabase-migration-finanzas-productos.sql`
  - `supabase-migration-servicios-instalacion.sql`
- Las funciones solo se disparan desde la app del lado del cliente; si el cliente
  cierra el navegador antes de completar la compra no se envían. Para un envío más
  robusto (con trigger de base de datos) se podría añadir una Edge Function disparada
  por webhook/trigger, pero este enfoque es suficiente para este alcance.