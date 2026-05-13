<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let searchQuery = $state('');
	let selectedStatus = $state('all');
	let selectedCategory = $state('all');
	let sortBy = $state('createdAt');
	let sortOrder = $state('desc');

	const data = $derived($page.data);
	const products = $derived(data?.products || []);
	const categories = $derived(data?.categories || []);
	const stats = $derived(data?.stats);

	// Filter products based on search and filters
	const filteredProducts = $derived(() => {
		let filtered = [...products];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(product => 
				product.name.toLowerCase().includes(query) ||
				product.sku?.toLowerCase().includes(query) ||
				product.description?.toLowerCase().includes(query) ||
				product.category?.name.toLowerCase().includes(query)
			);
		}

		// Status filter
		if (selectedStatus !== 'all') {
			filtered = filtered.filter(product => product.status === selectedStatus);
		}

		// Category filter
		if (selectedCategory !== 'all') {
			filtered = filtered.filter(product => product.categoryId === selectedCategory);
		}

		// Sort products
		filtered.sort((a, b) => {
			let aValue: any = a[sortBy as keyof typeof a];
			let bValue: any = b[sortBy as keyof typeof b];

			if (sortBy === 'category') {
				aValue = a.category?.name || '';
				bValue = b.category?.name || '';
			}

			if (typeof aValue === 'string') {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	});

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(amount);
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
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
</script>

<svelte:head>
	<title>Productos - Admin | AMADEO STORE</title>
	<meta name="description" content="Gestión de productos de AMADEO STORE" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b border-gray-200">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<h1 class="text-lg font-semibold text-gray-900">Productos</h1>
					<div class="ml-4 flex items-center text-sm text-gray-500">
						{filteredProducts.length} de {products.length} productos
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href="/admin/products/new"
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
						</svg>
						Nuevo Producto
					</a>
					<a href="/admin" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
						← Volver al panel
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	{#if stats}
		<div class="px-4 sm:px-6 lg:px-8 py-6">
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="shrink-0">
								<div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Total Productos</dt>
									<dd class="text-lg font-semibold text-gray-900">{stats.totalProducts}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="shrink-0">
								<div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Activos</dt>
									<dd class="text-lg font-semibold text-gray-900">{stats.activeProducts}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="shrink-0">
								<div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Sin Stock</dt>
									<dd class="text-lg font-semibold text-gray-900">{stats.outOfStockProducts}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="shrink-0">
								<div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Valor Total</dt>
									<dd class="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalValue)}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Filters -->
	<div class="px-4 sm:px-6 lg:px-8 pb-4">
		<div class="bg-white shadow rounded-lg p-4">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
				<div>
					<label for="search" class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
						<input
							id="search"
							type="text"
							bind:value={searchQuery}
							placeholder="Nombre, SKU, descripción..."
							class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
						/>
					</div>
				</div>

				<div>
					<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
					<select
						id="status"
						bind:value={selectedStatus}
						class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
					>
						<option value="all">Todos los estados</option>
						<option value="ACTIVE">Activo</option>
						<option value="INACTIVE">Inactivo</option>
						<option value="OUT_OF_STOCK">Sin Stock</option>
					</select>
				</div>

				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
					<select
						id="category"
						bind:value={selectedCategory}
						class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
					>
						<option value="all">Todas las categorías</option>
						{#each categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
					<select
						id="sortBy"
						bind:value={sortBy}
						class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
					>
						<option value="createdAt">Fecha de creación</option>
						<option value="name">Nombre</option>
						<option value="price">Precio</option>
						<option value="stock">Stock</option>
						<option value="category">Categoría</option>
					</select>
				</div>

				<div>
					<label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-1">Orden</label>
					<select
						id="sortOrder"
						bind:value={sortOrder}
						class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
					>
						<option value="desc">Descendente</option>
						<option value="asc">Ascendente</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Products Table -->
	<div class="px-4 sm:px-6 lg:px-8 pb-8">
		<div class="bg-white shadow overflow-hidden sm:rounded-lg">
			<div class="min-w-full divide-y divide-gray-200">
				<div class="bg-gray-50 px-6 py-3">
					<h3 class="text-lg leading-6 font-medium text-gray-900">Lista de Productos</h3>
				</div>
				
				{#if filteredProducts.length === 0}
					<div class="px-6 py-12 text-center">
						<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
						</svg>
						<h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
						<p class="mt-1 text-sm text-gray-500">
							{searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' 
								? 'Intenta ajustar los filtros de búsqueda' 
								: 'Comienza creando tu primer producto'}
						</p>
						{#if !searchQuery && selectedStatus === 'all' && selectedCategory === 'all'}
							<div class="mt-6">
								<a
									href="/admin/products/new"
									class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
								>
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
									</svg>
									Crear Primer Producto
								</a>
							</div>
						{/if}
					</div>
				{:else}
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Producto
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Categoría
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Precio
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Stock
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Estado
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Fecha
								</th>
								<th scope="col" class="relative px-6 py-3">
									<span class="sr-only">Acciones</span>
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each filteredProducts as product (product.id)}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center">
											<div class="shrink-0 h-10 w-10">
												{#if product.imageUrl}
													<img class="h-10 w-10 rounded-lg object-cover" src={product.imageUrl} alt={product.name} />
												{:else}
													<div class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
														<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
														</svg>
													</div>
												{/if}
											</div>
											<div class="ml-4">
												<div class="text-sm font-medium text-gray-900">{product.name}</div>
												<div class="text-sm text-gray-500">{product.sku || 'Sin SKU'}</div>
											</div>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-900">{product.category?.name || 'Sin categoría'}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-900">{formatCurrency(product.price)}</div>
										{#if product.compareAtPrice}
											<div class="text-sm text-gray-500 line-through">{formatCurrency(product.compareAtPrice)}</div>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-900">{product.stock}</div>
										{#if product.stock <= 5}
											<div class="text-xs text-red-500 font-medium">Stock bajo</div>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusBadge(product.status)}">
											{getStatusText(product.status)}
										</span>
										{#if product.isFeatured}
											<span class="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
												Destacado
											</span>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(product.createdAt)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div class="flex justify-end space-x-2">
											<a
												href="/admin/products/{product.id}/edit"
												class="text-green-600 hover:text-green-900 transition-colors"
												title="Editar producto"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
												</svg>
											</a>
											<button
												type="button"
												class="text-red-600 hover:text-red-900 transition-colors"
												title="Eliminar producto"
												onclick={() => {
													if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
														// TODO: Implement delete functionality
														console.log('Delete product:', product.id);
													}
												}}
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
</div>
