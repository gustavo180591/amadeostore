<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Product, Category } from '@prisma/client';

	let data = $props<{
		products: (Product & { category: Category | null })[];
		categories: Category[];
	}>();

	let selectedCategory = $state<string | null>(null);

	let filteredProducts = $derived(() => {
		if (selectedCategory) {
			return data.products.filter(
				(p: Product & { category: Category | null }) => p.categoryId === selectedCategory
			);
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
	<div class="mx-auto max-w-7xl px-4 py-8">
		<header class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
			<p class="text-gray-600">Descubre nuestra selección de productos</p>
		</header>

		<!-- Categories Filter -->
		<div class="mb-8">
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
					Todos
				</button>
				{#each data.categories as category (category.id)}
					<button
						class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
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
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredProducts() as product (product.id)}
				<div
					class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="aspect-w-1 aspect-h-1 bg-gray-200">
						{#if product.imageUrl}
							<img src={product.imageUrl} alt={product.name} class="h-48 w-full object-cover" />
						{:else}
							<div class="flex h-48 w-full items-center justify-center bg-gray-200">
								<span class="text-gray-400">Sin imagen</span>
							</div>
						{/if}
					</div>
					<div class="p-4">
						<h3 class="mb-1 text-lg font-semibold text-gray-900">{product.name}</h3>
						{#if product.category}
							<span
								class="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
							>
								{product.category.name}
							</span>
						{/if}
						{#if product.description}
							<p class="mb-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>
						{/if}
						<div class="flex items-center justify-between">
							<span class="text-2xl font-bold text-gray-900"
								>{formatPrice(Number(product.price))}</span
							>
							{#if product.stock > 0}
								<span class="text-sm text-green-600">Stock: {product.stock}</span>
							{:else}
								<span class="text-sm text-red-600">Sin stock</span>
							{/if}
						</div>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<button
							onclick={() => goto(`/catalog/${product.id}`)}
							class="mt-4 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700"
						>
							Ver detalles
						</button>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredProducts.length === 0}
			<div class="py-12 text-center">
				<p class="text-lg text-gray-500">No se encontraron productos</p>
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
