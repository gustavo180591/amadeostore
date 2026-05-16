<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}
</script>

<svelte:head>
	<title>Categorías - AMADEO STORE</title>
	<meta name="description" content="Explora nuestras categorías de productos" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 class="text-3xl font-bold text-gray-900">Categorías</h1>
			<p class="mt-2 text-gray-600">Explora nuestra amplia variedad de productos por categoría</p>
		</div>
	</div>

	<!-- Categories Grid -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		{#each data.categories as category (category.id)}
			<div class="mb-12">
				<!-- Category Header -->
				<div class="flex items-center justify-between mb-6">
					<div>
						<h2 class="text-2xl font-bold text-gray-900">{category.name}</h2>
						{#if category.description}
							<p class="mt-1 text-gray-600">{category.description}</p>
						{/if}
						<p class="text-sm text-gray-500 mt-1">
							{category._count.products} productos disponibles
						</p>
					</div>
					<a 
						href={resolve(`/catalog?category=${category.slug}`)} 
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Ver todos
						<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>

				<!-- Products Grid -->
				{#if category.products.length > 0}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{#each category.products as product (product.id)}
							<div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
								<div class="relative">
									{#if product.images && product.images.length > 0}
										<img 
											src={product.images[0].url} 
											alt={product.images[0].alt || product.name}
											class="w-full h-48 object-cover rounded-t-lg"
										/>
									{:else}
										<div class="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
											<svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
								</div>
								
								<div class="p-4">
									<h3 class="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
									<p class="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
									
									<div class="flex items-center justify-between">
										<div>
											<p class="text-lg font-bold text-blue-600">{formatPrice(Number(product.price))}</p>
											{#if product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)}
												<p class="text-sm text-gray-500 line-through">{formatPrice(Number(product.compareAtPrice))}</p>
											{/if}
										</div>
										
										{#if product.stock > 0}
											<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
												En stock
											</span>
										{:else}
											<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
												Agotado
											</span>
										{/if}
									</div>
									
									<a 
										href={resolve(`/products/${product.slug}`)} 
										class="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									>
										Ver detalles
									</a>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-12 bg-white rounded-lg">
						<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
						</svg>
						<h3 class="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
						<p class="mt-1 text-sm text-gray-500">No hay productos disponibles en esta categoría actualmente.</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center py-12">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
				<p class="mt-1 text-sm text-gray-500">No hay categorías disponibles actualmente.</p>
			</div>
		{/each}
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
</style>
