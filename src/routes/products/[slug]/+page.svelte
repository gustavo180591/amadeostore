<script lang="ts">
	import { resolve } from '$app/paths';
	import { cart } from '$lib/stores/cart';
	import { WHATSAPP_CONFIG } from '$lib/config/store';

	let { data } = $props();

	interface ProductVariant {
		id: string;
		colorName?: string;
		colorHex?: string;
		storage?: string;
		price: number;
		oldPrice?: number;
		stock: number;
		sku?: string;
		isDefault: boolean;
	}

	interface Product {
		id: string;
		name: string;
		slug: string;
		description?: string;
		price: number | null;
		oldPrice?: number | null;
		stock: number;
		sku?: string;
		imageUrl?: string | null;
		badge?: string | null;
		promoText?: string | null;
		brand?: string | null;
		model?: string | null;
		status: string;
		isFeatured: boolean;
		category?: {
			id: string;
			name: string;
			slug: string;
		};
		images?: Array<{
			id: string;
			url: string;
			alt?: string;
			isPrimary: boolean;
		}>;
		variants?: ProductVariant[];
	}

	let product = $derived(data?.product as Product);
	let relatedProducts = $derived(data?.relatedProducts || []);

	// State for selected variant
	let selectedVariant = $state<ProductVariant | null>(null);
	let selectedImage = $state<string>('');
	let quantity = $state(1);

	// Initialize selected variant and image
	$effect(() => {
		if (product) {
			// Set default variant
			const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
			selectedVariant = defaultVariant || null;

			// Set primary image
			const primaryImage = product.images?.find((img) => img.isPrimary);
			selectedImage = primaryImage?.url || product.imageUrl || '';
		}
	});

	// Computed values
	let effectivePrice = $derived.by(() => {
		return selectedVariant ? selectedVariant.price : product?.price || 0;
	});

	let effectiveOldPrice = $derived.by(() => {
		if (selectedVariant?.oldPrice) return selectedVariant.oldPrice;
		return product?.oldPrice || null;
	});

	let effectiveStock = $derived.by(() => {
		return selectedVariant ? selectedVariant.stock : product?.stock || 0;
	});

	let discountPercentage = $derived.by(() => {
		if (!effectiveOldPrice) return 0;
		return Math.round(((effectiveOldPrice - effectivePrice) / effectiveOldPrice) * 100);
	});

	let isInStock = $derived.by(() => effectiveStock > 0);

	// Actions
	function selectVariant(variant: ProductVariant) {
		selectedVariant = variant;
		quantity = 1; // Reset quantity when changing variant
	}

	function selectImage(imageUrl: string) {
		selectedImage = imageUrl;
	}

	function addToCart() {
		if (!product || !isInStock) return;

		const item = {
			id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
			name: product.name,
			price: effectivePrice,
			image: selectedImage,
			quantity,
			stock: effectiveStock,
			slug: product.slug,
			variant: selectedVariant
				? {
						id: selectedVariant.id,
						colorName: selectedVariant.colorName,
						colorHex: selectedVariant.colorHex,
						storage: selectedVariant.storage
					}
				: undefined
		};

		cart.addItem(item, quantity);
	}

	function buyOnWhatsApp() {
		if (!product) return;

		const message = WHATSAPP_CONFIG.generateOrderMessage(
			[
				{
					name: product.name,
					quantity,
					price: effectivePrice,
					variant: selectedVariant
						? {
								colorName: selectedVariant.colorName,
								storage: selectedVariant.storage
							}
						: undefined
				}
			],
			effectivePrice * quantity
		);

		const whatsappUrl = WHATSAPP_CONFIG.createWhatsAppUrl(message);
		window.open(whatsappUrl, '_blank');
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}

	function getStockDisplay(): { text: string; class: string } {
		if (effectiveStock === 0) return { text: 'Sin stock', class: 'text-red-600' };
		if (effectiveStock <= 3)
			return { text: `¡Últimas ${effectiveStock} unidades!`, class: 'text-orange-600' };
		return { text: `${effectiveStock} disponibles`, class: 'text-green-600' };
	}
