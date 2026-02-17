# Inventory Management Platform

Aplicación de inventario construida con el App Router de Next.js 16, React 19 y Better Auth. El objetivo es ofrecer una experiencia fluida para administrar productos, sesiones y flujos OAuth mientras se integran dashboards personalizados.

## Stack principal

- **Next.js 16 / React 19** – App Router, Server & Client Components.
- **Better Auth** – autenticación por email/contraseña y proveedores sociales (Google/GitHub).
- **Prisma 7 + Neon (PostgreSQL)** – ORM y base de datos.
- **Tailwind / Geist** – estilos y tipografías.

## Características

1. Flujo de registro e inicio de sesión con callbacks hacia `/dashboard`.
2. Proveedores sociales listos para configurar (Google, GitHub).
3. API `/auth` expuesta mediante `better-auth/next-js`.
4. Prisma Client generado dentro de `lib/generated/prisma` con esquema para usuarios, sesiones, cuentas y verificaciones.
5. Navegación adaptable que muestra acciones según el estado de sesión.

## Requisitos previos

- Node.js 20+ y npm.
- Cuenta en PostgreSQL (Neon) y credenciales OAuth si se requiere login social.

## Variables de entorno

Crear un archivo `.env` (no versionado) con al menos:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> Mantén vacíos los ID/Secret si aún no configuraste los proveedores; Better Auth los deshabilitará automáticamente.

## Instalación

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Próximos pasos

- Integrar la lógica completa de inventario (productos, stock, tareas).
- Conectar el front con APIs protegidas mediante `auth.api`.
- Mejorar la UI con componentes reutilizables (tabs, cards, etc.).
