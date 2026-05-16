<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state('');
	let searchQuery = $state('');
	let sortBy = $state('name');

	// Filter and sort products
	const filteredProducts = $derived(() => {
		let filtered = [...data.products];

		// Filter by category
		if (selectedCategory) {
			filtered = filtered.filter((product) => product.categoryId === selectedCategory);
		}

		// Filter by search
		if (searchQuery) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Sort products
		return filtered.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name);
				case 'price-low':
					return a.price - b.price;
				case 'price-high':
					return b.price - a.price;
				case 'newest':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				default:
					return 0;
			}
		});
	});

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}

	function resetFilters() {
		selectedCategory = '';
		searchQuery = '';
		sortBy = 'name';
	}
</script>

<svelte:head>
	<title>Productos - AMADEO STORE</title>
	<meta name="description" content="Explora todos nuestros productos" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold text-gray-900">Todos los Productos</h1>
			<p class="mt-2 text-gray-600">Descubre nuestra completa colección de productos</p>
		</div>
	</div>

	<!-- Filters Section -->
	<div class="border-b bg-white">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-4 lg:flex-row">
				<!-- Search -->
				<div class="flex-1">
					<div class="relative">
						<input
							type="text"
							placeholder="Buscar productos..."
							bind:value={searchQuery}
							class="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						/>
						<svg
							class="absolute top-2.5 left-3 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>

				<!-- Category Filter -->
				<div class="lg:w-64">
					<select
						bind:value={selectedCategory}
						class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Todas las categorías</option>
						{#each data.categories as category (category.id)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>

				<!-- Sort -->
				<div class="lg:w-48">
					<select
						bind:value={sortBy}
						class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
					>
						<option value="name">Nombre</option>
						<option value="price-low">Precio: Menor a Mayor</option>
						<option value="price-high">Precio: Mayor a Menor</option>
						<option value="newest">Más Nuevos</option>
					</select>
				</div>

				<!-- Reset Filters -->
				<button
					onclick={resetFilters}
					class="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
				>
					Limpiar filtros
				</button>
			</div>
		</div>
	</div>

	<!-- Results Count -->
	<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
		<p class="text-gray-600">
			Mostrando {filteredProducts.length} de {data.products.length} productos
		</p>
	</div>

	<!-- Products Grid -->
	<div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
		{#if filteredProducts.length > 0}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredProducts() as product (product.id)}
					<div class="rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
						<div class="relative">
							{#if product.images && product.images.length > 0}
								<img
									src={product.images[0].url}
									alt={product.images[0].alt || product.name}
									class="h-64 w-full rounded-t-lg object-cover"
								/>
							{:else}
								<div class="flex h-64 w-full items-center justify-center rounded-t-lg bg-gray-200">
									<svg
										class="h-16 w-16 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
							{/if}

							{#if product.isFeatured}
								<div class="absolute top-2 left-2">
									<span
										class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
									>
										Destacado
									</span>
								</div>
							{/if}

							{#if product.category}
								<div class="absolute top-2 right-2">
									<span
										class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
									>
										{product.category.name}
									</span>
								</div>
							{/if}
						</div>

						<div class="p-4">
							<h3 class="mb-2 line-clamp-2 text-lg font-medium text-gray-900">{product.name}</h3>

							{#if product.brand}
								<p class="mb-2 text-sm text-gray-500">{product.brand}</p>
							{/if}

							<p class="mb-3 line-clamp-3 text-sm text-gray-600">{product.description}</p>

							<div class="mb-3 flex items-center justify-between">
								<div>
									<p class="text-xl font-bold text-blue-600">{formatPrice(product.price)}</p>
									{#if product.compareAtPrice && product.compareAtPrice > product.price}
										<p class="text-sm text-gray-500 line-through">
											{formatPrice(product.compareAtPrice)}
										</p>
									{/if}
								</div>

								{#if product.stock > 0}
									<span
										class="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
									>
										En stock ({product.stock})
									</span>
								{:else}
									<span
										class="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800"
									>
										Agotado
									</span>
								{/if}
							</div>

							{#if product.sku}
								<p class="mb-3 text-xs text-gray-500">SKU: {product.sku}</p>
							{/if}

							<a
								href={resolve(`/products/${product.slug}`)}
								class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							>
								Ver detalles
							</a>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
				<p class="mt-1 text-sm text-gray-500">
					{#if searchQuery || selectedCategory}
						Intenta ajustar los filtros
					{:else}
						No hay productos disponibles
					{/if}
				</p>
				{#if searchQuery || selectedCategory}
					<button
						onclick={resetFilters}
						class="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
					>
						Limpiar filtros
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 3;
	}
</style>
