# Implementación - AmadeoStore

## Objetivo actual

Convertir la ruta raíz `/` de **AmadeoStore** en la vista pública real que debe ver el cliente comprador.

Actualmente la home muestra una pantalla tipo **coming soon**. Esa pantalla debe ser reemplazada por una tienda pública completa, moderna y funcional, reutilizando el catálogo, productos, categorías y configuración ya existentes.

La URL principal del proyecto es:

```bash
http://localhost:5174/
```

Al ingresar a esa URL, el cliente debe ver una tienda online pública, no el panel administrador ni una página temporal.

---

## Estado actual del proyecto

### Funcionalidades ya implementadas

#### Infraestructura

- Docker Compose con servicios:
  - `app`
  - `postgres`
  - `pgadmin`
- PostgreSQL 15 configurado.
- Prisma ORM configurado.
- Migraciones aplicadas.
- Seed data inicial.
- SvelteKit con TypeScript.
- TailwindCSS.
- Testing configurado con Playwright y Vitest.

#### Catálogo público

- Página de catálogo en `/catalog`.
- Filtro por categorías.
- Detalle de producto en `/catalog/[id]`.
- Precios en ARS.
- Estado visual de stock.
- Contacto básico por WhatsApp.

#### Backend y datos

- Prisma schema funcional.
- Modelos de productos y categorías.
- Settings de tienda.
- Modelos de pedidos agregados:
  - `Order`
  - `OrderItem`
  - `CartItem`
- Migraciones aplicadas en base de datos.

#### Administración

- Login admin parcialmente implementado en `/admin/login`.
- Layout admin parcialmente implementado en `/admin/+layout.svelte`.
- Panel administrador reservado para `/admin`.

---

## Prioridad de implementación

La prioridad actual es:

1. Reemplazar la home temporal.
2. Mostrar la tienda pública en `/`.
3. Reutilizar productos y categorías ya existentes.
4. Implementar carrito básico.
5. Integrar checkout por WhatsApp.
6. Mantener separado el panel administrador en `/admin`.

---

# Fase 1 - Home pública del cliente

## Objetivo

La ruta `/` debe mostrar una página comercial pública para el cliente comprador.

No debe mostrar:

- Coming soon.
- Login admin.
- Dashboard.
- Métricas internas.
- Opciones administrativas.

Debe mostrar:

- Header público.
- Hero comercial.
- Productos destacados.
- Categorías.
- Beneficios.
- Botón de WhatsApp.
- Footer.
- Acceso al carrito.

---

## Archivos a revisar

Antes de modificar, revisar:

```txt
src/routes/+page.svelte
src/routes/+page.server.ts
src/routes/+layout.svelte
src/routes/catalog/+page.svelte
src/routes/catalog/[id]/+page.svelte
src/lib/components
src/lib/stores
src/lib/server
src/routes/admin
```

---

## Archivos sugeridos a crear

```txt
src/lib/components/public/
├── PublicHeader.svelte
├── HeroSection.svelte
├── ProductCard.svelte
├── ProductGrid.svelte
├── CategorySection.svelte
├── BenefitsSection.svelte
├── CartDrawer.svelte
├── WhatsAppButton.svelte
└── PublicFooter.svelte
```

También crear, si no existen:

```txt
src/lib/stores/
└── cart.ts

src/routes/cart/
└── +page.svelte
```

---

# Fase 2 - Estructura de la home

## Ruta principal

Archivo principal:

```txt
src/routes/+page.svelte
```

La home debe estar compuesta por secciones reutilizables:

```svelte
<PublicHeader />
<HeroSection />
<CategorySection />
<ProductGrid />
<BenefitsSection />
<PublicFooter />
<CartDrawer />
```

---

## Header público

El header debe incluir:

- Logo de AmadeoStore.
- Uso de `/logo.png` si existe.
- Nombre de la tienda.
- Links principales:
  - Inicio
  - Catálogo
  - Categorías
  - Contacto
- Botón de WhatsApp.
- Botón o ícono de carrito.
- Contador de productos en carrito.
- Menú responsive para mobile.

El header no debe compartir estilos visuales con el admin.

---

## Hero principal

El hero debe incluir:

- Título comercial atractivo.
- Subtítulo orientado a venta.
- Botón principal:

```txt
Ver catálogo
```

- Botón secundario:

```txt
Consultar por WhatsApp
```

- Imagen, ilustración o bloque visual decorativo.
- Diseño moderno, limpio y confiable.

Ejemplo de copy sugerido:

```txt
Todo lo que necesitás, en un solo lugar
```

```txt
Explorá productos seleccionados, consultá disponibilidad y realizá tu pedido de forma rápida por WhatsApp.
```

---

## Productos destacados

La sección debe mostrar productos reales desde la base de datos.

Prioridad:

1. Reutilizar la lógica existente de `/catalog`.
2. Consultar productos con Prisma desde `+page.server.ts`.
3. Usar fallback mock solo si no hay datos disponibles.

