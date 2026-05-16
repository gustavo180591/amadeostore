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
			filtered = filtered.filter(product => product.categoryId === selectedCategory);
		}
		
		// Filter by search
		if (searchQuery) {
			filtered = filtered.filter(product => 
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
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 class="text-3xl font-bold text-gray-900">Todos los Productos</h1>
			<p class="mt-2 text-gray-600">Descubre nuestra completa colección de productos</p>
		</div>
	</div>

	<!-- Filters Section -->
	<div class="bg-white border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex flex-col lg:flex-row gap-4">
				<!-- Search -->
				<div class="flex-1">
					<div class="relative">
						<input
							type="text"
							placeholder="Buscar productos..."
							bind:value={searchQuery}
							class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>

				<!-- Category Filter -->
				<div class="lg:w-64">
					<select
						bind:value={selectedCategory}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
					class="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
				>
					Limpiar filtros
				</button>
			</div>
		</div>
	</div>

	<!-- Results Count -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
		<p class="text-gray-600">
			Mostrando {filteredProducts.length} de {data.products.length} productos
		</p>
	</div>

	<!-- Products Grid -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
		{#if filteredProducts.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredProducts() as product (product.id)}
					<div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
						<div class="relative">
							{#if product.images && product.images.length > 0}
								<img 
									src={product.images[0].url} 
									alt={product.images[0].alt || product.name}
									class="w-full h-64 object-cover rounded-t-lg"
								/>
							{:else}
								<div class="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
									<svg class="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							{/if}
							
							{#if product.isFeatured}
								<div class="absolute top-2 left-2">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
										Destacado
									</span>
								</div>
							{/if}
							
							{#if product.category}
								<div class="absolute top-2 right-2">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										{product.category.name}
									</span>
								</div>
							{/if}
						</div>
						
						<div class="p-4">
							<h3 class="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
							
							{#if product.brand}
								<p class="text-sm text-gray-500 mb-2">{product.brand}</p>
							{/if}
							
							<p class="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
							
							<div class="flex items-center justify-between mb-3">
								<div>
									<p class="text-xl font-bold text-blue-600">{formatPrice(product.price)}</p>
									{#if product.compareAtPrice && product.compareAtPrice > product.price}
										<p class="text-sm text-gray-500 line-through">{formatPrice(product.compareAtPrice)}</p>
									{/if}
								</div>
								
								{#if product.stock > 0}
									<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
										En stock ({product.stock})
									</span>
								{:else}
									<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
										Agotado
									</span>
								{/if}
							</div>
							
							{#if product.sku}
								<p class="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
							{/if}
							
							<a 
								href={resolve(`/products/${product.slug}`)} 
								class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Ver detalles
							</a>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
						class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