</script>

<svelte:head>
	<title>{product?.name} - AmadeoStore</title>
	<meta
		name="description"
		content={product?.description || `Compra ${product?.name} en AmadeoStore`}
	/>
</svelte:head>

{#if product}
	<div class="min-h-screen bg-gray-50">
		<!-- Breadcrumb -->
		<nav class="border-b bg-white">
			<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
				<ol class="flex items-center space-x-2 text-sm text-gray-500">
					<li>
						<a href={resolve('/')} class="hover:text-gray-700">Inicio</a>
					</li>
					<li>/</li>
					<li>
						<a href={resolve('/catalog')} class="hover:text-gray-700">Catálogo</a>
					</li>
					<li>/</li>
					<li class="text-gray-900">{product.name}</li>
				</ol>
			</div>
		</nav>

		<!-- Product Detail -->
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<!-- Images -->
				<div class="space-y-4">
					<!-- Main Image -->
					<div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
						{#if selectedImage}
							<img src={selectedImage} alt={product.name} class="h-full w-full object-cover" />
						{:else}
							<div class="flex h-full items-center justify-center">
								<svg
									class="h-24 w-24 text-gray-400"
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
					</div>

					<!-- Thumbnail Gallery -->
					{#if product.images && product.images.length > 1}
						<div class="flex space-x-2 overflow-x-auto">
							{#each product.images as image (image.id)}
								<button
									onclick={() => selectImage(image.url)}
									class="aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors"
									class:border-blue-500={selectedImage === image.url}
									class:border-gray-200={selectedImage !== image.url}
								>
									<img src={image.url} alt={image.alt} class="h-full w-full object-cover" />
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Product Info -->
				<div class="space-y-6">
					<!-- Header -->
					<div>
						{#if product.category}
							<p class="text-sm text-gray-500">
								<a
									href={resolve(`/catalog?category=${product.category.slug}`)}
									class="hover:text-blue-600"
								>
									{product.category.name}
								</a>
							</p>
						{/if}
						<h1 class="text-3xl font-bold text-gray-900">{product.name}</h1>

						<!-- Badges -->
						<div class="mt-2 flex flex-wrap gap-2">
							{#if product.isFeatured}
								<span
									class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
								>
									Destacado
								</span>
							{/if}
							{#if product.badge}
								<span
									class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
								>
									{product.badge}
								</span>
							{/if}
							{#if product.promoText}
								<span
									class="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800"
								>
									{product.promoText}
								</span>
							{/if}
						</div>
					</div>

					<!-- Price -->
					<div class="space-y-2">
						<div class="flex items-baseline space-x-2">
							<span class="text-3xl font-bold text-gray-900">{formatPrice(effectivePrice)}</span>
							{#if effectiveOldPrice && effectiveOldPrice > effectivePrice}
								<span class="text-lg text-gray-500 line-through"
									>{formatPrice(effectiveOldPrice)}</span
								>
								<span
									class="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800"
								>
									{discountPercentage}% OFF
								</span>
							{/if}
						</div>
						<p class="text-sm {getStockDisplay().class}">
							{getStockDisplay().text}
						</p>
					</div>

					<!-- Variants -->
					{#if product.variants && product.variants.length > 0}
						<div class="space-y-4">
							<h3 class="text-lg font-medium text-gray-900">Opciones</h3>

							<!-- Color Variants -->
							{#if product.variants.some((v) => v.colorName)}
								<div>
									<div class="mb-2 block text-sm font-medium text-gray-700">Color</div>
									<div class="flex flex-wrap gap-2">
										{#each product.variants.filter((v) => v.colorName) as variant (variant.id)}
											<button
												onclick={() => selectVariant(variant)}
												class="flex items-center space-x-2 rounded-lg border-2 px-3 py-2 transition-colors"
												class:border-blue-500={selectedVariant?.id === variant.id}
												class:border-gray-200={selectedVariant?.id !== variant.id}
												class:bg-blue-50={selectedVariant?.id === variant.id}
											>
												{#if variant.colorHex}
													<span
														class="h-4 w-4 rounded-full border border-gray-300"
														style={`background-color: ${variant.colorHex}`}
													></span>
												{/if}
												<span class="text-sm font-medium">{variant.colorName}</span>
											</button>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Storage Variants -->
							{#if product.variants.some((v) => v.storage)}
								<div>
									<div class="mb-2 block text-sm font-medium text-gray-700">Almacenamiento</div>
									<div class="flex flex-wrap gap-2">
										{#each product.variants.filter((v) => v.storage) as variant (variant.id)}
											<button
												onclick={() => selectVariant(variant)}
												class="rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors"
												class:border-blue-500={selectedVariant?.id === variant.id}
												class:border-gray-200={selectedVariant?.id !== variant.id}
												class:bg-blue-50={selectedVariant?.id === variant.id}
											>
												{variant.storage}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Description -->
					{#if product.description}
						<div>
							<h3 class="text-lg font-medium text-gray-900">Descripción</h3>
							<div class="prose prose-sm mt-2 text-gray-600">
								<p>{product.description}</p>
							</div>
						</div>
					{/if}

					<!-- Actions -->
					<div class="space-y-4">
						<!-- Quantity -->
						<div class="flex items-center space-x-4">
							<div class="mb-2 text-sm font-medium text-gray-700">Cantidad:</div>
							<div class="flex items-center rounded-md border border-gray-300">
								<button
									type="button"
									onclick={() => quantity > 1 && (quantity -= 1)}
									disabled={quantity <= 1}
									class="rounded-l-md px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
								>
									-
								</button>
								<input
									type="number"
									bind:value={quantity}
									min="1"
									max={effectiveStock}
									class="w-16 border-0 text-center"
								/>
								<button
									type="button"
									onclick={() => quantity < effectiveStock && (quantity += 1)}
									disabled={quantity >= effectiveStock}
									class="rounded-r-md px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
								>
									+
								</button>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<button
								type="button"
								onclick={addToCart}
								disabled={!isInStock}
								class="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isInStock ? 'Agregar al Carrito' : 'Sin Stock'}
							</button>

							<button
								type="button"
								onclick={buyOnWhatsApp}
								disabled={!isInStock}
								class="flex items-center justify-center gap-2 rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.029 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"
									/>
								</svg>
								Consultar por WhatsApp
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Related Products -->
			{#if relatedProducts.length > 0}
				<div class="mt-16">
					<h2 class="mb-8 text-2xl font-bold text-gray-900">Productos Relacionados</h2>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each relatedProducts as relatedProduct (relatedProduct.id)}
							<div class="group relative">
								<a href={resolve(`/products/${relatedProduct.slug}`)} class="block">
									<div
										class="aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75"
									>
										{#if relatedProduct.images && relatedProduct.images.length > 0}
											<img
												src={relatedProduct.images[0].url}
												alt={relatedProduct.name}
												class="h-full w-full object-cover"
											/>
										{:else}
											<div class="flex h-full items-center justify-center">
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
									</div>
									<div class="mt-4">
										<h3 class="text-sm font-medium text-gray-900">{relatedProduct.name}</h3>
										<p class="mt-1 text-lg font-medium text-gray-900">
											{formatPrice(relatedProduct.price || 0)}
										</p>
									</div>
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
			<p class="mt-2 text-gray-600">El producto que buscas no existe o no está disponible.</p>
			<a
				href={resolve('/catalog')}
				class="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
			>
				← Volver al catálogo
			</a>
		</div>
	</div>
{/if}

<style>
	/* Custom styles for number input */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
