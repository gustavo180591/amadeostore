<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Logout function
	async function logout() {
		try {
			await fetch('/admin/logout', { method: 'POST' });
			await goto('/admin/login');
		} catch (error) {
			console.error('Logout error:', error);
			// Fallback: redirect anyway
			await goto('/admin/login');
		}
	}

	const currentPath = $derived($page.url.pathname);
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:inset-0">
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex h-16 items-center justify-center border-b border-gray-200 bg-green-600">
				<h1 class="text-xl font-bold text-white">AMADEO STORE</h1>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-1 px-3 py-4">
				<a
					href="/admin"
					class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
					class:bg-green-100={currentPath === '/admin'}
					class:text-green-700={currentPath === '/admin'}
					class:text-gray-700={currentPath !== '/admin'}
					class:hover:bg-gray-100={currentPath !== '/admin'}
				>
					<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
					Dashboard
				</a>

				<a
					href="/admin/products"
					class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
					class:bg-green-100={currentPath.startsWith('/admin/products')}
					class:text-green-700={currentPath.startsWith('/admin/products')}
					class:text-gray-700={!currentPath.startsWith('/admin/products')}
					class:hover:bg-gray-100={!currentPath.startsWith('/admin/products')}
				>
					<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
					Productos
				</a>

				<a
					href="/admin/categories"
					class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
					class:bg-green-100={currentPath.startsWith('/admin/categories')}
					class:text-green-700={currentPath.startsWith('/admin/categories')}
					class:text-gray-700={!currentPath.startsWith('/admin/categories')}
					class:hover:bg-gray-100={!currentPath.startsWith('/admin/categories')}
				>
					<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
						/>
					</svg>
					Categorías
				</a>

				<a
					href="/admin/orders"
					class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
					class:bg-green-100={currentPath.startsWith('/admin/orders')}
					class:text-green-700={currentPath.startsWith('/admin/orders')}
					class:text-gray-700={!currentPath.startsWith('/admin/orders')}
					class:hover:bg-gray-100={!currentPath.startsWith('/admin/orders')}
				>
					<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					Pedidos
				</a>

				<a
					href="/admin/settings"
					class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
					class:bg-green-100={currentPath.startsWith('/admin/settings')}
					class:text-green-700={currentPath.startsWith('/admin/settings')}
					class:text-gray-700={!currentPath.startsWith('/admin/settings')}
					class:hover:bg-gray-100={!currentPath.startsWith('/admin/settings')}
				>
					<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Configuración
				</a>
			</nav>

			<!-- User Menu -->
			<div class="border-t border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-900">{data.user?.name || 'Admin'}</p>
						<p class="text-xs text-gray-500">{data.user?.email}</p>
					</div>
					<button
						onclick={logout}
						class="text-gray-400 transition-colors hover:text-gray-600"
						title="Cerrar sesión"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="lg:pl-64">
		<!-- Top Bar -->
		<div class="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
			<div class="px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<!-- Mobile menu button -->
					<button class="lg:hidden">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>

					<!-- Page Title -->
					<div>
						<h1 class="text-lg font-semibold text-gray-900">Panel de Administración</h1>
					</div>

					<!-- Actions -->
					<div class="flex items-center space-x-4">
						<a
							href="/"
							class="text-sm text-gray-500 transition-colors hover:text-gray-700"
							target="_blank"
						>
							Ver tienda →
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Page Content -->
		<main class="flex-1">
			{@render children()}
		</main>
	</div>
</div>

<!-- Mobile sidebar overlay (hidden by default) -->
<div
	class="bg-opacity-75 fixed inset-0 z-40 hidden bg-gray-600 lg:hidden"
	id="mobile-sidebar-overlay"
></div>
