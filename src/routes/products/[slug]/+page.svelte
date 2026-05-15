<script lang="ts">
	import { page } from '$app/stores';
	import { cart } from '$lib/stores/cart';
	import type { PageData } from './$types';

	const data = $derived($page.data as PageData);
	const product = $derived(data?.product);
	const relatedProducts = $derived(data?.relatedProducts || []);

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

	// Add to cart with quantity
	const addToCart = () => {
		if (product) {
			cart.addItem(product.id, 1);
		}
	};
</script>

<svelte:head>
	<title>{product?.name || 'Producto'} - AMADEO STORE</title>
	<meta name="description" content={product?.description || 'Producto en AMADEO STORE'} />
</svelte:head>

{#if product}
	<div class="min-h-screen bg-gray-50">
		<!-- Breadcrumb -->
		<nav class="bg-white border-b">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-center py-3">
					<ol class="flex items-center space-x-2 text-sm text-gray-500">
						<li><a href="/" class="hover:text-gray-700">Inicio</a></li>
						<li><span class="text-gray-300">/</span></li>
						<li><a href="#products" class="hover:text-gray-700">Productos</a></li>
						<li><span class="text-gray-300">/</span></li>
						<li class="text-gray-900">{product.name}</li>
					</ol>
				</div>
			</div>
		</nav>

		<!-- Product Details -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
				<!-- Product Images -->
				<div class="lg:col-span-1">
					<div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
						{#if product.imageUrl}
							<img 
								src={product.imageUrl} 
								alt={product.name} 
								class="w-full h-full object-cover"
							/>
						{:else}
							<div class="w-full h-full bg-gray-200 flex items-center justify-center">
								<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
							</div>
						{/if}
					</div>

					{#if product.images && product.images.length > 0}
						<div class="mt-4 grid grid-cols-4 gap-2">
							{#each product.images as image (image.id)}
								<div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden cursor-pointer">
									<img 
										src={image.url} 
										alt={image.alt || 'Product image'} 
										class="w-full h-full object-cover hover:opacity-75 transition-opacity"
									/>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Product Info -->
				<div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
					<h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

					<!-- Category -->
					{#if product.category}
						<div class="mt-2">
							<a 
								href="/categories/{product.category.slug}" 
								class="text-sm text-green-600 hover:text-green-700"
							>
								{product.category.name}
							</a>
						</div>
					{/if}

					<!-- Price -->
					<div class="mt-4">
						<div class="flex items-baseline">
							<span class="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
							{#if product.compareAtPrice}
								<span class="ml-2 text-lg text-gray-500 line-through">{formatCurrency(product.compareAtPrice)}</span>
								<span class="ml-2 text-sm text-green-600 font-medium">
									Ahorra {formatCurrency(product.compareAtPrice - product.price)}
								</span>
							{/if}
						</div>
					</div>

					<!-- Status and Stock -->
					<div class="mt-4 flex items-center space-x-4">
						<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusBadge(product.status)}">
							{getStatusText(product.status)}
						</span>
						<span class="text-sm text-gray-600">Stock: {product.stock}</span>
						{#if product.stock <= 5}
							<span class="text-sm text-red-500 font-medium">¡Últimas unidades!</span>
						{/if}
					</div>

					<!-- Description -->
					{#if product.description}
						<div class="mt-6">
							<h3 class="text-lg font-medium text-gray-900">Descripción</h3>
							<div class="mt-2 text-base text-gray-700 prose prose-sm max-w-none">
								<p>{product.description}</p>
							</div>
						</div>
					{/if}

					<!-- Add to Cart -->
					<div class="mt-8">
						<button
							onclick={addToCart}
							class="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
							disabled={product.stock === 0}
						>
							{#if product.stock === 0}
								Sin Stock
							{:else}
								Agregar al Carrito
							{/if}
						</button>
					</div>

					<!-- Product Features -->
					<div class="mt-8 border-t pt-8">
						<h3 class="text-lg font-medium text-gray-900">Características</h3>
						<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div class="flex items-center">
								<svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span class="text-sm text-gray-600">Envío rápido</span>
							</div>
							<div class="flex items-center">
								<svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span class="text-sm text-gray-600">Garantía de satisfacción</span>
							</div>
							<div class="flex items-center">
								<svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span class="text-sm text-gray-600">Soporte técnico</span>
							</div>
							<div class="flex items-center">
								<svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span class="text-sm text-gray-600">Pago seguro</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Related Products -->
			{#if relatedProducts.length > 0}
				<div class="mt-16">
					<h2 class="text-2xl font-bold text-gray-900">Productos Relacionados</h2>
					<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{#each relatedProducts as relatedProduct (relatedProduct.id)}
							<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
								<div class="aspect-w-1 aspect-h-1 bg-gray-200">
									{#if relatedProduct.imageUrl}
										<img 
											src={relatedProduct.imageUrl} 
											alt={relatedProduct.name} 
											class="w-full h-48 object-cover"
										/>
									{:else}
										<div class="w-full h-48 bg-gray-200 flex items-center justify-center">
											<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
											</svg>
										</div>
									{/if}
								</div>
								<div class="p-4">
									<h3 class="text-lg font-medium text-gray-900">{relatedProduct.name}</h3>
									<p class="text-sm text-gray-500">{relatedProduct.category?.name || 'Sin categoría'}</p>
									<div class="mt-2 flex items-center justify-between">
										<span class="text-xl font-bold text-green-600">{formatCurrency(relatedProduct.price)}</span>
									</div>
									<button 
										onclick={() => cart.addItem(relatedProduct.id)}
										class="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
									>
										Agregar al Carrito
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
			<p class="mt-2 text-gray-600">El producto que buscas no está disponible.</p>
			<a href="/" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700">
				Volver al inicio
			</a>
		</div>
	</div>
{/if}