Cada producto debe mostrar:

- Imagen o placeholder.
- Nombre.
- Categoría.
- Precio en ARS.
- Estado de stock.
- Botón `Ver producto`.
- Botón `Agregar al carrito`.
- Botón `Consultar`.

---

## Categorías destacadas

La sección debe mostrar categorías reales desde la base de datos.

Cada categoría debe enlazar al catálogo filtrado.

Ejemplo:

```txt
/catalog?category=zapatillas
/catalog?category=ofertas
/catalog?category=destacados
```

Si el filtrado por query param todavía no está implementado, dejar la estructura preparada.

---

## Beneficios

Agregar una sección de confianza comercial.

Ejemplos:

- Atención personalizada por WhatsApp.
- Compra rápida y simple.
- Productos seleccionados.
- Coordinación de entrega.
- Catálogo actualizado.

---

## Footer público

El footer debe incluir:

- Nombre de la tienda.
- WhatsApp.
- Links útiles.
- Contacto.
- Texto legal simple.

Ejemplo:

```txt
© 2026 AmadeoStore. Todos los derechos reservados.
```

---

# Fase 3 - Carrito de compras

## Store del carrito

Crear o completar:

```txt
src/lib/stores/cart.ts
```

El store debe permitir:

- Agregar productos.
- Aumentar cantidad.
- Disminuir cantidad.
- Eliminar producto.
- Vaciar carrito.
- Calcular subtotal.
- Calcular total de items.
- Persistir en `localStorage`.
- Evitar errores SSR usando `browser` desde `$app/environment`.

---

## Estructura mínima del item

```ts
export type CartItem = {
	id: string;
	name: string;
	price: number;
	image?: string | null;
	quantity: number;
	stock?: number | null;
};
```

---

## Funciones necesarias

```ts
addToCart(product);
removeFromCart(productId);
increaseQuantity(productId);
decreaseQuantity(productId);
clearCart();
getCartTotal();
getCartItemsCount();
```

---

## Persistencia

El carrito debe guardarse en:

```txt
localStorage
```

Clave sugerida:

```txt
amadeostore-cart
```

---

# Fase 4 - Interfaz del carrito

## Carrito flotante o drawer

Crear:

```txt
src/lib/components/public/CartDrawer.svelte
```

Debe mostrar:

- Productos agregados.
- Cantidad de cada producto.
- Botón sumar.
- Botón restar.
- Botón eliminar.
- Subtotal.
- Botón ver carrito.
- Botón finalizar por WhatsApp.

---

## Página de carrito

Crear:

```txt
src/routes/cart/+page.svelte
```

Debe incluir:

- Header público.
- Lista completa de productos.
- Cantidades editables.
- Total.
- Botón para vaciar carrito.
- Botón para seguir comprando.
- Botón para finalizar pedido por WhatsApp.

---

# Fase 5 - WhatsApp checkout

## Objetivo

Permitir que el cliente finalice el pedido por WhatsApp.

El sistema debe generar un mensaje automático con:

- Saludo.
- Lista de productos.
- Cantidad.
- Precio unitario.
- Subtotal por producto.
- Total.
- Consulta de disponibilidad y entrega.

---

## Mensaje sugerido

```txt
Hola, quiero hacer el siguiente pedido en AmadeoStore:

- Producto 1 x2 - $10.000
- Producto 2 x1 - $5.000

Total: $25.000

¿Me confirmás disponibilidad y forma de entrega?
```

---

## URL de WhatsApp

La URL debe generarse con `encodeURIComponent`.

Ejemplo:

```ts
const message = encodeURIComponent(orderMessage);
const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
```

---

## Configuración del número

El número de WhatsApp debe tomarse en este orden:

1. Settings de la tienda, si ya existe.
2. Constante centralizada.
3. Fallback temporal.

Archivo sugerido:

```txt
src/lib/config/store.ts
```

Ejemplo:

```ts
export const STORE_CONFIG = {
	name: 'AmadeoStore',
	whatsapp: '5490000000000'
};
```

---

# Fase 6 - Integración con catálogo existente

## Objetivo

No duplicar lógica innecesaria.

Reutilizar:

- Queries de productos.
- Queries de categorías.
- Formateo de precios.
- Componentes existentes si ya están bien implementados.
- Servicios de Prisma existentes.

---

## Rutas que no deben romperse

Estas rutas deben seguir funcionando:

```txt
/catalog
/catalog/[id]
/admin
/admin/login
```

---

# Fase 7 - Diseño visual

## Requisitos

El diseño debe ser:

- Mobile-first.
- Responsive.
- Moderno.
- Comercial.
- Limpio.
- Claro.
- Fácil de navegar.
- Con botones visibles.
- Con buena jerarquía visual.
- Con cards redondeadas.
- Con sombras suaves.
- Con estados hover.
- Accesible.

---

## TailwindCSS

Usar TailwindCSS para todos los estilos.

