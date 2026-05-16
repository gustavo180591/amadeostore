<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let sidebarOpen = false;
	let isMobile = false;

	// Navigation items for admin
	const adminNavItems = [
		{
			name: 'Dashboard',
			href: '/admin',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			name: 'Productos',
			href: '/admin/products',
			icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
		},
		{
			name: 'Categorías',
			href: '/admin/categories',
			icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
		},
		{
			name: 'Usuarios',
			href: '/admin/users',
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
		},
		{
			name: 'Pedidos',
			href: '/admin/orders',
			icon: 'M16 11V7a4 4 0 00-8 0v4M4 18h16a2 2 0 002-2v-5a2 2 0 00-2-2H4a2 2 0 00-2 2v5a2 2 0 002 2z'
		},
		{
			name: 'Configuración',
			href: '/admin/settings',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
		},
		{
			name: 'Analytics',
			href: '/admin/analytics',
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
		}
	];

	// Toggle sidebar
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	// Check if mobile
	function checkMobile() {
		isMobile = window.innerWidth < 768;
		if (isMobile) {
			sidebarOpen = false;
		} else {
			sidebarOpen = true;
		}
	}

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	// Close sidebar on mobile when clicking outside
	function handleOutsideClick(event: MouseEvent) {
		if (isMobile && sidebarOpen) {
			const target = event.target as Element;
			if (!target.closest('.sidebar') && !target.closest('.sidebar-toggle')) {
				sidebarOpen = false;
			}
		}
	}

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<!-- Mobile sidebar toggle button -->
{#if isMobile}
	<button
		on:click={toggleSidebar}
		class="sidebar-toggle fixed top-4 left-4 z-50 rounded-md bg-blue-600 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700"
	>
		<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	</button>
{/if}

<!-- Sidebar -->
<div
	class="sidebar fixed top-0 left-0 z-40 h-full bg-gray-900 text-white transition-all duration-300 {sidebarOpen
		? 'w-64'
		: 'w-0 overflow-hidden'} {isMobile ? 'shadow-2xl' : ''}"
>
	<div class="flex h-full flex-col">
		<!-- Sidebar Header -->
		<div class="flex items-center justify-between border-b border-gray-700 p-4">
			<div class="flex items-center">
				<img class="h-8 w-auto" src="/favicon.png" alt="AmadeoStore" />
				<span class="ml-2 text-lg font-semibold">Admin</span>
			</div>
			{#if isMobile}
				<button on:click={toggleSidebar} class="text-gray-400 hover:text-white">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			{/if}
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-2 p-4">
			{#each adminNavItems as item}
				<a
					href={item.href}
					class="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white {$page.url.pathname.startsWith(
						item.href
					) && item.href !== '/admin'
						? 'bg-gray-700 text-white'
						: ''} {$page.url.pathname === item.href ? 'bg-gray-700 text-white' : ''}"
					on:click={() => {
						if (isMobile) {
							sidebarOpen = false;
						}
					}}
				>
					<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
					</svg>
					<span class="font-medium">{item.name}</span>
				</a>
			{/each}
		</nav>

		<!-- Sidebar Footer -->
		<div class="border-t border-gray-700 p-4">
			<div class="flex items-center space-x-3 px-3 py-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
					<span class="text-sm font-medium">A</span>
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium text-white">Admin User</p>
					<p class="text-xs text-gray-400">admin@amadeostore.com</p>
				</div>
			</div>
			<div class="mt-4 space-y-2">
				<a
					href="/"
					class="block px-3 py-2 text-sm text-gray-300 transition-colors duration-200 hover:text-white"
				>
					Ver Tienda
				</a>
				<a
					href="/logout"
					class="block px-3 py-2 text-sm text-gray-300 transition-colors duration-200 hover:text-white"
				>
					Cerrar Sesión
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Mobile overlay -->
{#if isMobile && sidebarOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-30 bg-black"
		on:click={() => (sidebarOpen = false)}
	></div>
{/if}

<style>
	/* Add any additional styles if needed */
</style>
