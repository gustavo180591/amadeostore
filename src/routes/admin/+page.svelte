<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(price);
	}
</script>

<svelte:head>
	<title>Dashboard - Admin | AMADEO STORE</title>
	<meta name="description" content="Panel de administración de AMADEO STORE" />
</svelte:head>

<div class="p-6">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
		<p class="text-gray-600">Resumen general de tu tienda</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Products Count -->
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Productos</dt>
							<dd class="text-lg font-semibold text-gray-900">{data.stats.productsCount}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<!-- Categories Count -->
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Categorías</dt>
							<dd class="text-lg font-semibold text-gray-900">{data.stats.categoriesCount}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<!-- Stock Value -->
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Valor del Stock</dt>
							<dd class="text-lg font-semibold text-gray-900">
								{formatPrice(data.stats.totalStockValue)}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<!-- Low Stock Alert -->
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-md bg-red-500">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Stock Bajo</dt>
							<dd class="text-lg font-semibold text-gray-900">{data.stats.lowStockCount}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Recent Products -->
		<div class="rounded-lg bg-white shadow">
			<div class="px-4 py-5 sm:p-6">
				<h3 class="mb-4 text-lg leading-6 font-medium text-gray-900">Productos Recientes</h3>
				<div class="flow-root">
					<ul class="-my-5 divide-y divide-gray-200">
						{#each data.recentProducts as product (product.id)}
							<li class="py-4">
								<div class="flex items-center space-x-4">
									<div class="shrink-0">
										<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
											<svg
												class="h-4 w-4 text-gray-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
												/>
											</svg>
										</div>
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium text-gray-900">{product.name}</p>
										<p class="text-sm text-gray-500">{formatPrice(Number(product.price))}</p>
									</div>
									<div>
										<span
											class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {product.stock >
											5
												? 'bg-green-100 text-green-800'
												: 'bg-red-100 text-red-800'}"
										>
											Stock: {product.stock}
										</span>
									</div>
								</div>
							</li>
						{/each}
						{#if data.recentProducts.length === 0}
							<li class="py-4">
								<p class="text-center text-sm text-gray-500">No hay productos registrados</p>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>

		<!-- Low Stock Products -->
		<div class="rounded-lg bg-white shadow">
			<div class="px-4 py-5 sm:p-6">
				<h3 class="mb-4 text-lg leading-6 font-medium text-gray-900">Productos con Stock Bajo</h3>
				<div class="flow-root">
					<ul class="-my-5 divide-y divide-gray-200">
						{#each data.lowStockProducts as product (product.id)}
							<li class="py-4">
								<div class="flex items-center space-x-4">
									<div class="shrink-0">
										<div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
											<svg
												class="h-4 w-4 text-red-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
												/>
											</svg>
										</div>
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium text-gray-900">{product.name}</p>
										{#if product.category}
											<p class="text-sm text-gray-500">{product.category.name}</p>
										{/if}
									</div>
									<div>
										<span
											class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
										>
											{product.stock} unidades
										</span>
									</div>
								</div>
							</li>
						{/each}
						{#if data.lowStockProducts.length === 0}
							<li class="py-4">
								<p class="text-center text-sm text-gray-500">
									✅ Todos los productos tienen stock adecuado
								</p>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="mt-8">
		<div class="rounded-lg bg-white shadow">
			<div class="px-4 py-5 sm:p-6">
				<h3 class="mb-4 text-lg leading-6 font-medium text-gray-900">Acciones Rápidas</h3>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<a
						href={resolve('/admin/products/new')}
						class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Nuevo Producto
					</a>

					<a
						href={resolve('/admin/categories/new')}
						class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							/>
						</svg>
						Nueva Categoría
					</a>

					<a
						href={resolve('/admin/products')}
						class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							/>
						</svg>
						Ver Productos
					</a>

					<a
						href={resolve('/admin/settings')}
						class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				</div>
			</div>
		</div>
	</div>
</div>
