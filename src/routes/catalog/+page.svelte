<script lang="ts">
	import { getProducts, getCategories } from '$lib/server/products';
	import type { Product, Category } from '@prisma/client';

	let data = $props<{
		products: (Product & { category: Category | null })[];
		categories: Category[];
	}>();

	let selectedCategory = $state<string | null>(null);

	let filteredProducts = $derived(() => {
		if (selectedCategory) {
			return data.products.filter((p: Product & { category: Category | null }) => p.categoryId === selectedCategory);
		} else {
			return data.products;
		}
	});

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 py-8">
		<header class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
			<p class="text-gray-600">Descubre nuestra selección de productos</p>
		</header>

		<!-- Categories Filter -->
		<div class="mb-8">
			<div class="flex flex-wrap gap-2">
				<button
					class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
					class:bg-blue-600={selectedCategory === null}
					class:text-white={selectedCategory === null}
					class:bg-gray-200={selectedCategory !== null}
					class:text-gray-700={selectedCategory !== null}
					class:hover:bg-gray-300={selectedCategory !== null}
					onclick={() => (selectedCategory = null)}
				>
					Todos
				</button>
				{#each data.categories as category}
					<button
						class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
						class:bg-blue-600={selectedCategory === category.id}
						class:text-white={selectedCategory === category.id}
						class:bg-gray-200={selectedCategory !== category.id}
						class:text-gray-700={selectedCategory !== category.id}
						class:hover:bg-gray-300={selectedCategory !== category.id}
						onclick={() => (selectedCategory = category.id)}
					>
						{category.name}
					</button>
				{/each}
			</div>
		</div>

		<!-- Products Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredProducts() as product}
				<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
					<div class="aspect-w-1 aspect-h-1 bg-gray-200">
						{#if product.imageUrl}
							<img
								src={product.imageUrl}
								alt={product.name}
								class="w-full h-48 object-cover"
							/>
						{:else}
							<div class="w-full h-48 bg-gray-200 flex items-center justify-center">
								<span class="text-gray-400">Sin imagen</span>
							</div>
						{/if}
					</div>
					<div class="p-4">
						<h3 class="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
						{#if product.category}
							<span class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
								{product.category.name}
							</span>
						{/if}
						{#if product.description}
							<p class="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
						{/if}
						<div class="flex items-center justify-between">
							<span class="text-2xl font-bold text-gray-900">{formatPrice(Number(product.price))}</span>
							{#if product.stock > 0}
								<span class="text-sm text-green-600">Stock: {product.stock}</span>
							{:else}
								<span class="text-sm text-red-600">Sin stock</span>
							{/if}
						</div>
						<a
							href="/catalog/{product.id}"
							class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
						>
							Ver detalles
						</a>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredProducts.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-500 text-lg">No se encontraron productos</p>
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
