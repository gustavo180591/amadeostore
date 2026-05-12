# Plan de Implementación - AmadeoStore

## Estado Actual del Proyecto

### ✅ Funcionalidades Completadas

#### 1. Infraestructura y Configuración

- [x] **Docker Compose** con 3 servicios (app, postgres, pgadmin)
- [x] **PostgreSQL 15** configurado y corriendo
- [x] **Prisma ORM** con schema completo
- [x] **Seed data** con datos iniciales
- [x] **SvelteKit 5** con TypeScript
- [x] **TailwindCSS** para estilos
- [x] **Testing** configurado (Playwright + Vitest)

#### 2. Catálogo de Productos

- [x] **Página principal** con coming soon animado
- [x] **Catálogo completo** (`/catalog`) con grid de productos
- [x] **Filtro por categorías** funcional
- [x] **Detalle de producto** (`/catalog/[id]`)
- [x] **Precios en ARS** con formato correcto
- [x] **Estado de stock** visual
- [x] **Contacto WhatsApp** básico

#### 3. Backend Services

- [x] **Autenticación de admin** (hash/verify bcrypt)
- [x] **Gestión de productos** (CRUD básico)
- [x] **Gestión de categorías**
- [x] **Settings de la tienda**

---

## 🚧 Funcionalidades por Implementar

### Fase 1: Panel de Administración (Prioridad Alta)

#### 1.1 Sistema de Login

- [ ] **Página de login** (`/admin/login`)
  - Formulario email/password
  - Validación de credenciales
  - Manejo de errores
  - Redirección al dashboard
- [ ] **Sesión de admin**
  - Cookies de sesión
  - Middleware de protección de rutas
  - Logout funcional

#### 1.2 Dashboard Principal

- [ ] **Layout de admin** (`/admin/+layout.svelte`)
  - Sidebar de navegación
  - Header con info de usuario
  - Logout button
- [ ] **Dashboard** (`/admin`)
  - Estadísticas básicas
  - Productos totales
  - Categorías totales
  - Últimos productos agregados

#### 1.3 Gestión de Productos

- [ ] **Listado de productos** (`/admin/products`)
  - Tabla con todos los productos
  - Buscador y filtros
  - Acciones (editar, eliminar, activar/desactivar)
- [ ] **Crear producto** (`/admin/products/new`)
  - Formulario completo
  - Upload de imagen
  - Selector de categoría
  - Validación de datos
- [ ] **Editar producto** (`/admin/products/[id]/edit`)
  - Formulario pre-cargado
  - Actualización de imagen
  - Manejo de cambios

#### 1.4 Gestión de Categorías

- [ ] **Listado de categorías** (`/admin/categories`)
  - Tabla con categorías
  - Contador de productos por categoría
- [ ] **Crear/Editar categoría**
  - Formulario name/slug
  - Validación de slug único

#### 1.5 Configuración de la Tienda

- [ ] **Settings** (`/admin/settings`)
  - Editar nombre de tienda
  - Configurar número de WhatsApp
  - Subir logo
  - Mensaje de bienvenida personalizado

### Fase 2: Carrito de Compras (Prioridad Alta)

#### 2.1 Sistema de Carrito

- [ ] **Store de carrito** (Svelte stores)
  - Agregar productos al carrito
  - Modificar cantidades
  - Eliminar productos
  - Calcular totales
- [ ] **Persistencia de carrito**
  - LocalStorage para mantener carrito
  - Sincronización entre pestañas

#### 2.2 Interfaz de Carrito

- [ ] **Carrito flotante** o sidebar
  - Icono con contador de items
  - Vista previa de productos
  - Botón de ir al checkout
- [ ] **Página de carrito** (`/cart`)
  - Listado completo de items
  - Modificación de cantidades
  - Resumen de precios
  - Botón de checkout

#### 2.3 Integración con Catálogo

- [ ] **Botón "Agregar al carrito" funcional**
  - Animación de agregado
  - Feedback visual
  - Actualización del contador

### Fase 3: Checkout y Pedidos (Prioridad Media)

#### 3.1 Formulario de Checkout

- [ ] **Página de checkout** (`/checkout`)
  - Formulario de datos del cliente
  - Validación en tiempo real
  - Resumen del pedido
- [ ] **Procesamiento del pedido**
  - Creación de orden en la base de datos
  - Generación de número de pedido
  - Confirmación al cliente

#### 3.2 Gestión de Pedidos

- [ ] **Modelo de datos para pedidos**
  - Order, OrderItem, Customer
- [ ] **Panel de admin para pedidos**
  - Listado de pedidos
  - Estados (pendiente, confirmado, enviado, entregado)
  - Detalles del pedido

