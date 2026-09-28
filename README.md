# MR Frontend

Frontend de la aplicación web de Manuel Romero, orientada a la venta de guitarras artesanales, gestión de pedidos, autenticación de usuarios y administración de stock.

Este proyecto está desarrollado con React + TypeScript y usa routing, contexto global, llamadas HTTP al backend e integración con Stripe para la compra.

## 1. Visión general

La aplicación permite:

- Ver el catálogo de guitarras disponibles
- Consultar detalles de cada guitarra
- Añadir productos al carrito local
- Registrarse e iniciar sesión
- Gestionar dirección de entrega
- Realizar pedidos y seguir el estado de compra
- Acceder a una vista de administración para gestionar stock y pedidos
- Integrar OAuth2 y autenticación basada en sesión/cookies

La estructura trata al frontend como una capa cliente que consume el backend REST y se comunica con el servidor mediante cookies y token CSRF.

## 2. Stack tecnológico

- React 19
- TypeScript
- React Router DOM
- Tailwind CSS
- Create React App (react-scripts)
- Stripe React SDK
- Fetch nativo para peticiones HTTP
- Context API para estado global

## 3. Funcionalidades principales

### Autenticación y autorización

El proyecto implementa gestión de sesión con `AuthContext` y rutas protegidas por rol:

- `CLIENTE`
- `ADMIN`

Se gestionan los siguientes flujos:

- Login con email y contraseña
- Registro de usuario
- Logout
- Recuperación del usuario autenticado desde el backend
- Redirección OAuth2 tras autenticación externa
- Guardas de navegación según autenticación y rol

### Catálogo y detalle de guitarras

- Listado del stock de guitarras
- Vista individual por guitarra
- Carga de imágenes asociadas a cada producto
- Acceso rápido a crear guitarra para administradores

### Carrito de compra

- Carrito persistido en localStorage
- Añadir artículos
- Modificar cantidades
- Eliminar líneas del carrito
- Cálculo de número total de unidades

### Pedidos y checkout

- Compra con flujo de checkout basado en Stripe
- Páginas de éxito y cancelación
- Gestión del pedido desde la cuenta del cliente
- Vista de administración de pedidos

### Administración

Los usuarios con rol `ADMIN` tienen acceso a funciones de gestión:

- Alta de guitarras
- Panel administrativo
- Gestión de pedidos

## 4. Estructura del proyecto

```text
mr_frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   └── Header.tsx
│   ├── config/
│   │   └── enviroment.ts
│   ├── contexts/
│   │   ├── auth/
│   │   └── cart/
│   ├── modules/
│   │   ├── auth/
│   │   ├── direcciones/
│   │   ├── guitarras/
│   │   └── ventas/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CarritoPage.tsx
│   │   ├── MiCuentaPage.tsx
│   │   └── ...
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── utils/
│   │   └── api.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── index.css
│   └── App.test.tsx
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .gitignore
└── README.md
```

## 5. Componentes y módulos clave

### `src/index.tsx`

Es el punto de entrada de la aplicación. Aquí se monta la app en el DOM y se configuran providers globales:

- `BrowserRouter`
- `AuthProvider`
- `CartProvider`

### `src/routes/AppRoutes.tsx`

Define la navegación principal. Incluye:

- rutas públicas
- rutas protegidas para usuarios autenticados
- rutas restringidas por rol
- redirecciones legacy (`/cart`, `/complete`)
- fallback por ruta no encontrada

### `src/contexts/auth/AuthContext.tsx`

Contexto principal de autenticación.

Responsabilidades:

- Obtener el usuario logeado desde el backend
- Guardar el estado del usuario en memoria
- Exponer `login`, `register`, `logout`, `refreshSession`
- Determinar si el usuario está autenticado
- Controlar `isLoading`

### `src/contexts/cart/CartContext.tsx`

Contexto del carrito.

Responsabilidades:

- Mantener productos en estado
- Persistir el carrito en `localStorage`
- Añadir, quitar y actualizar cantidades
- Exponer el total de unidades

### `src/utils/api.ts`

Capa HTTP compartida para todas las llamadas al backend.

Incluye:

- manejo de cookies para XSRF
- persistencia del token CSRF
- `credentials: "include"`
- recuperación automática del token desde cookie o almacenamiento local
- helper `apiFetchJson`

### `src/config/enviroment.ts`

Archivo central de configuración de endpoint del backend.

En desarrollo apunta a:

- `http://localhost:8080`

En producción a:

- `https://mybeapp.herokuapp.com`

Además, define la URL de redirección OAuth2:

