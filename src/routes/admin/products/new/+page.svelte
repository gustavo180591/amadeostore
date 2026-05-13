<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let isLoading = $state(false);
	let selectedCategory = $state('');
	let productStatus = $state('ACTIVE');
	let isFeatured = $state(false);
	let categories = $state<{ id: string; name: string; slug: string }[]>([]);

	const error = $derived($page.form?.error);
	const success = $derived($page.form?.success);

	// Load categories from page data
	$effect(() => {
		if ($page.data?.categories) {
			categories = $page.data.categories;
		}
	});

	// Auto-focus name field on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			const nameInput = document.getElementById('name') as HTMLInputElement;
			if (nameInput) nameInput.focus();
		}
	});
</script>

<svelte:head>
	<title>Nuevo Producto - Admin | AMADEO STORE</title>
	<meta name="description" content="Crear nuevo producto en AMADEO STORE" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b border-gray-200">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<button
						type="button"
						onclick={() => goto('/admin/products')}
						class="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Volver a productos"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
						</svg>
					</button>
					<h1 class="text-lg font-semibold text-gray-900">Nuevo Producto</h1>
				</div>
				<a href="/admin" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
					← Volver al panel
				</a>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<div class="bg-white shadow-lg rounded-xl overflow-hidden">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-xl font-semibold text-gray-900">Información del Producto</h2>
				<p class="mt-1 text-sm text-gray-600">Completa los datos para crear un nuevo producto</p>
			</div>

			<form
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ result }) => {
						isLoading = false;
						if (result.type === 'success') {
							await goto('/admin/products');
						}
					};
				}}
				class="px-6 py-6 space-y-6"
			>
				<!-- Success Message -->
				{#if success}
					<div class="rounded-md bg-green-50 p-4">
						<div class="flex">
							<div class="shrink-0">
								<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-green-800">{success}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Error Message -->
				{#if error}
					<div class="rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-red-800">{error}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Basic Information -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
							Nombre del Producto <span class="text-red-500">*</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: iPhone 15 Pro Max"
						/>
					</div>

					<div>
						<label for="sku" class="block text-sm font-medium text-gray-700 mb-2">
							SKU
						</label>
						<input
							id="sku"
							name="sku"
							type="text"
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: IPHONE15PM256"
						/>
					</div>

					<div>
						<label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
							Slug (URL amigable)
						</label>
						<input
							id="slug"
							name="slug"
							type="text"
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: iphone-15-pro-max"
						/>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
						Descripción
					</label>
					<textarea
						id="description"
						name="description"
						rows="4"
						class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
						placeholder="Describe las características y beneficios del producto..."
					></textarea>
				</div>

				<!-- Pricing and Stock -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div>
						<label for="price" class="block text-sm font-medium text-gray-700 mb-2">
							Precio <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input
								id="price"
								name="price"
								type="number"
								step="0.01"
								min="0"
								required
								class="block w-full pl-7 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
								placeholder="0.00"
							/>
						</div>
					</div>

					<div>
						<label for="compareAtPrice" class="block text-sm font-medium text-gray-700 mb-2">
							Precio Comparación
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input
								id="compareAtPrice"
								name="compareAtPrice"
								type="number"
								step="0.01"
								min="0"
								class="block w-full pl-7 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
								placeholder="0.00"
							/>
						</div>
					</div>

					<div>
						<label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
							Stock <span class="text-red-500">*</span>
						</label>
						<input
							id="stock"
							name="stock"
							type="number"
							min="0"
							required
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="0"
						/>
					</div>
				</div>

				<!-- Category and Status -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<label for="categoryId" class="block text-sm font-medium text-gray-700 mb-2">
							Categoría
						</label>
						<select
							id="categoryId"
							name="categoryId"
							bind:value={selectedCategory}
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
						>
							<option value="">Seleccionar categoría</option>
							{#each categories as category (category.id)}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="status" class="block text-sm font-medium text-gray-700 mb-2">
							Estado
						</label>
						<select
							id="status"
							name="status"
							bind:value={productStatus}
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
						>
							<option value="ACTIVE">Activo</option>
							<option value="INACTIVE">Inactivo</option>
							<option value="OUT_OF_STOCK">Sin Stock</option>
						</select>
					</div>
				</div>

				<!-- Image URL -->
				<div>
					<label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
						URL de Imagen Principal
					</label>
					<input
						id="imageUrl"
						name="imageUrl"
						type="url"
						class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
						placeholder="https://ejemplo.com/imagen.jpg"
					/>
				</div>

				<!-- Featured Product -->
				<div class="flex items-center">
					<input
						id="isFeatured"
						name="isFeatured"
						type="checkbox"
						bind:checked={isFeatured}
						class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
					/>
					<label for="isFeatured" class="ml-2 block text-sm text-gray-700">
						Producto destacado
					</label>
				</div>

				<!-- Actions -->
				<div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
					<button
						type="button"
						onclick={() => goto('/admin/products')}
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={isLoading}
						class="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{#if isLoading}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Creando...
						{:else}
							Crear Producto
						{/if}
					</button>
				</div>
			</form>
		</div>
	</main>
</div>

<style>
	/* Custom animations */
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
