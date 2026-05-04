# 📘 amadeostore.com.ar – Especificación del Proyecto

> Documento de visión, requisitos y seguimiento de desarrollo.

---

## 🎯 Visión

Plataforma de ventas online para pequeños/medianos negocios que **digitaliza el catálogo y automatiza pedidos vía WhatsApp**, sin integrar pasarelas de pago en la primera etapa.

---

## 👤 Actores

| Actor | Rol |
|-------|-----|
| Cliente | Usuario final que navega y compra |
| Admin | Dueño del negocio, gestiona contenido |

---

## 📊 Roadmap de Entregas

| Etapa | Descripción | Estado |
|-------|-------------|--------|
| **F0 – Setup** | Docker, Prisma, DB | ✅ Completado |
| **F1 – Catálogo** | Listar productos, detalle | 🔴 Pendiente |
| **F2 – Carrito** | Agregar, persistir, ver | 🔴 Pendiente |
| **F3 – WhatsApp** | Generar mensaje y redirigir | 🔴 Pendiente |
| **F4 – Admin** | Auth + CRUD productos | 🔴 Pendiente |
| **F5 – Config** | Ajustes de negocio | 🔴 Pendiente |

---

## 🗂️ Base de Datos (Prisma)

| Modelo | Descripción | Estado |
|--------|-------------|--------|
| `Product` | Catálogo con precio/stock | ✅ Implementado |
| `Category` | Categorías de productos | ✅ Implementado |
| `AdminUser` | Credenciales admin | ✅ Implementado |
| `Order` | (Opcional) tracking pedidos | ⏳ Decidir |
| `Settings` | Config negocio (WhatsApp, nombre, logo) | ✅ Implementado |

---

## 🧾 Historias de Usuario

### F1 – Catálogo de Productos

| ID | Historia | Criterios | Estado |
|----|----------|-----------|--------|
| US-01 | **Ver catálogo** – Como cliente quiero ver listado de productos con imagen, precio y descripción para elegir qué comprar | Productos activos, responsive | 🔴 Pendiente |
| US-02 | **Ver detalle** – Como cliente quiero ingresar a un producto para ver más info | Imagen ampliada, descripción, botón "Agregar al carrito" | 🔴 Pendiente |

### F2 – Carrito de Compras

| ID | Historia | Criterios | Estado |
|----|----------|-----------|--------|
| US-03 | **Agregar al carrito** – Como cliente quiero agregar productos al carrito para preparar mi pedido | Múltiples productos, modificar cantidad, eliminar, persistencia localStorage | 🔴 Pendiente |
| US-04 | **Visualizar carrito** – Como cliente quiero ver mi carrito para revisar antes de enviar | Lista, cantidades, subtotal/total, botón "Enviar pedido" | 🔴 Pendiente |

### F3 – Pedido por WhatsApp (Core)

| ID | Historia | Criterios | Estado |
|----|----------|-----------|--------|
| US-05 | **Enviar pedido** – Como cliente quiero enviar mi pedido por WhatsApp para concretar la compra | Mensaje auto-generado (lista, cantidades, total), redirección a `https://wa.me/<numero>?text=<mensaje>`, formato legible | � Pendiente |

**Formato mensaje:**
```
Hola, quiero realizar el siguiente pedido:

- 2x Zapatilla Nike Air ($50.000)
- 1x Remera Adidas ($20.000)

Total: $120.000

Nombre:
Dirección:
```

### F4 – Panel Administrador

| ID | Historia | Criterios | Estado |
|----|----------|-----------|--------|
| US-06 | **Login admin** – Como admin quiero iniciar sesión para gestionar el sistema | Email/contraseña, auth segura, rutas protegidas | � Pendiente |
| US-07 | **CRUD productos** – Como admin quiero crear/editar/eliminar productos para mantener el catálogo | CRUD completo, subida de imágenes, estado activo/inactivo | 🔴 Pendiente |
| US-08 | **Gestión de pedidos** – Como admin quiero ver pedidos recibidos para organizar ventas | **Decisión:** Opción A (sin DB) o B (con tracking) | ⏳ Pendiente |
| US-09 | **Configuración** – Como admin quiero configurar datos del negocio para personalizar la tienda | WhatsApp number, nombre, logo, mensaje base | 🔴 Pendiente |

---

## 🧠 Reglas de Negocio

1. Solo productos `activo=true` se muestran al público
2. Carrito funciona sin login (localStorage)
3. Pedidos se confirman fuera del sistema (WhatsApp)
4. Admin tiene control total de contenido

---

## ⚙️ Requisitos No Funcionales

- ⚡ SSR + SvelteKit (carga rápida)
- 📱 Mobile-first
- 🔐 Auth básica + validaciones
- 🐳 Dockerizado
- 🧱 Escalable

---

## 🚀 MVP Checklist

**Para lanzar:**
- [ ] Catálogo público
- [ ] Carrito funcional
- [ ] Botón WhatsApp con mensaje
- [ ] Panel admin (login + CRUD productos)

**Post-MVP:**
- [ ] Pagos online
- [ ] Usuarios registrados
- [ ] Tracking de pedidos (si se elige opción B)

---

## � Decisiones Pendientes

| Tema | Opción A | Opción B | Estado |
|------|----------|----------|--------|
| **Pedidos** | No guardar en DB (todo en WhatsApp) | Guardar con estados (pendiente/confirmado/entregado) | ⏳ Decidir |

---

## 📝 Notas de Desarrollo

- **2025-05-02:** Setup inicial con Docker, agregado modelo `Product` básico en Prisma
- **2025-05-03:** Agregado modelo `Category` con relación a `Product`, campos `isActive` en Product, seed de ejemplo creado
- **2025-05-03:** Agregado modelo `Settings` (storeName, whatsappNumber, logoUrl, welcomeMessage)
- **2025-05-03:** Agregado modelo `AdminUser` con bcrypt para password hashing, helper de auth creado

