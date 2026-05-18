<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cartStore } from '$lib/stores/cart';
	import { WHATSAPP_CONFIG } from '$lib/config/store';
	import { onMount } from 'svelte';

	interface CartItem {
		id: string;
		name: string;
		price: number;
		image?: string | null;
		quantity: number;
		stock?: number | null;
		slug: string;
		variant?: {
			id: string;
			colorName?: string;
			colorHex?: string;
			storage?: string;
		};
	}

	let cartItems = $state<CartItem[]>([]);
	let isLoading = $state(true);
	let isCheckingOut = $state(false);

	// Load cart from store
	$effect(() => {
		const loadCart = () => {
			cartItems = cartStore.getItems();
			isLoading = false;
		};

		// Initial load
		loadCart();

		// Listen for cart changes
		const unsubscribe = cartStore.subscribe(loadCart);
		return unsubscribe;
	});

	// Computed values
	let subtotal = $derived(() => 
		cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
	);

	let totalItems = $derived(() =>
		cartItems.reduce((total, item) => total + item.quantity, 0)
	);

	let isEmpty = $derived(() => cartItems.length === 0);

	// Actions
	function updateQuantity(itemId: string, newQuantity: number) {
		if (newQuantity < 1) return;
		
		const item = cartItems.find(item => item.id === itemId);
		if (item && item.stock && newQuantity > item.stock) {
			return; // Don't exceed stock
		}

		cartStore.updateQuantity(itemId, newQuantity);
	}

	function removeFromCart(itemId: string) {
		cartStore.removeItem(itemId);
	}

	function clearCart() {
		if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
			cartStore.clear();
		}
	}

	function continueShopping() {
		goto(resolve('/catalog'));
	}

	async function checkoutWhatsApp() {
		if (cartItems.length === 0) return;

		isCheckingOut = true;

		try {
			// Generate WhatsApp message using config
			const message = WHATSAPP_CONFIG.generateOrderMessage(
				cartItems.map(item => ({
					name: item.name,
					quantity: item.quantity,
					price: item.price,
					variant: item.variant
				})),
				Number(subtotal)
			);
			
			// Create WhatsApp URL using config
			const whatsappUrl = WHATSAPP_CONFIG.createWhatsAppUrl(message);
			
			// Open WhatsApp
			window.open(whatsappUrl, '_blank');
			
			// Optional: Clear cart after successful checkout
			// cartStore.clear();
		} catch (error) {
			console.error('Error during checkout:', error);
			alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
		} finally {
			isCheckingOut = false;
		}
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}

	function getStockStatus(item: CartItem): { text: string; class: string } {
		if (!item.stock) return { text: 'Consultar stock', class: 'text-gray-500' };
		if (item.stock <= 3) return { text: `¡Últimas ${item.stock} unidades!`, class: 'text-orange-600' };
		return { text: `${item.stock} disponibles`, class: 'text-green-600' };
	}
</script>

