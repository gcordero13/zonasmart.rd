# ZonaSmart — Tienda Online + Panel de Administración

Aplicación e-commerce construida con **React (Vite)**, **Supabase** y **React Router**.

## Características

- **Tienda online**: catálogo con búsqueda y filtro por categoría, detalle de producto, carrito de compras persistente (localStorage) y checkout.
- **Panel de administración** (`/admin`): resumen con métricas, gestión de productos (CRUD + subida de imágenes), pedidos y clientes.
- **Autenticación** con Supabase Auth (registro, inicio de sesión, cierre).
- **Almacenamiento** de imágenes de productos en Supabase Storage.

## Stack

- [Vite](https://vite.dev) + React 18
- [Tailwind CSS](https://tailwindcss.com) v4
- [Supabase](https://supabase.com) (`@supabase/supabase-js`)
- [React Router](https://reactrouter.com) v7

## Requisitos

- Node.js **≥ 20.19** (recomendado 22.x). El proyecto se creó con Node 20.11; ver nota abajo.
- Una cuenta y proyecto en [Supabase](https://supabase.com).

## Puesta en marcha

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno**

   Copia `.env.example` a `.env` y rellena con tus credenciales de Supabase
   (Dashboard → Settings → API):

   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<tu publishable key>
   ```

   > Estas dos variables son **públicas** y seguras de subir a GitHub.
   > **NUNCA** pongas aquí la `service_role` key (secreta) ni la subas al repositorio.

3. **Crear las tablas en Supabase**

   Abre el **SQL Editor** de tu proyecto y ejecuta:

   ```sql
   -- Tabla de productos
   create table if not exists public.products (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     description text,
     price numeric not null default 0,
     stock integer not null default 0,
     category text,
     image_url text,
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );

   -- Tabla de pedidos
   create table if not exists public.orders (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id),
     items jsonb not null default '[]',
     total numeric not null default 0,
     status text not null default 'pending'
       check (status in ('pending', 'paid', 'completed', 'cancelled')),
     created_at timestamptz not null default now()
   );

   -- Tabla de perfiles (para el panel de clientes)
   create table if not exists public.profiles (
     id uuid primary key references auth.users(id) on delete cascade,
     email text,
     name text,
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );

   -- Trigger: crea/actualiza el perfil automáticamente al registrar/actualizar un usuario
   create or replace function public.handle_new_user()
   returns trigger
   language plpgsql
   security definer set search_path = public
   as $$
   begin
     insert into public.profiles (id, email, name)
     values (
       new.id,
       new.email,
       coalesce(new.raw_user_meta_data->>'full_name', new.email)
     )
     on conflict (id) do update
       set email = excluded.email,
           name = excluded.name,
           updated_at = now();
     return new;
   end;
   $$;

   create or replace trigger on_auth_user_created
     after insert on auth.users
     for each row execute function public.handle_new_user();
   ```

4. **Configurar RLS (Row Level Security)**

   En **Authentication → Policies** o por SQL:

   ```sql
   alter table public.products enable row level security;
   alter table public.orders enable row level security;
   alter table public.profiles enable row level security;

   -- Productos: lectura pública, escritura solo autenticados (administración)
   create policy "Productos lectura pública" on public.products
     for select using (true);
   create policy "Productos escritura autenticados" on public.products
     for all using (auth.role() = 'authenticated');

   -- Pedidos: los usuarios ven sus propios pedidos; los autenticados pueden crear
   create policy "Ver mis pedidos" on public.orders
     for select using (auth.uid() = user_id);
   create policy "Crear pedidos" on public.orders
     for insert with check (auth.uid() = user_id);
   create policy "Actualizar pedidos" on public.orders
     for update using (auth.role() = 'authenticated');

   -- Perfiles: lectura de todos (panel de clientes), cada uno solo edita el suyo
   create policy "Ver perfiles" on public.profiles
     for select using (true);
   create policy "Editar mi perfil" on public.profiles
     for update using (auth.uid() = id);
   ```

5. **Crear bucket de imágenes**

   En **Storage → New Bucket** crea un bucket público llamado `product-images`.

6. **Marcar un usuario como admin**

   El panel `/admin` está protegido: solo usuarios con metadatos `role = "admin"`.
   Para habilitarlo, edita el usuario en **Authentication → Users → Edit**
   y añade `role: "admin"` en los metadatos.

## Ejecución

```bash
npm run dev      # entorno de desarrollo (http://localhost:5173)
npm run build    # build de producción
npm run preview  # previsualiza el build
npm run lint     # análisis de código con ESLint
```

## Rutas principales

| Ruta                | Descripción                                   |
| ------------------- | --------------------------------------------- |
| `/`                 | Inicio                                        |
| `/tienda`           | Catálogo con búsqueda y filtros               |
| `/producto/:id`     | Detalle de producto                           |
| `/carrito`          | Carrito de compras                            |
| `/checkout`         | Finalizar compra (crea pedido)                |
| `/login` `/registro`| Autenticación                                 |
| `/admin`            | Panel (requiere login + rol admin)            |

## Seguridad

- **No subas credenciales secretas** (`service_role`, claves de backend) al repositorio.
  La URL de proyecto y la `publishable key` son públicas por diseño.
- El panel de **Clientes** usa la tabla pública `profiles` y **no** requiere la clave secreta.
  Esto evita exponer el `service_role`.
- La pasarela de pagos (Stripe/PayPal) está pendiente de integrar; el checkout registra el pedido
  con estado `pending`.

## Notas técnicas

- El proyecto se inicializó con **Node v20.11**. La última versión de Supabase JS requiere Node ≥ 22;
  se instaló `@supabase/supabase-js@2.45.4` para compatibilidad. Se recomienda actualizar Node a 22.x.