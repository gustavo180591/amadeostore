<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let isLoading = $state(false);
	let selectedCategory = $state('');
	let productStatus = $state('ACTIVE');
	let isFeatured = $state(false);
	let categories = $state<{ id: string; name: string; slug: string }[]>([]);
	let uploadedImages = $state<{ url: string; id: string }[]>([]);
	let isUploading = $state(false);
	let uploadError = $state('');

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

	// Handle image upload for new product
	const handleImageUpload = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		
		if (!files || files.length === 0) return;

		isUploading = true;
		uploadError = '';

		try {
			for (const file of Array.from(files)) {
				const formData = new FormData();
				formData.append('image', file);

				const response = await fetch('/api/upload', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					const error = await response.text();
					throw new Error(error);
				}

				const result = await response.json();
				
				if (result.success && result.imageUrl && result.imageId) {
					uploadedImages = [...uploadedImages, { url: result.imageUrl, id: result.imageId }];
				} else {
					throw new Error(result.error || 'Error al subir imagen');
				}
			}

			// Clear file input
			target.value = '';
		} catch (error) {
			uploadError = error instanceof Error ? error.message : 'Error al subir la imagen';
		} finally {
			isUploading = false;
		}
	};

	// Handle image deletion
	const deleteImage = async (imageId: string) => {
		if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

		try {
			const response = await fetch('/api/upload', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ imageId })
			});

			if (!response.ok) {
				throw new Error('Error al eliminar imagen');
			}

			uploadedImages = uploadedImages.filter(img => img.id !== imageId);
		} catch (error) {
			uploadError = error instanceof Error ? error.message : 'Error al eliminar la imagen';
		}
	};
</script>

<svelte:head>
	<title>Nuevo Producto - Admin | AMADEO STORE</title>
	<meta name="description" content="Crear nuevo producto en AMADEO STORE" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="border-b border-gray-200 bg-white shadow-sm">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<button
						type="button"
						onclick={() => goto('/admin/products')}
						class="mr-4 text-gray-400 transition-colors hover:text-gray-600"
						aria-label="Volver a productos"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							></path>
						</svg>
					</button>
					<h1 class="text-lg font-semibold text-gray-900">Nuevo Producto</h1>
				</div>
				<a href="/admin" class="text-sm text-gray-500 transition-colors hover:text-gray-700">
					← Volver al panel
				</a>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="overflow-hidden rounded-xl bg-white shadow-lg">
			<div class="border-b border-gray-200 px-6 py-4">
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
				class="space-y-6 px-6 py-6"
			>
				<!-- Success Message -->
				{#if success}
					<div class="rounded-md bg-green-50 p-4">
						<div class="flex">
							<div class="shrink-0">
								<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
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
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									/>
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
						<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
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
						<label for="sku" class="mb-2 block text-sm font-medium text-gray-700"> SKU </label>
						<input
							id="sku"
							name="sku"
							type="text"
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: IPHONE15PM256"
						/>
					</div>

					<div>
						<label for="slug" class="mb-2 block text-sm font-medium text-gray-700">
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
					<label for="description" class="mb-2 block text-sm font-medium text-gray-700">
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
						<label for="price" class="mb-2 block text-sm font-medium text-gray-700">
							Precio <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input
								id="price"
								name="price"
								type="number"
								step="0.01"
								min="0"
								required
								class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-7 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
								placeholder="0.00"
							/>
						</div>
					</div>

					<div>
						<label for="compareAtPrice" class="mb-2 block text-sm font-medium text-gray-700">
							Precio Comparación
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input
								id="compareAtPrice"
								name="compareAtPrice"
								type="number"
								step="0.01"
								min="0"
								class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-7 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
								placeholder="0.00"
							/>
						</div>
					</div>

					<div>
						<label for="stock" class="mb-2 block text-sm font-medium text-gray-700">
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
						<label for="categoryId" class="mb-2 block text-sm font-medium text-gray-700">
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
						<label for="status" class="mb-2 block text-sm font-medium text-gray-700">
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

				<!-- Image Upload -->
				<div>
					<label for="imageUpload" class="mb-2 block text-sm font-medium text-gray-700">
						Imágenes del Producto
					</label>
					<div class="mt-1">
						<div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
							<div class="space-y-1 text-center">
								<svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
									<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
								<div class="flex text-sm text-gray-600">
									<label for="imageUpload" class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
										<span>Subir archivos</span>
										<input id="imageUpload" name="imageUpload" type="file" class="sr-only" accept="image/*" multiple onchange={handleImageUpload} />
									</label>
									<p class="pl-1">o arrastrar y soltar</p>
								</div>
								<p class="text-xs text-gray-500">PNG, JPG, WebP hasta 5MB</p>
							</div>
						</div>
					</div>

					<!-- Uploaded Images -->
					{#if uploadedImages.length > 0}
						<div class="mt-4">
							<h4 class="text-sm font-medium text-gray-700 mb-2">Imágenes subidas</h4>
							<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
								{#each uploadedImages as image (image.id)}
									<div class="relative group">
										<img 
											src={image.url} 
											alt="Imagen del producto"
											class="w-full h-24 object-cover rounded-lg border border-gray-200"
										/>
										<button
											type="button"
											onclick={() => deleteImage(image.id)}
											class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
											title="Eliminar imagen"
										>
											<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
											</svg>
										</button>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Upload Progress -->
					{#if isUploading}
						<div class="mt-2">
							<div class="bg-blue-50 border border-blue-200 rounded-md p-3">
								<div class="flex">
									<div class="shrink-0">
										<svg class="h-5 w-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									</div>
									<div class="ml-3">
										<p class="text-sm font-medium text-blue-800">Subiendo imagen...</p>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Upload Error -->
					{#if uploadError}
						<div class="mt-2">
							<div class="bg-red-50 border border-red-200 rounded-md p-3">
								<div class="flex">
									<div class="shrink-0">
										<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
										</svg>
									</div>
									<div class="ml-3">
										<p class="text-sm font-medium text-red-800">{uploadError}</p>
									</div>
								</div>
							</div>
						</div>
					{/if}
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
				<div class="flex justify-end space-x-3 border-t border-gray-200 pt-6">
					<button
						type="button"
						onclick={() => goto('/admin/products')}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={isLoading}
						class="rounded-lg border border-transparent bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
							<svg
								class="mr-3 -ml-1 inline h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
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
