<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '@prisma/client';

	let searchQuery = $state('');
	let selectedRole = $state('all');
	let selectedStatus = $state('all');
	let sortBy = $state('createdAt');
	let sortOrder = $state('desc');

	const data = $derived($page.data);
	const users = $derived(data?.users || []);
	const stats = $derived(data?.stats);
	const pagination = $derived(data?.pagination);

	// Filter users based on search and filters
	const filteredUsers = $derived(() => {
		let result = [...users];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(user) =>
					user.name.toLowerCase().includes(query) ||
					user.email.toLowerCase().includes(query) ||
					user.phone?.toLowerCase().includes(query)
			);
		}

		// Role filter
		if (selectedRole !== 'all') {
			result = result.filter((user) => user.role === selectedRole);
		}

		// Status filter
		if (selectedStatus !== 'all') {
			result = result.filter((user) => user.status === selectedStatus);
		}

		// Sort
		result.sort((a, b) => {
			const aValue = a[sortBy as keyof typeof a];
			const bValue = b[sortBy as keyof typeof b];

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return result;
	});

	// Status badge styling
	function getStatusClass(status: string) {
		switch (status) {
			case 'ACTIVE':
				return 'bg-green-100 text-green-800';
			case 'INACTIVE':
				return 'bg-gray-100 text-gray-800';
			case 'BLOCKED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getRoleClass(role: string) {
		switch (role) {
			case 'ADMIN':
				return 'bg-purple-100 text-purple-800';
			case 'CUSTOMER':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
		<p class="mt-2 text-gray-600">Administra todos los usuarios del sistema</p>
	</div>

	<!-- Stats Cards -->
	<div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Usuarios</dt>
							<dd class="text-lg font-medium text-gray-900">{stats?.totalUsers || 0}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

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
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Usuarios Activos</dt>
							<dd class="text-lg font-medium text-gray-900">{stats?.activeUsers || 0}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Administradores</dt>
							<dd class="text-lg font-medium text-gray-900">{stats?.adminUsers || 0}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

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
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Nuevos este mes</dt>
							<dd class="text-lg font-medium text-gray-900">{stats?.newUsersThisMonth || 0}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters and Search -->
	<div class="mb-6 rounded-lg bg-white shadow">
		<div class="px-4 py-5 sm:p-6">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
				<div>
					<label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
					<input
						type="text"
						id="search"
						placeholder="Nombre, email, teléfono..."
						bind:value={searchQuery}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					/>
				</div>

				<div>
					<label for="role" class="block text-sm font-medium text-gray-700">Rol</label>
					<select
						id="role"
						bind:value={selectedRole}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="all">Todos los roles</option>
						<option value="ADMIN">Administrador</option>
						<option value="CUSTOMER">Cliente</option>
					</select>
				</div>

				<div>
					<label for="status" class="block text-sm font-medium text-gray-700">Estado</label>
					<select
						id="status"
						bind:value={selectedStatus}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="all">Todos los estados</option>
						<option value="ACTIVE">Activo</option>
						<option value="INACTIVE">Inactivo</option>
						<option value="BLOCKED">Bloqueado</option>
					</select>
				</div>

				<div>
					<label for="sortBy" class="block text-sm font-medium text-gray-700">Ordenar por</label>
					<select
						id="sortBy"
						bind:value={sortBy}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="createdAt">Fecha de creación</option>
						<option value="name">Nombre</option>
						<option value="email">Email</option>
					</select>
				</div>

				<div>
					<label for="sortOrder" class="block text-sm font-medium text-gray-700">Orden</label>
					<select
						id="sortOrder"
						bind:value={sortOrder}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="desc">Descendente</option>
						<option value="asc">Ascendente</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Users Table -->
	<div class="overflow-hidden bg-white shadow sm:rounded-md">
		<div class="px-4 py-5 sm:px-6">
			<h3 class="text-lg leading-6 font-medium text-gray-900">Usuarios ({filteredUsers.length})</h3>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Usuario
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Rol
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Estado
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Pedidos
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
					{#each filteredUsers as user (user.id)}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div>
									<div class="text-sm font-medium text-gray-900">{user.name}</div>
									<div class="text-sm text-gray-500">{user.email}</div>
									{#if user.phone}
										<div class="text-sm text-gray-500">{user.phone}</div>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getRoleClass(
										user.role
									)}"
								>
									{user.role}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusClass(
										user.status
									)}"
								>
									{user.status}
								</span>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{user._count.orders}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatDate(user.createdAt)}
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
								<a href="/admin/users/{user.id}" class="mr-3 text-green-600 hover:text-green-900">
									Ver
								</a>
								<a href="/admin/users/{user.id}/edit" class="text-indigo-600 hover:text-indigo-900">
									Editar
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if filteredUsers.length === 0}
			<div class="py-12 text-center">
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
						d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
				<p class="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	{#if pagination && pagination.totalPages > 1}
		<div
			class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
		>
			<div class="flex flex-1 justify-between sm:hidden">
				<a
					href="#"
					class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Anterior
				</a>
				<a
					href="#"
					class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Siguiente
				</a>
			</div>
			<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p class="text-sm text-gray-700">
						Mostrando
						<span class="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span>
						a
						<span class="font-medium"
							>{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}</span
						>
						de
						<span class="font-medium">{pagination.totalCount}</span>
						resultados
					</p>
				</div>
				<div>
					<nav
						class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
						aria-label="Pagination"
					>
						<a
							href="#"
							class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
						>
							Anterior
						</a>
						{#each Array.from({ length: pagination.totalPages }, (_, i) => i + 1) as page}
							<a
								href="/admin/users?page={page}"
								class="relative inline-flex items-center border px-4 py-2 text-sm font-medium {page ===
								pagination.currentPage
									? 'z-10 border-green-500 bg-green-50 text-green-600'
									: 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}"
							>
								{page}
							</a>
						{/each}
						<a
							href="#"
							class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
						>
							Siguiente
						</a>
					</nav>
				</div>
			</div>
		</div>
	{/if}
</div>