- `http://localhost:3000/oauth2/redirect`
- `https://myfeapp.herokuapp.com/oauth2/redirect`

## 6. Rutas principales

La aplicación usa un conjunto de rutas organizadas por contexto y permisos.

### Públicas

- `/` — Home
- `/login` — Inicio de sesión
- `/registro` — Registro
- `/oauth2/redirect` — Callback de autenticación OAuth2
- `/nuestra-historia` — Historia de la marca
- `/contacto` — Contacto
- `/guitarra/stock` — Catálogo de guitarras
- `/guitarra/:id` — Detalle de guitarra
- `/carrito` — Carrito
- `/checkout/success` — Compra completada
- `/checkout/cancelled` — Compra cancelada

### Protegidas para usuarios autenticados

- `/mi-cuenta`
- `/mi-cuenta/mis-pedidos`
- `/mi-cuenta/mis-pedidos/:id`
- `/mi-cuenta/mis-direcciones`
- `/mis-direcciones`

### Protegidas para administradores

- `/guitarra/crear`
- `/admin/panel`
- `/admin/pedidos`
- `/admin/pedidos/:id`

## 7. Autenticación y sesión

El frontend asume que el backend expone endpoints para:

- login
- logout
- registro
- usuario autenticado

La lógica principal se encuentra en:

- `src/modules/auth/services/auth.service.ts`
- `src/modules/auth/types/auth.ts`

El flujo que sigue la app es:

1. El usuario hace login
2. El backend responde y establece la sesión/cookie
3. `AuthContext` llama a `getLoggedUser()`
4. El usuario queda disponible globalmente para toda la UI
5. Las rutas protegidas comprueban `isAuthenticated` y el rol del usuario

## 8. Integración con Stripe

La app usa `@stripe/react-stripe-js` y `@stripe/stripe-js` para flujo de pago.

La lógica de checkout y confirmación se encuentra en los módulos de ventas y páginas de éxito/cancelación. La frontend se encarga de:

- presentar la experiencia de compra
- redirigir al usuario tras éxito o cancelación
- coordinar con el backend para la confirmación del pedido

## 9. Gestión del estado

El estado global se centraliza con `Context API`:

- `AuthProvider` para autenticación
- `CartProvider` para carrito

Esto evita pasar props complejas entre rutas y componentes.

## 10. Estilos y diseño visual

El proyecto usa Tailwind CSS para la capa visual de la interfaz.

Archivos relevantes:

- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css`

El diseño actual sigue una estética artesanal, con tonos cálidos, claros y branding ligado a la marca Manuel Romero.

## 11. Scripts disponibles

En la raíz del proyecto puedes ejecutar:

```bash
npm install
npm start
```

### `npm start`

Inicia la aplicación en modo desarrollo.

Abre en:

`http://localhost:3000`

### `npm run build`

Genera la build de producción en la carpeta `build`.

### `npm test`

Ejecuta el entorno de pruebas de React.

## 12. Variables y configuración de entorno

El proyecto usa una configuración central en:

- `src/config/enviroment.ts`

Si necesitas adaptar la app a otro backend o entorno, ajusta:

- `API_BASE_URL`
- `OAUTH2_REDIRECT_URI`

## 13. Requisitos para ejecutar localmente

Necesitarás:

- Node.js 18 o superior
- npm
- backend corriendo en `http://localhost:8080` o ajustar la configuración

Pasos:

```bash
npm install
npm start
```

## 14. Observaciones de arquitectura

- La app está pensada para funcionar como frontend de un backend Java/Spring (o similar), ya que usa cookies + CSRF + endpoints REST.
- El carrito se persiste localmente en el navegador, lo que evita depender del backend para una experiencia de compra básica.
- La seguridad de sesión se gestiona principalmente en el backend, pero la capa cliente también implementa validación y reintentos de autenticación.
- El enrutado y permisos están definidos centralmente en `AppRoutes.tsx`, lo que facilita la gestión de accesos por perfil.

## 15. Buenas prácticas del proyecto

- Separación por módulos funcionales (`auth`, `guitarras`, `ventas`, `direcciones`)
- Uso de tipos TypeScript para DTOs y entidades del frontend
- Contextos para estado global reutilizable
- Capa `utils/api.ts` para centralizar peticiones y XSRF
- Rutas diferenciadas para acceso público versus autenticado

## 16. Conclusión

Este frontend está orientado a una experiencia de e-commerce artesanal con estructura modular y manejo de sesiones, stock, pedidos, administración y checkout. Es una aplicación React moderna, con una base clara para crecer en funcionalidad o conectarse a un backend más complejo sin romper la capa cliente.
