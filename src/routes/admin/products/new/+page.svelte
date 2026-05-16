<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let isLoading = $state(false);
	let selectedCategory = $state('');
	let productStatus = $state('DRAFT');
	let isFeatured = $state(false);
	let categories = $state<{ id: string; name: string; slug: string }[]>([]);
	let uploadedImages = $state<{ url: string; id: string }[]>([]);
	let primaryImageIndex = $state(0); // Index of the primary image
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

			const imageIndex = uploadedImages.findIndex((img) => img.id === imageId);
			uploadedImages = uploadedImages.filter((img) => img.id !== imageId);

			// Adjust primary image index if necessary
			if (primaryImageIndex >= uploadedImages.length && uploadedImages.length > 0) {
				primaryImageIndex = uploadedImages.length - 1;
			} else if (uploadedImages.length === 0) {
				primaryImageIndex = 0;
			} else if (imageIndex < primaryImageIndex) {
				primaryImageIndex--;
			}
		} catch (error) {
			uploadError = error instanceof Error ? error.message : 'Error al eliminar la imagen';
		}
	};

	// Handle primary image selection
	const selectPrimaryImage = (index: number) => {
		primaryImageIndex = index;
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
						onclick={() => goto(resolve('/admin/products'))}
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
				<a
					href={resolve('/admin')}
					class="text-sm text-gray-500 transition-colors hover:text-gray-700"
				>
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
				enctype="multipart/form-data"
				use:enhance={() => {
					isLoading = true;
					return async ({ result }) => {
						isLoading = false;
						if (result.type === 'success') {
							await goto(resolve('/admin/products'));
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
						<label for="brand" class="mb-2 block text-sm font-medium text-gray-700"> Marca </label>
						<input
							id="brand"
							name="brand"
							type="text"
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: Apple"
						/>
					</div>

					<div>
						<label for="model" class="mb-2 block text-sm font-medium text-gray-700"> Modelo </label>
						<input
							id="model"
							name="model"
							type="text"
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: 15 Pro Max"
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
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
						<label for="oldPrice" class="mb-2 block text-sm font-medium text-gray-700">
							Precio Anterior
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<span class="text-gray-500 sm:text-sm">$</span>
							</div>
							<input
								id="oldPrice"
								name="oldPrice"
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

					<div>
						<label for="badge" class="mb-2 block text-sm font-medium text-gray-700">
							Badge
						</label>
						<input
							id="badge"
							name="badge"
							type="text"
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: Más vendidos, Nuevo, Oferta"
						/>
					</div>
				</div>

				<!-- Marketing Text -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-1">
					<div>
						<label for="promoText" class="mb-2 block text-sm font-medium text-gray-700">
							Texto Promocional
						</label>
						<input
							id="promoText"
							name="promoText"
							type="text"
							class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Ej: +20% OFF EN 1 PAGO + ENVÍO GRATIS"
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
							<option value="DRAFT">Borrador</option>
							<option value="PUBLISHED">Publicado</option>
							<option value="OUT_OF_STOCK">Sin Stock</option>
							<option value="ARCHIVED">Archivado</option>
						</select>
					</div>
				</div>

				<!-- Image Upload -->
				<div>
					<label for="imageUpload" class="mb-2 block text-sm font-medium text-gray-700">
						Imágenes del Producto
					</label>
					<div class="mt-1">
						<div
							class="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors hover:border-gray-400"
						>
							<div class="space-y-1 text-center">
								<svg
									class="mx-auto h-12 w-12 text-gray-400"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 48 48"
								>
									<path
										d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<div class="flex text-sm text-gray-600">
									<label
										for="imageUpload"
										class="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-green-500"
									>
										<span>Subir archivos</span>
										<input
											id="imageUpload"
											name="imageUpload"
											type="file"
											class="sr-only"
											accept="image/*"
											multiple
											onchange={handleImageUpload}
										/>
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
							<h4 class="mb-2 text-sm font-medium text-gray-700">Imágenes subidas</h4>
							<p class="mb-3 text-xs text-gray-500">
								Selecciona la imagen principal haciendo clic en la estrella ⭐
							</p>
							<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
								{#each uploadedImages as image (image.id)}
									{@const index = uploadedImages.indexOf(image)}
									<div class="group relative">
										<img
											src={image.url}
											alt="Imagen del producto"
											class="aspect-square w-full rounded-lg border-2 object-contain {index ===
											primaryImageIndex
												? 'border-blue-500'
												: 'border-gray-200'}"
										/>

										<!-- Primary Image Indicator -->
										{#if index === primaryImageIndex}
											<div class="absolute top-1 left-1 rounded-full bg-blue-500 p-1 text-white">
												<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
													<path
														d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
													/>
												</svg>
											</div>
										{:else}
											<button
												type="button"
												onclick={() => selectPrimaryImage(index)}
												class="absolute top-1 left-1 rounded-full bg-gray-300 p-1 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-yellow-400 hover:text-white"
												title="Marcar como imagen principal"
											>
												<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
													<path
														d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
													/>
												</svg>
											</button>
										{/if}

										<!-- Delete Button -->
										<button
											type="button"
											onclick={() => deleteImage(image.id)}
											class="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
											title="Eliminar imagen"
										>
											<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>

										<!-- Primary Image Label -->
										{#if index === primaryImageIndex}
											<div
												class="absolute bottom-1 left-1 rounded bg-blue-500 px-1 py-0.5 text-xs text-white"
											>
												Principal
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Upload Progress -->
					{#if isUploading}
						<div class="mt-2">
							<div class="rounded-md border border-blue-200 bg-blue-50 p-3">
								<div class="flex">
									<div class="shrink-0">
										<svg class="h-5 w-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
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
							<div class="rounded-md border border-red-200 bg-red-50 p-3">
								<div class="flex">
									<div class="shrink-0">
										<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clip-rule="evenodd"
											/>
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

				<!-- Hidden fields for uploaded images -->
				{#each uploadedImages as image (image.id)}
					<input type="hidden" name="uploadedImageUrls" value={image.url} />
				{/each}
				<input type="hidden" name="primaryImageIndex" value={primaryImageIndex} />

				<!-- Actions -->
				<div class="flex justify-end space-x-3 border-t border-gray-200 pt-6">
					<button
						type="button"
						onclick={() => goto(resolve('/admin/products'))}
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
