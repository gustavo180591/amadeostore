<script lang="ts">
	import type { Product, Category } from '@prisma/client';

	let data = $props<{
		product: (Product & { category: Category | null }) | null;
	}>();

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}

	function goBack() {
		window.history.back();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-8">
		{#if data.product}
			<div class="overflow-hidden rounded-lg bg-white shadow-lg">
				<div class="md:flex">
					<!-- Product Image -->
					<div class="md:w-1/2">
						<div class="aspect-w-1 aspect-h-1 bg-gray-200">
							{#if data.product.imageUrl}
								<img
									src={data.product.imageUrl}
									alt={data.product.name}
									class="h-96 w-full object-cover md:h-full"
								/>
							{:else}
								<div class="flex h-96 w-full items-center justify-center bg-gray-200 md:h-full">
									<span class="text-lg text-gray-400">Sin imagen</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Product Details -->
					<div class="p-8 md:w-1/2">
						<!-- Back Button -->
						<button
							onclick={goBack}
							class="mb-4 flex items-center text-gray-600 transition-colors hover:text-gray-900"
						>
							<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Volver al catálogo
						</button>

						<!-- Category Badge -->
						{#if data.product.category}
							<span
								class="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
							>
								{data.product.category.name}
							</span>
						{/if}

						<!-- Product Name -->
						<h1 class="mb-4 text-3xl font-bold text-gray-900">{data.product.name}</h1>

						<!-- Product Description -->
						{#if data.product.description}
							<div class="prose prose-lg mb-6 text-gray-600">
								<p>{data.product.description}</p>
							</div>
						{/if}

						<!-- Price and Stock -->
						<div class="mb-6 border-t border-gray-200 pt-6">
							<div class="mb-4 flex items-center justify-between">
								<span class="text-3xl font-bold text-gray-900"
									>{formatPrice(Number(data.product.price))}</span
								>
								{#if data.product.stock > 0}
									<span class="text-sm font-medium text-green-600">
										{data.product.stock} unidades en stock
									</span>
								{:else}
									<span class="text-sm font-medium text-red-600">Sin stock</span>
								{/if}
							</div>
						</div>

						<!-- Add to Cart Button -->
						<div class="space-y-4">
							{#if data.product.stock > 0}
								<button
									class="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
								>
									<svg
										class="mr-2 inline-block h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
									Agregar al carrito
								</button>
							{:else}
								<button
									disabled
									class="w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 text-lg font-medium text-gray-500"
								>
									<svg
										class="mr-2 inline-block h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Sin stock
								</button>
							{/if}

							<!-- WhatsApp Contact -->
							<a
								href="https://wa.me/5491112345678?text=Hola%2C%20estoy%20interesado%20en%20el%20producto%3A%20{encodeURIComponent(
									data.product.name
								)}"
								target="_blank"
								rel="noopener noreferrer"
								class="flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-green-700"
							>
								<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
									/>
								</svg>
								Consultar por WhatsApp
							</a>
						</div>

						<!-- Product Info -->
						<div class="mt-6 border-t border-gray-200 pt-6">
							<h3 class="mb-3 text-lg font-semibold text-gray-900">Información del producto</h3>
							<dl class="space-y-2">
								<div class="flex justify-between">
									<dt class="text-gray-600">SKU:</dt>
									<dd class="font-medium">{data.product.id}</dd>
								</div>
								{#if data.product.category}
									<div class="flex justify-between">
										<dt class="text-gray-600">Categoría:</dt>
										<dd class="font-medium">{data.product.category.name}</dd>
									</div>
								{/if}
								<div class="flex justify-between">
									<dt class="text-gray-600">Stock:</dt>
									<dd class="font-medium">{data.product.stock} unidades</dd>
								</div>
							</dl>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="py-12 text-center">
				<h2 class="mb-4 text-2xl font-bold text-gray-900">Producto no encontrado</h2>
				<p class="mb-6 text-gray-600">El producto que buscas no existe o no está disponible.</p>
				<button
					onclick={goBack}
					class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					Volver al catálogo
				</button>
			</div>
		{/if}
	</div>
</div>
