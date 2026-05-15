<script lang="ts">
	import { page } from '$app/stores';
	import { cart } from '$lib/stores/cart';

	const data = $derived($page.data);
	const featuredProducts = $derived(data?.featuredProducts || []);
	const latestProducts = $derived(data?.latestProducts || []);
	const categories = $derived(data?.categories || []);
	const stats = $derived(data?.stats);

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(amount);
	};

	// Get status badge styling
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return 'bg-green-100 text-green-800';
			case 'INACTIVE':
				return 'bg-gray-100 text-gray-800';
			case 'OUT_OF_STOCK':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Get status text
	const getStatusText = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return 'Activo';
			case 'INACTIVE':
				return 'Inactivo';
			case 'OUT_OF_STOCK':
				return 'Sin Stock';
			default:
				return status;
		}
	};
</script>

<svelte:head>
	<title>AMADEO STORE - Tienda Online</title>
	<meta
		name="description"
		content="Descubre los mejores productos en AMADEO STORE. Calidad garantizada y envíos a todo el país."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="sticky top-0 z-40 bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<div class="flex items-center">
					<a href="/" class="flex items-center" rel="external">
						<img src="/logo.png" alt="AMADEO STORE" class="h-8 w-auto" />
					</a>
				</div>

				<!-- Navigation -->
				<nav class="hidden space-x-8 md:flex">
					<a
						href="#featured"
						class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
					>
						Destacados
					</a>
					<a
						href="#products"
						class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
					>
						Productos
					</a>
					<a
						href="#categories"
						class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
					>
						Categorías
					</a>
					<a
						href="/admin"
						class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
						rel="external"
					>
						Admin
					</a>
				</nav>

				<!-- Cart -->
				<div class="flex items-center space-x-4">
					<button
						class="p-2 text-gray-700 transition-colors hover:text-green-600"
						aria-label="Carrito de compras"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
							></path>
						</svg>
					</button>
					<button
						class="p-2 text-gray-700 transition-colors hover:text-green-600 md:hidden"
						aria-label="Menú móvil"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="bg-linear-to-br from-green-50 to-white py-20">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
					<span class="text-green-600">AMADEO</span> STORE
				</h1>
				<p class="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
					Descubre productos premium con la mejor calidad del mercado. Envíos rápidos y garantía de
					satisfacción.
				</p>
				<div class="mt-8 flex justify-center space-x-4">
					<a
						href="#products"
						class="inline-flex items-center rounded-lg border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700"
					>
						Ver Productos
					</a>
					<a
						href="#categories"
						class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
					>
						Explorar Categorías
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="bg-white py-12">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
				<div class="text-center">
					<div class="text-3xl font-bold text-green-600">{stats?.totalProducts || 0}</div>
					<div class="mt-2 text-sm text-gray-600">Productos Disponibles</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-green-600">{stats?.totalCategories || 0}</div>
					<div class="mt-2 text-sm text-gray-600">Categorías</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-green-600">{stats?.featuredCount || 0}</div>
					<div class="mt-2 text-sm text-gray-600">Productos Destacados</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured Products -->
	{#if featuredProducts.length > 0}
		<section id="featured" class="bg-gray-50 py-16">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-12 text-center">
					<h2 class="text-3xl font-bold text-gray-900">Productos Destacados</h2>
					<p class="mt-4 text-lg text-gray-600">Nuestra selección de los mejores productos</p>
				</div>

				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{#each featuredProducts as product (product.id)}
						<div
							class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
						>
							<div class="aspect-w-1 aspect-h-1 bg-gray-200">
								{#if product.imageUrl}
									<img src={product.imageUrl} alt={product.name} class="h-48 w-full object-cover" />
								{:else}
									<div class="flex h-48 w-full items-center justify-center bg-gray-200">
										<svg
											class="h-12 w-12 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											></path>
										</svg>
									</div>
								{/if}
							</div>
							<div class="p-4">
								<h3 class="text-lg font-medium text-gray-900">{product.name}</h3>
								<p class="text-sm text-gray-500">{product.category?.name || 'Sin categoría'}</p>
								<div class="mt-2 flex items-center justify-between">
									<span class="text-2xl font-bold text-green-600"
										>{formatCurrency(product.price)}</span
									>
									{#if product.compareAtPrice}
										<span class="text-sm text-gray-500 line-through"
											>{formatCurrency(product.compareAtPrice)}</span
										>
									{/if}
								</div>
								<div class="mt-3 flex items-center justify-between">
									<span
										class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusBadge(
											product.status
										)}"
									>
										{getStatusText(product.status)}
									</span>
									{#if product.stock <= 5}
										<span class="text-xs font-medium text-red-500">¡Últimas unidades!</span>
									{/if}
								</div>
								<button
									onclick={() => cart.addItem(product.id)}
									class="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
								>
									Agregar al Carrito
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Categories -->
	{#if categories.length > 0}
		<section id="categories" class="bg-white py-16">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-12 text-center">
					<h2 class="text-3xl font-bold text-gray-900">Categorías</h2>
					<p class="mt-4 text-lg text-gray-600">Explora nuestras categorías de productos</p>
				</div>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{#each categories as category (category.id)}
						<div
							class="cursor-pointer rounded-lg bg-gray-50 p-6 text-center transition-colors hover:bg-gray-100"
						>
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
							>
								<svg
									class="h-8 w-8 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									></path>
								</svg>
							</div>
							<h3 class="text-lg font-medium text-gray-900">{category.name}</h3>
							<p class="mt-2 text-sm text-gray-600">Ver productos</p>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Latest Products -->
	{#if latestProducts.length > 0}
		<section id="products" class="bg-gray-50 py-16">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-12 text-center">
					<h2 class="text-3xl font-bold text-gray-900">Últimos Productos</h2>
					<p class="mt-4 text-lg text-gray-600">Las últimas novedades en nuestra tienda</p>
				</div>

				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{#each latestProducts as product (product.id)}
						<div
							class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
						>
							<div class="aspect-w-1 aspect-h-1 bg-gray-200">
								{#if product.imageUrl}
									<img src={product.imageUrl} alt={product.name} class="h-48 w-full object-cover" />
								{:else}
									<div class="flex h-48 w-full items-center justify-center bg-gray-200">
										<svg
											class="h-12 w-12 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											></path>
										</svg>
									</div>
								{/if}
							</div>
							<div class="p-4">
								<h3 class="text-lg font-medium text-gray-900">{product.name}</h3>
								<p class="text-sm text-gray-500">{product.category?.name || 'Sin categoría'}</p>
								<div class="mt-2 flex items-center justify-between">
									<span class="text-2xl font-bold text-green-600"
										>{formatCurrency(product.price)}</span
									>
									{#if product.compareAtPrice}
										<span class="text-sm text-gray-500 line-through"
											>{formatCurrency(product.compareAtPrice)}</span
										>
									{/if}
								</div>
								<div class="mt-3 flex items-center justify-between">
									<span
										class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusBadge(
											product.status
										)}"
									>
										{getStatusText(product.status)}
									</span>
									<span class="text-xs text-gray-500">Stock: {product.stock}</span>
								</div>
								<div class="mt-4 flex space-x-2">
									<button
										onclick={() => cart.addItem(product.id)}
										class="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
									>
										Agregar al Carrito
									</button>
									<a
										href={`/products/${product.slug}`}
										class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-50"
										rel="external"
									>
										Ver Detalles
									</a>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Footer -->
	<footer class="bg-gray-900 text-white">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
				<div>
					<div class="mb-4 flex items-center">
						<img src="/logo.png" alt="AMADEO STORE" class="h-8 w-auto" />
					</div>
					<p class="text-sm text-gray-400">
						Tu tienda de confianza para productos de calidad. Envíos rápidos y garantía de
						satisfacción.
					</p>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-semibold">Enlaces Rápidos</h3>
					<ul class="space-y-2">
						<li>
							<a href="#featured" class="text-gray-400 transition-colors hover:text-white"
								>Productos Destacados</a
							>
						</li>
						<li>
							<a href="#products" class="text-gray-400 transition-colors hover:text-white"
								>Todos los Productos</a
							>
						</li>
						<li>
							<a href="#categories" class="text-gray-400 transition-colors hover:text-white"
								>Categorías</a
							>
						</li>
						<li>
							<a
								href="/admin"
								class="text-gray-400 transition-colors hover:text-white"
								rel="external">Panel Admin</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-semibold">Servicio al Cliente</h3>
					<ul class="space-y-2">
						<li>
							<a href="#contact" class="text-gray-400 transition-colors hover:text-white"
								>Contacto</a
							>
						</li>
						<li>
							<a href="#shipping" class="text-gray-400 transition-colors hover:text-white">Envíos</a
							>
						</li>
						<li>
							<a href="#returns" class="text-gray-400 transition-colors hover:text-white"
								>Devoluciones</a
							>
						</li>
						<li><a href="#faq" class="text-gray-400 transition-colors hover:text-white">FAQ</a></li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-semibold">Contacto</h3>
					<ul class="space-y-2 text-gray-400">
						<li>Email: contacto@amadeostore.com</li>
						<li>Teléfono: +54 9 11 1234-5678</li>
						<li>Dirección: Av. Principal 123, Ciudad</li>
					</ul>
				</div>
			</div>

			<div class="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
				<p>&copy; 2026 AMADEO STORE. Todos los derechos reservados.</p>
			</div>
		</div>
	</footer>
</div>