<svelte:head>
	<title>Carrito de Compras - AmadeoStore</title>
	<meta name="description" content="Revisa y gestiona tu carrito de compras en AmadeoStore" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<button 
						onclick={continueShopping}
						class="mr-4 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<h1 class="text-2xl font-bold text-gray-900">Carrito de Compras</h1>
				</div>
				<div class="text-sm text-gray-500">
					{totalItems} {totalItems === 1 ? 'producto' : 'productos'}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if isLoading}
			<div class="flex justify-center py-12">
				<div class="text-center">
					<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p class="mt-2 text-gray-600">Cargando carrito...</p>
				</div>
			</div>
		{:else if isEmpty}
			<div class="rounded-lg bg-white p-8 text-center shadow-sm">
				<svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
				</svg>
				<h2 class="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h2>
				<p class="mt-2 text-gray-500">No tienes productos en tu carrito todavía.</p>
				<button
					onclick={continueShopping}
					class="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
				>
					Continuar Comprando
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Cart Items -->
				<div class="lg:col-span-2">
					<div class="rounded-lg bg-white shadow-sm">
						<div class="px-6 py-4 border-b border-gray-200">
							<div class="flex items-center justify-between">
								<h2 class="text-lg font-medium text-gray-900">Productos ({cartItems.length})</h2>
								<button
									onclick={clearCart}
									class="text-sm text-red-600 hover:text-red-700"
								>
									Vaciar carrito
								</button>
							</div>
						</div>

						<div class="divide-y divide-gray-200">
							{#each cartItems as item (item.id)}
								<div class="p-6">
									<div class="flex items-start space-x-4">
										<!-- Product Image -->
										<div class="shrink-0">
											{#if item.image}
												<img 
													src={item.image} 
													alt={item.name}
													class="h-20 w-20 rounded-lg object-cover"
												/>
											{:else}
												<div class="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center">
													<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
												</div>
											{/if}
										</div>

										<!-- Product Details -->
										<div class="flex-1">
											<div class="flex items-start justify-between">
												<div>
													<h3 class="text-base font-medium text-gray-900">
														<a 
															href={resolve(`/products/${item.slug}`)}
															class="hover:text-blue-600"
														>
															{item.name}
														</a>
													</h3>
													{#if item.variant}
														<p class="mt-1 text-sm text-gray-500">
															{#if item.variant.colorName}
																<span class="flex items-center gap-1">
																	{#if item.variant.colorHex}
																		<span 
																			class="inline-block h-3 w-3 rounded-full border border-gray-300" 
																			style={`background-color: ${item.variant.colorHex}`}
																		></span>
																	{/if}
																	{item.variant.colorName}
																</span>
															{/if}
															{#if item.variant.storage}
																<span>• {item.variant.storage}</span>
															{/if}
														</p>
													{/if}
													<p class="mt-1 text-sm {getStockStatus(item).class}">
														{getStockStatus(item).text}
													</p>
												</div>
												<button
													onclick={() => removeFromCart(item.id)}
													class="text-gray-400 hover:text-red-600"
												>
													<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</button>
											</div>

											<!-- Quantity and Price -->
											<div class="mt-4 flex items-center justify-between">
												<div class="flex items-center space-x-2">
													<label class="text-sm text-gray-600">Cantidad:</label>
													<div class="flex items-center rounded-md border border-gray-300">
														<button
															onclick={() => updateQuantity(item.id, item.quantity - 1)}
															disabled={item.quantity <= 1}
															class="rounded-l-md px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
														>
															-
														</button>
														<input
															type="number"
															value={item.quantity}
															min="1"
															max={item.stock || 999}
															onchange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
															class="w-16 border-0 text-center"
														/>
														<button
															onclick={() => updateQuantity(item.id, item.quantity + 1)}
															disabled={item.stock ? item.quantity >= item.stock : false}
															class="rounded-r-md px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
														>
															+
														</button>
													</div>
												</div>
												<div class="text-right">
													<p class="text-lg font-medium text-gray-900">
														{formatPrice(item.price * item.quantity)}
													</p>
													<p class="text-sm text-gray-500">
														{formatPrice(item.price)} c/u
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Order Summary -->
				<div class="lg:col-span-1">
					<div class="rounded-lg bg-white shadow-sm">
						<div class="px-6 py-4 border-b border-gray-200">
							<h2 class="text-lg font-medium text-gray-900">Resumen del Pedido</h2>
						</div>

						<div class="px-6 py-4 space-y-4">
							<div class="flex justify-between text-sm">
								<span class="text-gray-600">Subtotal ({totalItems} productos)</span>
								<span class="font-medium text-gray-900">{formatPrice(subtotal)}</span>
							</div>

							<div class="flex justify-between text-sm">
								<span class="text-gray-600">Envío</span>
								<span class="font-medium text-gray-900">A coordinar</span>
							</div>

							<div class="pt-4 border-t border-gray-200">
								<div class="flex justify-between">
									<span class="text-base font-medium text-gray-900">Total</span>
									<span class="text-base font-bold text-gray-900">{formatPrice(subtotal)}</span>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="space-y-3 pt-4">
								<button
									onclick={continueShopping}
									class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Continuar Comprando
								</button>

								<button
									onclick={checkoutWhatsApp}
									disabled={isCheckingOut || cartItems.length === 0}
									class="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{#if isCheckingOut}
										<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
										Procesando...
									{:else}
										<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.029 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
										</svg>
										Finalizar Pedido por WhatsApp
									{/if}
								</button>
							</div>

							<!-- Info Message -->
							<div class="mt-4 p-3 bg-blue-50 rounded-md">
								<p class="text-sm text-blue-800">
									<strong>¿Cómo funciona?</strong><br>
								 Al hacer clic en "Finalizar Pedido", se abrirá WhatsApp con tu pedido pre-cargado para que lo envíes y coordines la entrega.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	/* Custom styles for number input */
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	
	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
