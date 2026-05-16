<script lang="ts">
	import { cart } from '$lib/stores/cart';

	const cartState = $derived($cart);
	const isOpen = $derived(cartState.isOpen);

	function closeCart() {
		cart.close();
	}

	function updateQuantity(productId: string, quantity: number) {
		cart.updateQuantity(productId, quantity);
	}

	function removeItem(productId: string) {
		cart.removeItem(productId);
	}

	function clearCart() {
		if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
			cart.clear();
		}
	}

	async function sendWhatsApp() {
		await cart.sendWhatsApp();
	}

	// Close cart when clicking outside
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeCart();
		}
	}

	// Format currency
	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(amount);
	}
</script>

<!-- Backdrop -->
{#if isOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 bg-black transition-opacity"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && closeCart()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="cart-title"
		tabindex="-1"
	>
		<!-- Cart Drawer -->
		<div
			class="fixed top-0 right-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-in-out"
			class:translate-x-0={isOpen}
			class:translate-x-full={!isOpen}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b p-4">
				<h2 id="cart-title" class="text-lg font-semibold text-gray-900">
					Tu Carrito ({cartState.count})
				</h2>
				<button
					onclick={closeCart}
					class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
					aria-label="Cerrar carrito"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Cart Content -->
			<div class="flex h-full flex-col">
				{#if cartState.items.length === 0}
					<!-- Empty Cart -->
					<div class="flex flex-1 items-center justify-center p-8">
						<div class="text-center">
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
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
							<h3 class="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h3>
							<p class="mt-2 text-gray-500">Agrega productos para empezar a comprar</p>
							<button
								onclick={closeCart}
								class="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
							>
								Ver Productos
							</button>
						</div>
					</div>
				{:else}
					<!-- Cart Items -->
					<div class="flex-1 overflow-y-auto p-4">
						<div class="space-y-4">
							{#each cartState.items as item (item.id)}
								<div class="flex items-center space-x-4 rounded-lg border p-4">
									<!-- Product Image -->
									<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
										{#if item.imageUrl}
											<img src={item.imageUrl} alt={item.name} class="h-full w-full object-cover" />
										{:else}
											<div class="flex h-full w-full items-center justify-center">
												<svg
													class="h-8 w-8 text-gray-400"
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

									<!-- Product Info -->
									<div class="min-w-0 flex-1">
										<h4 class="truncate text-sm font-medium text-gray-900">{item.name}</h4>
										{#if item.category}
											<p class="text-xs text-gray-500">{item.category}</p>
										{/if}
										<p class="text-sm font-semibold text-green-600">{formatCurrency(item.price)}</p>
									</div>

									<!-- Quantity Controls -->
									<div class="flex items-center space-x-2">
										<button
											onclick={() => updateQuantity(item.id, item.quantity - 1)}
											class="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
											aria-label="Disminuir cantidad"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M20 12H4"
												/>
											</svg>
										</button>
										<span class="w-8 text-center text-sm font-medium">{item.quantity}</span>
										<button
											onclick={() => updateQuantity(item.id, item.quantity + 1)}
											class="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
											aria-label="Aumentar cantidad"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 6v6m0 0v6m0-6h6m-6 0H6"
												/>
											</svg>
										</button>
									</div>

									<!-- Remove Button -->
									<button
										onclick={() => removeItem(item.id)}
										class="rounded-lg p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
										aria-label="Eliminar producto"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							{/each}
						</div>
					</div>

					<!-- Footer -->
					<div class="border-t bg-gray-50 p-4">
						<!-- Total -->
						<div class="mb-4 flex justify-between text-lg font-semibold">
							<span>Total:</span>
							<span class="text-green-600">{formatCurrency(cartState.total)}</span>
						</div>

						<!-- Actions -->
						<div class="space-y-2">
							<button
								onclick={sendWhatsApp}
								class="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700"
							>
								<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.05-.521-.099-.148-.446-1.075-.612-1.47-.166-.395-.336-.342-.446-.347-.11-.004-.239-.004-.368-.004-.129 0-.347.05-.528.239-.182.19-.698.678-.698 1.652 0 .974.712 1.915.811 2.064.099.148 1.397 2.132 3.383 2.992.473.203.842.324 1.13.415.474.152 0.905.115 1.247.069.38-.051 1.165-.475 1.33-.934.164-.459.164-.85.114-.934-.049-.084-.182-.13-.368-.227zm-6.417 8.096h-.004a9.868 9.868 0 01-5.03-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.435 11.89-11.892 0-3.179-1.235-6.165-3.475-8.413z"
									/>
								</svg>
								Pedir por WhatsApp
							</button>

							<button
								onclick={clearCart}
								class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
							>
								Vaciar Carrito
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
