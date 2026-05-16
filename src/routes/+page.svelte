<script lang="ts">
	import { page } from '$app/stores';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import FeaturedProducts from '$lib/components/store/FeaturedProducts.svelte';
	import LatestProducts from '$lib/components/store/LatestProducts.svelte';

	const data = $derived($page.data);
	const featuredProducts = $derived(data?.featuredProducts || []);
	const latestProducts = $derived(data?.latestProducts || []);
	const categories = $derived(data?.categories || []);
	const stats = $derived(data?.stats);
</script>

<svelte:head>
	<title>AMADEO STORE - Tienda Online</title>
	<meta
		name="description"
		content="Descubre los mejores productos en AMADEO STORE. Calidad garantizada y envíos a todo el país."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
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
					<WhatsAppButton size="lg" text="Consultar por WhatsApp" />
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
		<FeaturedProducts products={featuredProducts} title="Productos Destacados" />
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
		<LatestProducts products={latestProducts} title="Últimos Productos" />
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

	<!-- Cart Drawer Component -->
	<CartDrawer />

	<!-- Floating WhatsApp Button for mobile -->
	<WhatsAppButton variant="floating" />
</div>
