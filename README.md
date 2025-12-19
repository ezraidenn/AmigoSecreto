# Amigo Secreto 🎁

Aplicación web para organizar intercambios de regalos (Secret Santa) de manera simple y segura.

## Stack Tecnológico

- **Next.js 14+** (App Router) + TypeScript
- **TailwindCSS** + **shadcn/ui** (Radix)
- **Framer Motion** para animaciones
- **Prisma ORM** con PostgreSQL (Neon)
- **Zod** para validación
- **bcryptjs** para hash de contraseñas
- **Sonner** para notificaciones

## Requisitos

- Node.js 18+ (recomendado 20+)
- Cuenta en [Neon](https://neon.tech) (base de datos PostgreSQL)
- Cuenta en [Vercel](https://vercel.com) (para deploy)

## Setup Local

### 1. Clonar e instalar dependencias

```bash
git clone <tu-repo>
cd amigo-secreto-app
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
APP_URL=http://localhost:3000
SESSION_COOKIE_NAME=as_session
SESSION_TTL_DAYS=30
INVITE_CODE_LENGTH=8
```

### 3. Crear base de datos en Neon

1. Ve a [neon.tech](https://neon.tech) y crea un proyecto
2. Copia la cadena de conexión "pooled" 
3. Pégala en `DATABASE_URL` de tu `.env`

### 4. Ejecutar migraciones

```bash
npx prisma migrate dev --name init
```

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy en Vercel

### 1. Importar proyecto

1. Ve a [vercel.com](https://vercel.com) y haz "Add New Project"
2. Importa tu repositorio de GitHub

### 2. Configurar variables de entorno

En la configuración del proyecto en Vercel, agrega:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Tu cadena de conexión de Neon |
| `APP_URL` | `https://tu-dominio.vercel.app` |
| `SESSION_COOKIE_NAME` | `as_session` |
| `SESSION_TTL_DAYS` | `30` |
| `INVITE_CODE_LENGTH` | `8` |

### 3. Ejecutar migraciones en producción

Después del primer deploy, ejecuta:

```bash
npx prisma migrate deploy
```

O configura un script de build que incluya las migraciones.

## Características

- ✅ Registro/Login con sesiones seguras (cookies HttpOnly)
- ✅ Crear grupos con código de invitación único
- ✅ Unirse a grupos con código
- ✅ Ver miembros del grupo (sin exponer emails)
- ✅ Sorteo automático (solo el dueño puede iniciarlo)
- ✅ Cada usuario ve solo su asignación
- ✅ UI premium estilo Apple, responsive
- ✅ Animaciones suaves con Framer Motion

## Casos de Prueba Manual

1. **Registro + Login + Logout**
   - Crear cuenta → Redirige a dashboard
   - Cerrar sesión → Redirige a login
   - Iniciar sesión → Redirige a dashboard

2. **Grupos**
   - Crear grupo → Genera código de invitación
   - Copiar código → Se copia al portapapeles
   - Unirse con código → Se agrega al grupo

3. **Sorteo**
   - Solo el dueño ve el botón "Iniciar sorteo"
   - Requiere mínimo 3 miembros
   - Después del sorteo, cada usuario ve su asignación
   - El botón se deshabilita después de sortear
   - Refresh no cambia la asignación (persistente)

4. **Seguridad**
   - Miembro no-owner no puede iniciar sorteo
   - Usuario no puede ver grupos donde no es miembro
   - Emails nunca se muestran en la UI

## Troubleshooting

### Prisma Client Issues

Si ves errores de Prisma Client:

```bash
npx prisma generate
```

### Conexión a Neon

- Usa la cadena de conexión "pooled" para mejor rendimiento
- Asegúrate de incluir `?sslmode=require` en la URL

### Build Errors

```bash
npm run build
```

Si hay errores de TypeScript, revisa que todas las dependencias estén instaladas.

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/          # Landing page
│   ├── auth/              # Login, Register
│   └── app/               # Rutas protegidas
│       ├── dashboard/     # Lista de grupos
│       └── group/[id]/    # Detalle de grupo
├── components/
│   ├── ui/                # Componentes shadcn
│   ├── app/               # Componentes de la app
│   └── motion.tsx         # Wrapper de animaciones
├── lib/
│   ├── auth/              # Sesiones, passwords, crypto
│   ├── groups/            # Lógica de grupos
│   ├── draw/              # Lógica del sorteo
│   ├── validations/       # Schemas Zod
│   ├── prisma.ts          # Cliente Prisma
│   └── utils.ts           # Utilidades
├── middleware.ts          # Protección de rutas
└── prisma/
    └── schema.prisma      # Modelos de DB
```

## Licencia

MIT
