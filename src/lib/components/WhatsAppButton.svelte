<script lang="ts">
	import { cart } from '$lib/stores/cart';

	let {
		showIcon = true,
		text = 'Pedir por WhatsApp',
		size = 'md', // sm, md, lg
		variant = 'primary', // primary, secondary, outline, floating
		customerInfo = undefined
	}: {
		showIcon?: boolean;
		text?: string;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'primary' | 'secondary' | 'outline' | 'floating';
		customerInfo?: {
			name?: string;
			email?: string;
			phone?: string;
			address?: string;
		} | undefined;
	} = $props();

	const cartState = $derived($cart);
	const itemCount = $derived(cartState.count);

	async function handleWhatsAppClick() {
		await cart.sendWhatsApp(customerInfo);
	}

	// Size classes
	const sizeClasses: Record<string, string> = {
		sm: 'px-3 py-2 text-sm',
		md: 'px-4 py-3 text-base',
		lg: 'px-6 py-4 text-lg'
	};

	// Variant classes
	const variantClasses: Record<string, string> = {
		primary: 'bg-green-600 text-white hover:bg-green-700 shadow-lg',
		secondary: 'bg-gray-800 text-white hover:bg-gray-900 shadow-lg',
		outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
	};

	// Icon size
	const iconSizes: Record<string, string> = {
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-6 w-6'
	};
</script>

<button
	onclick={handleWhatsAppClick}
	class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 {sizeClasses[size]} {variantClasses[variant]}"
	disabled={itemCount === 0}
	title={itemCount === 0 ? 'Agrega productos al carrito para pedir' : 'Pedir por WhatsApp'}
>
	{#if showIcon}
		<svg
			class="{iconSizes[size]} {itemCount > 0 ? 'mr-2' : ''}"
			fill="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.05-.521-.099-.148-.446-1.075-.612-1.47-.166-.395-.336-.342-.446-.347-.11-.004-.239-.004-.368-.004-.129 0-.347.05-.528.239-.182.19-.698.678-.698 1.652 0 .974.712 1.915.811 2.064.099.148 1.397 2.132 3.383 2.992.473.203.842.324 1.13.415.474.152 0.905.115 1.247.069.38-.051 1.165-.475 1.33-.934.164-.459.164-.85.114-.934-.049-.084-.182-.13-.368-.227zm-6.417 8.096h-.004a9.868 9.868 0 01-5.03-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.435 11.89-11.892 0-3.179-1.235-6.165-3.475-8.413z"/>
		</svg>
	{/if}
	
	{#if itemCount > 0}
		{text}
	{:else}
		<span class="text-sm opacity-75">Carrito vacío</span>
	{/if}
</button>

<!-- Floating WhatsApp Button for mobile -->
{#if variant === 'floating'}
	<div class="fixed bottom-6 right-6 z-40">
		<button
			onclick={handleWhatsAppClick}
			class="flex items-center justify-center h-14 w-14 rounded-full bg-green-600 text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
			disabled={itemCount === 0}
			title={itemCount === 0 ? 'Agrega productos al carrito para pedir' : 'Pedir por WhatsApp'}
		>
			{#if itemCount > 0}
				<span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
					{itemCount}
				</span>
			{/if}
			<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.05-.521-.099-.148-.446-1.075-.612-1.47-.166-.395-.336-.342-.446-.347-.11-.004-.239-.004-.368-.004-.129 0-.347.05-.528.239-.182.19-.698.678-.698 1.652 0 .974.712 1.915.811 2.064.099.148 1.397 2.132 3.383 2.992.473.203.842.324 1.13.415.474.152 0.905.115 1.247.069.38-.051 1.165-.475 1.33-.934.164-.459.164-.85.114-.934-.049-.084-.182-.13-.368-.227zm-6.417 8.096h-.004a9.868 9.868 0 01-5.03-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.435 11.89-11.892 0-3.179-1.235-6.165-3.475-8.413z"/>
			</svg>
		</button>
	</div>
{/if}