Evitar CSS innecesario salvo que el proyecto ya tenga una convención definida.

---

# Fase 8 - Accesibilidad

Cumplir criterios básicos:

- Botones con texto claro.
- Links accesibles.
- `alt` en imágenes.
- Buen contraste.
- Navegación usable en mobile.
- Estados focus visibles.
- No depender solo del color para indicar stock.

---

# Fase 9 - Testing manual

## Verificar home

Abrir:

```bash
http://localhost:5174/
```

Validar:

- Ya no aparece coming soon.
- Se ve una tienda pública.
- Se ve el logo.
- Se ven productos.
- Se ven categorías.
- Se puede ir al catálogo.
- Se puede abrir WhatsApp.
- Se puede agregar al carrito.

---

## Verificar catálogo

Abrir:

```bash
http://localhost:5174/catalog
```

Validar:

- El catálogo sigue funcionando.
- Los filtros siguen funcionando.
- Los productos siguen visibles.
- El diseño no se rompió.

---

## Verificar detalle

Abrir un producto:

```bash
http://localhost:5174/catalog/[id]
```

Validar:

- El detalle sigue funcionando.
- El precio se muestra correctamente.
- El stock se muestra correctamente.
- El contacto por WhatsApp sigue funcionando.

---

## Verificar carrito

Abrir:

```bash
http://localhost:5174/cart
```

Validar:

- Se muestran productos agregados.
- Se puede aumentar cantidad.
- Se puede disminuir cantidad.
- Se puede eliminar un producto.
- Se puede vaciar el carrito.
- Se calcula correctamente el total.
- El pedido por WhatsApp se genera correctamente.

---

## Verificar admin

Abrir:

```bash
http://localhost:5174/admin
```

y:

```bash
http://localhost:5174/admin/login
```

Validar:

- El admin sigue separado.
- El layout público no afecta al admin.
- El login admin sigue funcionando.
- No aparecen componentes públicos dentro del admin salvo que sean intencionales.

---

# Fase 10 - Criterios de aceptación

La implementación se considera correcta cuando:

- `/` muestra la tienda pública.
- La pantalla coming soon fue removida o reemplazada.
- `/catalog` sigue funcionando.
- `/catalog/[id]` sigue funcionando.
- `/admin` queda separado.
- `/admin/login` sigue funcionando.
- La home muestra productos destacados.
- La home muestra categorías.
- La home tiene botones de WhatsApp.
- El carrito funciona.
- El carrito persiste en localStorage.
- El total se calcula correctamente.
- El mensaje de WhatsApp se genera correctamente.
- El diseño se ve bien en mobile y desktop.
- El código está separado en componentes reutilizables.

---

# Orden recomendado de implementación

## Paso 1

Revisar la home actual:

```txt
src/routes/+page.svelte
```

Eliminar o reemplazar el contenido de coming soon.

---

## Paso 2

Crear componentes públicos:

```txt
src/lib/components/public
```

---

## Paso 3

Crear la carga de datos para la home:

```txt
src/routes/+page.server.ts
```

Debe traer:

- Productos destacados.
- Categorías.
- Settings de tienda si existen.

---

## Paso 4

Renderizar la home pública en:

```txt
src/routes/+page.svelte
```

---

## Paso 5

Crear el store del carrito:

```txt
src/lib/stores/cart.ts
```

---

## Paso 6

Integrar `Agregar al carrito` en los productos.

---

## Paso 7

Crear página:

```txt
src/routes/cart/+page.svelte
```

---

## Paso 8

Crear función de mensaje de WhatsApp.

---

## Paso 9

Probar todo manualmente.

---

# Comandos útiles

## Levantar el proyecto

```bash
docker compose up -d
```

o si la app corre fuera de Docker:

```bash
npm run dev
```

---

## Prisma Studio

```bash
npx prisma studio
```

---

## Aplicar migraciones

```bash
npx prisma migrate dev
```

---

## Regenerar cliente Prisma

```bash
npx prisma generate
```

---

## Ejecutar seed

```bash
npx prisma db seed
```

---

## Ejecutar tests

```bash
npm run test
```

---

## Ejecutar tests E2E

```bash
npx playwright test
```

---

# Notas importantes

- No modificar el schema de Prisma salvo que sea estrictamente necesario.
- No borrar migraciones existentes.
- No romper el catálogo actual.
- No mezclar layout público con layout admin.
- Mantener el código simple y escalable.
- Priorizar funcionalidad vendible antes que features avanzadas.
- Usar datos reales siempre que sea posible.
- Usar mocks solo como fallback temporal.
- Mantener el proyecto preparado para producción.

---

# Resultado esperado

Después de esta implementación, el cliente debe poder ingresar a:

```bash
http://localhost:5174/
```

y ver una tienda online pública de **AmadeoStore**, con productos, categorías, carrito y contacto por WhatsApp.

La experiencia debe sentirse como un e-commerce real, no como una página temporal ni como un sistema administrativo.
