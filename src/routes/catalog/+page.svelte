<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Category } from '@prisma/client';

	interface ProductVariant {
		id: string;
		colorName?: string;
		colorHex?: string;
		storage?: string;
		sku?: string;
	}

	interface Product {
		id: string;
		name: string;
		slug: string;
		brand?: string;
		model?: string;
		description?: string;
		price: number;
		oldPrice?: number;
		stock: number;
		sku?: string;
		status: string;
		isFeatured: boolean;
		badge?: string;
		promoText?: string;
		categoryId?: string;
		createdAt: Date;
		updatedAt: Date;
		category?: Category | null;
		imageUrl?: string;
		hasVariants: boolean;
		defaultVariant?: ProductVariant | null;
	}

	let data = $props<{
		products: Product[];
		categories: Category[];
		totalProducts: number;
	}>();

	// Search and filter state
	let searchQuery = $state('');
	let selectedCategory = $state<string | null>(null);
	let sortBy = $state('featured');
	let priceRange = $state<[number, number]>([0, 1000000]);
	let inStockOnly = $state(true);

	// Derived filtered products
	let filteredProducts = $derived(() => {
		let filtered = data.products || [];

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((product) =>
				product.name.toLowerCase().includes(query) ||
				product.description?.toLowerCase().includes(query) ||
				product.brand?.toLowerCase().includes(query) ||
				product.model?.toLowerCase().includes(query) ||
				product.category?.name.toLowerCase().includes(query)
			);
		}

		// Category filter
		if (selectedCategory) {
			filtered = filtered.filter((product) => product.categoryId === selectedCategory);
		}

		// Stock filter
		if (inStockOnly) {
			filtered = filtered.filter((product) => product.stock > 0);
		}

		// Price range filter
		filtered = filtered.filter((product) => 
			product.price >= priceRange[0] && product.price <= priceRange[1]
		);

		// Sort
		switch (sortBy) {
			case 'featured':
				filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
				break;
			case 'price-low':
				filtered.sort((a, b) => a.price - b.price);
				break;
			case 'price-high':
				filtered.sort((a, b) => b.price - a.price);
				break;
			case 'name':
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'newest':
				filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
				break;
		}

		return filtered;
	});

	// Price range bounds
	let minPrice = $derived(() => data.products?.length ? Math.min(...data.products.map(p => p.price)) : 0);
	let maxPrice = $derived(() => data.products?.length ? Math.max(...data.products.map(p => p.price)) : 1000000);

	// Initialize price range
	$effect(() => {
		if (priceRange[0] === 0 && priceRange[1] === 1000000) {
			priceRange = [minPrice, maxPrice];
		}
	});

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}

	function formatPriceRange(min: number, max: number) {
		return `${formatPrice(min)} - ${formatPrice(max)}`;
	}

	function handlePriceRangeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = Number(target.value);
		if (target.name === 'min') {
			priceRange = [value, priceRange[1]];
		} else {
			priceRange = [priceRange[0], value];
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-8">
		<header class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
			<p class="text-gray-600">Descubre nuestra selección de {data.totalProducts} productos</p>
		</header>

		<!-- Search and Filters -->
		<div class="mb-8 space-y-6">
			<!-- Search Bar -->
			<div class="relative">
				<input
					type="text"
					placeholder="Buscar productos..."
					bind:value={searchQuery}
					class="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
				<div class="absolute left-3 top-3.5 text-gray-400">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
			</div>

			<!-- Advanced Filters -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<!-- Sort -->
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700">Ordenar por</label>
					<select bind:value={sortBy} class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
						<option value="featured">Destacados</option>
						<option value="price-low">Precio: Menor a Mayor</option>
						<option value="price-high">Precio: Mayor a Menor</option>
						<option value="name">Nombre A-Z</option>
						<option value="newest">Más Nuevos</option>
					</select>
				</div>

				<!-- Price Range -->
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700">
						Rango de Precio: {formatPriceRange(priceRange[0], priceRange[1])}
					</label>
					<div class="space-y-2">
						<input
							type="range"
							name="min"
							min={minPrice}
							max={maxPrice}
							step="1000"
							value={priceRange[0]}
							onchange={handlePriceRangeChange}
							class="w-full"
						/>
						<input
							type="range"
							name="max"
							min={minPrice}
							max={maxPrice}
							step="1000"
							value={priceRange[1]}
							onchange={handlePriceRangeChange}
							class="w-full"
						/>
					</div>
				</div>

				<!-- Stock Filter -->
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700">Disponibilidad</label>
					<div class="flex items-center">
						<input
							type="checkbox"
							bind:checked={inStockOnly}
							class="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label for="stock" class="text-sm text-gray-700">Solo productos con stock</label>
					</div>
				</div>

				<!-- Reset Filters -->
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700">Acciones</label>
					<button
						onclick={() => {
							searchQuery = '';
							selectedCategory = null;
							sortBy = 'featured';
							priceRange = [minPrice, maxPrice];
							inStockOnly = true;
						}}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50"
					>
						Restablecer Filtros
					</button>
				</div>
			</div>

			<!-- Categories Filter -->
			<div>
				<h3 class="mb-3 text-sm font-medium text-gray-700">Categorías</h3>
				<div class="flex flex-wrap gap-2">
					<button
						class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
						class:bg-blue-600={selectedCategory === null}
						class:text-white={selectedCategory === null}
						class:bg-gray-200={selectedCategory !== null}
						class:text-gray-700={selectedCategory !== null}
						class:hover:bg-gray-300={selectedCategory !== null}
						onclick={() => (selectedCategory = null)}
					>
						Todos ({data.products?.length || 0})
					</button>
					{#each data.categories as category (category.id)}
						{@const count = data.products?.filter(p => p.categoryId === category.id).length || 0}
						{#if count > 0}
							<button
								class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
								class:bg-blue-600={selectedCategory === category.id}
								class:text-white={selectedCategory === category.id}
								class:bg-gray-200={selectedCategory !== category.id}
								class:text-gray-700={selectedCategory !== category.id}
								class:hover:bg-gray-300={selectedCategory !== category.id}
								onclick={() => (selectedCategory = category.id)}
							>
								{category.name} ({count})
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>

		<!-- Results Summary -->
		<div class="mb-6 flex items-center justify-between">
			<p class="text-gray-600">
				Mostrando <span class="font-semibold">{filteredProducts().length}</span> de <span class="font-semibold">{data.totalProducts || 0}</span> productos
			</p>
			{#if searchQuery || selectedCategory || sortBy !== 'featured' || priceRange[0] > minPrice || priceRange[1] < maxPrice || !inStockOnly}
				<button
					onclick={() => {
						searchQuery = '';
						selectedCategory = null;
						sortBy = 'featured';
						priceRange = [minPrice, maxPrice];
						inStockOnly = true;
					}}
					class="text-sm text-blue-600 hover:text-blue-700"
				>
					Limpiar filtros
				</button>
			{/if}
		</div>

		<!-- Products Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredProducts() as product (product.id)}
				<div
					class="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
				>
					<!-- Product Image -->
					<div class="relative">
						{#if product.imageUrl}
							<img src={product.imageUrl} alt={product.name} class="h-48 w-full object-cover" />
						{:else}
							<div class="flex h-48 w-full items-center justify-center bg-gray-200">
								<svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
						{/if}

						<!-- Badges -->
						{#if product.isFeatured || product.badge}
							<div class="absolute top-2 left-2 flex gap-1">
								{#if product.isFeatured}
									<span class="rounded-full bg-yellow-400 px-2 py-1 text-xs font-medium text-yellow-900">⭐ Destacado</span>
								{/if}
								{#if product.badge}
									<span class="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">{product.badge}</span>
								{/if}
							</div>
						{/if}

						<!-- Variants Indicator -->
						{#if product.hasVariants}
							<div class="absolute top-2 right-2">
								<span class="rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-white">{product.defaultVariant?.colorName || 'Múltiples opciones'}</span>
							</div>
						{/if}
					</div>

					<!-- Product Info -->
					<div class="p-4">
						<!-- Category Badge -->
						{#if product.category}
							<span class="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
								{product.category.name}
							</span>
						{/if}

						<!-- Product Name -->
						<h3 class="mb-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
							{product.name}
						</h3>

						<!-- Brand/Model -->
						{#if product.brand || product.model}
							<p class="mb-2 text-sm text-gray-500">
								{product.brand} {product.model}
							</p>
						{/if}

						<!-- Description -->
						{#if product.description}
							<p class="mb-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>
						{/if}

						<!-- Variant Info -->
						{#if product.defaultVariant}
							<div class="mb-2 flex items-center gap-2 text-xs text-gray-500">
								{#if product.defaultVariant.colorName}
									<span class="flex items-center gap-1">
										{#if product.defaultVariant.colorHex}
											<span class="inline-block h-3 w-3 rounded-full border border-gray-300" style={`background-color: ${product.defaultVariant.colorHex}`}></span>
										{/if}
										{product.defaultVariant.colorName}
									</span>
								{/if}
								{#if product.defaultVariant.storage}
									<span>• {product.defaultVariant.storage}</span>
								{/if}
							</div>
						{/if}

						<!-- Price and Stock -->
						<div class="mb-3">
							<div class="flex items-center gap-2">
								<span class="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
								{#if product.oldPrice && product.oldPrice > product.price}
									<span class="text-sm text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
									<span class="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
										-{Math.round((1 - product.price / product.oldPrice) * 100)}%
									</span>
								{/if}
							</div>
							<div class="flex items-center justify-between">
								{#if product.stock > 0}
									<span class="text-sm text-green-600">✓ {product.stock} disponibles</span>
								{:else}
									<span class="text-sm text-red-600">✗ Sin stock</span>
								{/if}
								{#if product.sku}
									<span class="text-xs text-gray-500">SKU: {product.sku}</span>
								{/if}
							</div>
						</div>

						<!-- Promo Text -->
						{#if product.promoText}
							<p class="mb-3 text-sm font-medium text-cyan-600">{product.promoText}</p>
						{/if}

						<!-- Action Buttons -->
						<div class="space-y-2">
							<button
								onclick={() => goto(resolve(`/products/${product.slug}`))}
								class="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
								disabled={product.stock <= 0}
							>
								{product.stock > 0 ? 'Ver Detalles' : 'Sin Stock'}
							</button>
							{#if product.hasVariants}
								<p class="text-center text-xs text-gray-500">
									{product.defaultVariant ? '1 variante seleccionada' : 'Múltiples variantes disponibles'}
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredProducts().length === 0}
			<div class="py-12 text-center">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<h3 class="mt-4 text-lg font-medium text-gray-900">No se encontraron productos</h3>
				<p class="mt-2 text-gray-500">
					{#if searchQuery || selectedCategory || sortBy !== 'featured' || priceRange[0] > minPrice || priceRange[1] < maxPrice || !inStockOnly}
						Intenta ajustar los filtros o la búsqueda
					{:else}
						No hay productos disponibles en este momento
					{/if}
				</p>
				{#if searchQuery || selectedCategory || sortBy !== 'featured' || priceRange[0] > minPrice || priceRange[1] < maxPrice || !inStockOnly}
					<button
						onclick={() => {
							searchQuery = '';
							selectedCategory = null;
							sortBy = 'featured';
							priceRange = [minPrice, maxPrice];
							inStockOnly = true;
						}}
						class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
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
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