#### 3.3 Integración WhatsApp Mejorada

- [ ] **Mensaje automático personalizado**
  - Incluir detalles del pedido
  - Formato profesional
  - Confirmación automática

### Fase 4: Mejoras y Funcionalidades Adicionales (Prioridad Baja)

#### 4.1 Búsqueda y Filtrado Avanzado

- [ ] **Búsqueda de productos**
  - Búsqueda en tiempo real
  - Búsqueda por nombre y descripción
- [ ] **Ordenamiento**
  - Por precio (asc/desc)
  - Por nombre
  - Por más vendidos
- [ ] **Paginación**
  - Para catálogo grande
  - Lazy loading opcional

#### 4.2 Galería de Imágenes

- [ ] **Múltiples imágenes por producto**
  - Upload de varias imágenes
  - Galería con zoom
  - Imagen principal seleccionable

#### 4.3 Sistema de Calificaciones

- [ ] **Calificaciones de productos**
  - Sistema de estrellas
  - Reseñas de clientes
  - Promedio de calificaciones

#### 4.4 Optimizaciones

- [ ] **SEO mejorado**
  - Meta tags dinámicos
  - Sitemap automático
  - Open Graph para redes sociales
- [ ] **Performance**
  - Optimización de imágenes
  - Lazy loading
  - Caching estratégico

---

## 🛠️ Detalles Técnicos por Implementar

### Base de Datos (Prisma Schema)

```typescript
// Modelos por agregar:
model Order {
  id          String    @id @default(cuid())
  orderNumber String    @unique
  customerName String
  customerEmail String
  customerPhone String
  total       Decimal
  status      OrderStatus @default(PENDING)
  items       OrderItem[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model OrderItem {
  id         String  @id @default(cuid())
  orderId    String
  productId  String
  quantity   Int
  unitPrice  Decimal
  order      Order   @relation(fields: [orderId], references: [id])
  product    Product @relation(fields: [productId], references: [id])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Estructura de Archivos por Crear

```
src/routes/admin/
├── +layout.svelte
├── +page.svelte (dashboard)
├── login/
│   └── +page.svelte
├── products/
│   ├── +page.svelte
│   ├── new/
│   │   └── +page.svelte
│   └── [id]/
│       └── edit/
│           └── +page.svelte
├── categories/
│   ├── +page.svelte
│   └── new/
│       └── +page.svelte
├── orders/
│   └── +page.svelte
└── settings/
    └── +page.svelte

src/routes/
├── cart/
│   └── +page.svelte
├── checkout/
│   └── +page.svelte
└── order/
    └── [id]/
        └── +page.svelte

src/lib/
├── stores/
│   ├── cart.ts
│   └── auth.ts
├── server/
│   ├── orders.ts
│   └── upload.ts
└── components/
    ├── admin/
    │   ├── Sidebar.svelte
    │   ├── ProductForm.svelte
    │   └── CategoryForm.svelte
    └── cart/
        ├── CartItem.svelte
        └── CartSummary.svelte
```

---

## 📅 Cronograma Sugerido

### Semana 1-2: Panel de Administración

- [ ] Login y autenticación
- [ ] Dashboard y layout
- [ ] CRUD de productos
- [ ] CRUD de categorías

### Semana 3: Carrito de Compras

- [ ] Store de carrito
- [ ] Interfaz de carrito
- [ ] Integración con catálogo

### Semana 4: Checkout y Pedidos

- [ ] Formulario de checkout
- [ ] Procesamiento de pedidos
- [ ] Panel de admin para pedidos

### Semana 5-6: Mejoras Adicionales

- [ ] Búsqueda y filtrado
- [ ] Galería de imágenes
- [ ] Optimización y SEO

---

## 🎯 Prioridades de Desarrollo

1. **MVP Mínimo**: Panel admin + Carrito básico
2. **Funcional**: Checkout completo + Gestión de pedidos
3. **Optimizado**: Búsqueda + Mejoras UX
4. **Completo**: Calificaciones + SEO avanzado

---

## 📝 Notas Importantes

- **Testing**: Cada nueva funcionalidad debe incluir tests unitarios y E2E
- **Responsive**: Todo debe ser mobile-first
- **Accessibility**: Seguir WCAG 2.1 AA
- **Performance**: Optimizar para Core Web Vitals
- **Security**: Validar todos los inputs y sanitizar datos

---

## 🔗 Recursos y Referencias

- **SvelteKit Docs**: https://kit.svelte.dev/
- **Prisma Docs**: https://www.prisma.io/docs/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Docker Compose**: https://docs.docker.com/compose/

---

_Última actualización: 12 de Mayo 2026_
