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
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold text-gray-900">Categorías</h1>
			<p class="mt-2 text-gray-600">Explora nuestra amplia variedad de productos por categoría</p>
		</div>
	</div>

	<!-- Categories Grid -->
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		{#each data.categories as category (category.id)}
			<div class="mb-12">
				<!-- Category Header -->
				<div class="mb-6 flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold text-gray-900">{category.name}</h2>
						{#if category.description}
							<p class="mt-1 text-gray-600">{category.description}</p>
						{/if}
						<p class="mt-1 text-sm text-gray-500">
							{category._count.products} productos disponibles
						</p>
					</div>
					<a
						href={resolve(`/catalog?category=${category.slug}`)}
						class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					>
						Ver todos
						<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</a>
				</div>

				<!-- Products Grid -->
				{#if category.products.length > 0}
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each category.products as product (product.id)}
							<div
								class="rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
							>
								<div class="relative">
									{#if product.images && product.images.length > 0}
										<img
											src={product.images[0].url}
											alt={product.images[0].alt || product.name}
											class="h-48 w-full rounded-t-lg object-cover"
										/>
									{:else}
										<div
											class="flex h-48 w-full items-center justify-center rounded-t-lg bg-gray-200"
										>
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
								</div>

								<div class="p-4">
									<h3 class="mb-2 line-clamp-2 text-lg font-medium text-gray-900">
										{product.name}
									</h3>
									<p class="mb-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>

									<div class="flex items-center justify-between">
										<div>
											<p class="text-lg font-bold text-blue-600">
												{formatPrice(Number(product.price))}
											</p>
											{#if product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)}
												<p class="text-sm text-gray-500 line-through">
													{formatPrice(Number(product.compareAtPrice))}
												</p>
											{/if}
										</div>

										{#if product.stock > 0}
											<span
												class="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
											>
												En stock
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800"
											>
												Agotado
											</span>
										{/if}
									</div>

									<a
										href={resolve(`/products/${product.slug}`)}
										class="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
									>
										Ver detalles
									</a>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="rounded-lg bg-white py-12 text-center">
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
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
							/>
						</svg>
						<h3 class="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
						<p class="mt-1 text-sm text-gray-500">
							No hay productos disponibles en esta categoría actualmente.
						</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center py-12">
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
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
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
