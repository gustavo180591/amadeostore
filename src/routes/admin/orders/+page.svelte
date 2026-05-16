<script lang="ts">
	import { page } from '$app/stores';
	import type { OrderStatus, PaymentStatus } from '@prisma/client';

	let searchQuery = $state('');
	let selectedStatus = $state('all');
	let selectedPaymentStatus = $state('all');
	let sortBy = $state('createdAt');
	let sortOrder = $state('desc');

	const data = $derived($page.data);
	const orders = $derived(data?.orders || []);
	const stats = $derived(data?.stats);
	const pagination = $derived(data?.pagination);

	// Filter orders based on search and filters
	const filteredOrders = $derived(() => {
		let result = [...orders];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(order) =>
					order.user.name.toLowerCase().includes(query) ||
					order.user.email.toLowerCase().includes(query) ||
					order.id.toLowerCase().includes(query)
			);
		}

		// Status filter
		if (selectedStatus !== 'all') {
			result = result.filter((order) => order.status === selectedStatus);
		}

		// Payment status filter
		if (selectedPaymentStatus !== 'all') {
			result = result.filter((order) => order.paymentStatus === selectedPaymentStatus);
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
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'CONFIRMED':
				return 'bg-blue-100 text-blue-800';
			case 'PREPARING':
				return 'bg-purple-100 text-purple-800';
			case 'SHIPPED':
				return 'bg-indigo-100 text-indigo-800';
			case 'DELIVERED':
				return 'bg-green-100 text-green-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getPaymentStatusClass(status: string) {
		switch (status) {
			case 'PAID':
				return 'bg-green-100 text-green-800';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'FAILED':
				return 'bg-red-100 text-red-800';
			case 'REFUNDED':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS'
		}).format(amount);
	}

	function getOrderTotal(order: any) {
		return order.orderItems.reduce((sum: number, item: any) => {
			return sum + Number(item.price) * item.quantity;
		}, 0);
	}
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
		<p class="mt-2 text-gray-600">Administra todos los pedidos del sistema</p>
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
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Pedidos</dt>
							<dd class="text-lg font-medium text-gray-900">{stats?.totalOrders || 0}</dd>
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
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Ingresos Totales</dt>
							<dd class="text-lg font-medium text-gray-900">
								{formatCurrency(stats?.totalRevenue || 0)}
							</dd>
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
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Pedidos Pendientes</dt>
							<dd class="text-lg font-medium text-gray-900">{stats?.pendingOrders || 0}</dd>
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
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Valor Promedio</dt>
							<dd class="text-lg font-medium text-gray-900">
								{formatCurrency(stats?.averageOrderValue || 0)}
							</dd>
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
						placeholder="ID, cliente, email..."
						bind:value={searchQuery}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					/>
				</div>

				<div>
					<label for="status" class="block text-sm font-medium text-gray-700">Estado</label>
					<select
						id="status"
						bind:value={selectedStatus}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="all">Todos los estados</option>
						<option value="PENDING">Pendiente</option>
						<option value="CONFIRMED">Confirmado</option>
						<option value="PREPARING">Preparando</option>
						<option value="SHIPPED">Enviado</option>
						<option value="DELIVERED">Entregado</option>
						<option value="CANCELLED">Cancelado</option>
					</select>
				</div>

				<div>
					<label for="paymentStatus" class="block text-sm font-medium text-gray-700"
						>Estado Pago</label
					>
					<select
						id="paymentStatus"
						bind:value={selectedPaymentStatus}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="all">Todos los pagos</option>
						<option value="PENDING">Pendiente</option>
						<option value="PAID">Pagado</option>
						<option value="FAILED">Fallido</option>
						<option value="REFUNDED">Reembolsado</option>
					</select>
				</div>

				<div>
					<label for="sortBy" class="block text-sm font-medium text-gray-700">Ordenar por</label>
					<select
						id="sortBy"
						bind:value={sortBy}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
					>
						<option value="createdAt">Fecha</option>
						<option value="totalAmount">Total</option>
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

	<!-- Orders Table -->
	<div class="overflow-hidden bg-white shadow sm:rounded-md">
		<div class="px-4 py-5 sm:px-6">
			<h3 class="text-lg leading-6 font-medium text-gray-900">Pedidos ({filteredOrders.length})</h3>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Pedido
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Cliente
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Estado
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Pago
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Total
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
					{#each filteredOrders as order (order.id)}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div>
									<div class="text-sm font-medium text-gray-900">#{order.id.slice(-8)}</div>
									<div class="text-sm text-gray-500">{order._count.orderItems} productos</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div>
									<div class="text-sm font-medium text-gray-900">{order.user.name}</div>
									<div class="text-sm text-gray-500">{order.user.email}</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusClass(
										order.status
									)}"
								>
									{order.status}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getPaymentStatusClass(
										order.paymentStatus
									)}"
								>
									{order.paymentStatus}
								</span>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
								{formatCurrency(getOrderTotal(order))}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatDate(order.createdAt)}
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
								<a href="/admin/orders/{order.id}" class="mr-3 text-green-600 hover:text-green-900">
									Ver
								</a>
								<a
									href="/admin/orders/{order.id}/edit"
									class="text-indigo-600 hover:text-indigo-900"
								>
									Editar
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if filteredOrders.length === 0}
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
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron pedidos</h3>
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
								href="/admin/orders?page={page}"
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
