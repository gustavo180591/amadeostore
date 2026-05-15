<script lang="ts">
	import { page } from '$app/stores';

	const data = $derived($page.data);
	const categories = $derived(data?.categories || []);
	const stats = $derived(data?.stats);

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	};

	// Toggle category active status
	const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
		try {
			const response = await fetch(`/admin/categories/api/${categoryId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ isActive: !currentStatus })
			});

			if (response.ok) {
				// Refresh the page to show updated data
				window.location.reload();
			} else {
				console.error('Error updating category status');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	// Delete category
	const deleteCategory = async (categoryId: string, categoryName: string) => {
		if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer.`)) {
			return;
		}

		try {
			const response = await fetch(`/admin/categories/api/${categoryId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// Refresh the page to show updated data
				window.location.reload();
			} else {
				console.error('Error deleting category');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};
</script>

<svelte:head>
	<title>Categorías - AMADEO STORE Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Categorías</h1>
					<p class="mt-1 text-sm text-gray-600">Gestiona las categorías de productos</p>
				</div>
				<a
					href="/admin/categories/new"
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
					rel="external"
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
					</svg>
					Nueva Categoría
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="shrink-0 bg-blue-100 rounded-lg p-3">
						<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm text-gray-600">Total Categorías</p>
						<p class="text-2xl font-bold text-gray-900">{stats?.totalCategories || 0}</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="shrink-0 bg-green-100 rounded-lg p-3">
						<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm text-gray-600">Activas</p>
						<p class="text-2xl font-bold text-gray-900">{stats?.activeCategories || 0}</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="shrink-0 bg-red-100 rounded-lg p-3">
						<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm text-gray-600">Inactivas</p>
						<p class="text-2xl font-bold text-gray-900">{stats?.inactiveCategories || 0}</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="shrink-0 bg-purple-100 rounded-lg p-3">
						<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm text-gray-600">Total Productos</p>
						<p class="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Categories Table -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-medium text-gray-900">Lista de Categorías</h2>
			</div>
			
			{#if categories.length === 0}
				<div class="px-6 py-12 text-center">
					<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
					</svg>
					<h3 class="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
					<p class="text-gray-600 mb-4">Comienza creando tu primera categoría</p>
					<a
						href="/admin/categories/new"
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
						rel="external"
					>
						Crear Categoría
					</a>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Categoría
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Slug
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Productos
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Orden
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Estado
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Fecha
								</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each categories as category (category.id)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center">
											{#if category.imageUrl}
												<img src={category.imageUrl} alt={category.name} class="w-10 h-10 rounded-lg object-cover mr-3" />
											{:else}
												<div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
													<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
													</svg>
												</div>
											{/if}
											<div>
												<div class="text-sm font-medium text-gray-900">{category.name}</div>
												{#if category.description}
													<div class="text-sm text-gray-500">{category.description}</div>
												{/if}
											</div>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm text-gray-900">{category.slug}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm text-gray-900">{category._count.products}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm text-gray-900">{category.sortOrder}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if category.isActive}
											<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
												Activa
											</span>
										{:else}
											<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
												Inactiva
											</span>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(category.createdAt)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div class="flex justify-end space-x-2">
											<button
												onclick={() => toggleCategoryStatus(category.id, category.isActive)}
												class="text-gray-600 hover:text-gray-900 transition-colors"
												title={category.isActive ? 'Desactivar' : 'Activar'}
											>
												{#if category.isActive}
													<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
													</svg>
												{:else}
													<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
													</svg>
												{/if}
											</button>
											<button
												onclick={() => deleteCategory(category.id, category.name)}
												class="text-red-600 hover:text-red-900 transition-colors"
												title="Eliminar"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>
