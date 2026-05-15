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
		if (
			!confirm(
				`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer.`
			)
		) {
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
	<div class="border-b bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-6">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Categorías</h1>
					<p class="mt-1 text-sm text-gray-600">Gestiona las categorías de productos</p>
				</div>
				<a
					href="/admin/categories/new"
					class="inline-flex items-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
					rel="external"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Nueva Categoría
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-4">
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="shrink-0 rounded-lg bg-blue-100 p-3">
						<svg
							class="h-6 w-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							></path>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm text-gray-600">Total Categorías</p>
						<p class="text-2xl font-bold text-gray-900">{stats?.totalCategories || 0}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="shrink-0 rounded-lg bg-green-100 p-3">
						<svg
							class="h-6 w-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm text-gray-600">Activas</p>
						<p class="text-2xl font-bold text-gray-900">{stats?.activeCategories || 0}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="shrink-0 rounded-lg bg-red-100 p-3">
						<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm text-gray-600">Inactivas</p>
						<p class="text-2xl font-bold text-gray-900">{stats?.inactiveCategories || 0}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="shrink-0 rounded-lg bg-purple-100 p-3">
						<svg
							class="h-6 w-6 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							></path>
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
	<div class="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white shadow">
			<div class="border-b border-gray-200 px-6 py-4">
				<h2 class="text-lg font-medium text-gray-900">Lista de Categorías</h2>
			</div>

			{#if categories.length === 0}
				<div class="px-6 py-12 text-center">
					<svg
						class="mx-auto mb-4 h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						></path>
					</svg>
					<h3 class="mb-2 text-lg font-medium text-gray-900">No hay categorías</h3>
					<p class="mb-4 text-gray-600">Comienza creando tu primera categoría</p>
					<a
						href="/admin/categories/new"
						class="inline-flex items-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
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
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Categoría
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Slug
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Productos
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Orden
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Estado
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Fecha
								</th>
								<th
									class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									Acciones
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each categories as category (category.id)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center">
											{#if category.imageUrl}
												<img
													src={category.imageUrl}
													alt={category.name}
													class="mr-3 h-10 w-10 rounded-lg object-cover"
												/>
											{:else}
												<div
													class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200"
												>
													<svg
														class="h-6 w-6 text-gray-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
														></path>
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
											<span
												class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800"
											>
												Activa
											</span>
										{:else}
											<span
												class="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800"
											>
												Inactiva
											</span>
										{/if}
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
										{formatDate(category.createdAt)}
									</td>
									<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
										<div class="flex justify-end space-x-2">
											<button
												onclick={() => toggleCategoryStatus(category.id, category.isActive)}
												class="text-gray-600 transition-colors hover:text-gray-900"
												title={category.isActive ? 'Desactivar' : 'Activar'}
											>
												{#if category.isActive}
													<svg
														class="h-5 w-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
														></path>
													</svg>
												{:else}
													<svg
														class="h-5 w-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														></path>
													</svg>
												{/if}
											</button>
											<button
												onclick={() => deleteCategory(category.id, category.name)}
												class="text-red-600 transition-colors hover:text-red-900"
												title="Eliminar"
											>
												<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													></path>
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
