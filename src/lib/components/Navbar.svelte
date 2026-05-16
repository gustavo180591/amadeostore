<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { page } from '$app/stores';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import { cart } from '$lib/stores/cart';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let mobileMenuOpen = $state(false);
	const cartState = $derived($cart);
	const cartItemCount = $derived(cartState.items.reduce((total, item) => total + item.quantity, 0));

	// Navigation items
	const navItems = [
		{ name: 'Inicio', href: '/' },
		{ name: 'Productos', href: '/products' },
		{ name: 'Catálogo', href: '/catalog' },
		{ name: 'Admin', href: '/admin' }
	];

	// Toggle mobile menu
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Toggle cart
	function toggleCart() {
		cart.toggle();
	}

	// Close mobile menu when clicking outside
	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as Element;
		if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
			mobileMenuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<!-- Desktop Navbar -->
<nav class="bg-white shadow-lg sticky top-0 z-40">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<!-- Logo -->
			<div class="flex items-center">
				<a href={resolve("/")} class="shrink-0 flex items-center">
					<img class="h-8 w-auto" src="/favicon.png" alt="AmadeoStore" />
					<span class="ml-2 text-xl font-bold text-gray-900">AmadeoStore</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				{#each navItems as item (item.href)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a
						href={item.href}
						class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 {$page.url.pathname === item.href ? 'text-blue-600 border-b-2 border-blue-600' : ''}"
					>
						{item.name}
					</a>
				{/each}
			</div>

			<!-- Desktop Actions -->
			<div class="hidden md:flex items-center space-x-4">
				<!-- Search -->
				<button class="text-gray-700 hover:text-blue-600 p-2" aria-label="Buscar productos">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</button>

				<!-- User Account -->
				<a href={resolve("/admin")} class="text-gray-700 hover:text-blue-600 p-2" aria-label="Mi cuenta">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</a>

				<!-- Cart -->
				<button onclick={toggleCart} class="relative text-gray-700 hover:text-blue-600 p-2" aria-label="Carrito de compras">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
					{#if cartItemCount > 0}
						<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							{cartItemCount}
						</span>
					{/if}
				</button>

				<!-- Admin Link -->
				<a href={resolve("/admin")} class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
					Admin
				</a>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden flex items-center">
				<button onclick={toggleMobileMenu} class="menu-button text-gray-700 hover:text-blue-600 p-2" aria-label="Abrir menú">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="mobile-menu md:hidden bg-white border-t border-gray-200">
			<div class="px-2 pt-2 pb-3 space-y-1">
				{#each navItems as item (item.href)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a
						href={item.href}
						class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium {$page.url.pathname === item.href ? 'text-blue-600 bg-blue-50' : ''}"
						onclick={() => mobileMenuOpen = false}
					>
						{item.name}
					</a>
				{/each}
			</div>
			<div class="pt-4 pb-3 border-t border-gray-200">
				<div class="px-2 space-y-1">
					<a href={resolve("/catalog")} class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
						Búsqueda
					</a>
					<a href={resolve("/admin")} class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
						Mi Cuenta
					</a>
					<button onclick={toggleCart} class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium text-left w-full">
						Carrito ({cartItemCount})
					</button>
					<a href={resolve("/admin")} class="bg-blue-600 text-white block px-3 py-2 text-base font-medium hover:bg-blue-700">
						Admin
					</a>
				</div>
			</div>
		</div>
	{/if}
</nav>

<!-- Cart Drawer -->
<CartDrawer />

<style>
	/* Add any additional styles if needed */
</style>
