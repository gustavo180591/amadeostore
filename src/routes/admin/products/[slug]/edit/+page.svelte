<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data, form } = $props();

	// Use state for reactive data (accepting the warnings for functionality)
	let product = $derived(data.product);
	let categories = $derived(data.categories);

	// Form state - reactive state that updates with product changes
	let formData = $state({
		name: '',
		description: '',
		price: '',
		compareAtPrice: '',
		stock: '',
		sku: '',
		imageUrl: '',
		categoryId: '',
		status: 'ACTIVE',
		isFeatured: false
	});

	// Initialize form data when product changes
	$effect(() => {
		formData = {
			name: data.product.name,
			description: data.product.description || '',
			price: data.product.price.toString(),
			compareAtPrice: data.product.compareAtPrice?.toString() || '',
			stock: data.product.stock.toString(),
			sku: data.product.sku || '',
			imageUrl: data.product.imageUrl || '',
			categoryId: data.product.categoryId || '',
			status: data.product.status,
			isFeatured: data.product.isFeatured
		};
	});

	let isSubmitting = $state(false);
	let isUploading = $state(false);
	let uploadError = $state('');

	// Handle image upload
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
				formData.append('productId', product.id);

				const response = await fetch('/api/upload', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					const error = await response.text();
					throw new Error(error);
				}

				const result = await response.json();
				
				if (result.success) {
					// Refresh product data to show new images by reloading the page data
					window.location.reload();
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

			// Refresh product data by reloading page
			window.location.reload();
		} catch (error) {
			uploadError = error instanceof Error ? error.message : 'Error al eliminar la imagen';
		}
	};

	// Handle setting primary image
	const setPrimaryImage = async (imageId: string) => {
		try {
			const response = await fetch('/api/set-primary-image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					imageId, 
					productId: product.id 
				})
			});

			if (!response.ok) {
				throw new Error('Error al establecer imagen principal');
			}

			const result = await response.json();
			
			if (result.success) {
				// Refresh product data by reloading page
				window.location.reload();
			} else {
				throw new Error(result.error || 'Error al establecer imagen principal');
			}
		} catch (error) {
			uploadError = error instanceof Error ? error.message : 'Error al establecer imagen principal';
		}
	};

	// Update product data when form submission is successful
	$effect(() => {
		if (form?.success && form?.product) {
			product = form.product;
			// Update form data with new product data
			formData = {
				name: product.name,
				description: product.description || '',
				price: product.price.toString(),
				compareAtPrice: product.compareAtPrice?.toString() || '',
				stock: product.stock.toString(),
				sku: product.sku || '',
				imageUrl: product.imageUrl || '',
				categoryId: product.categoryId || '',
				status: product.status,
				isFeatured: product.isFeatured
			};
		}
	});


	const handleCancel = async () => {
		await goto(resolve('/admin/products'));
	};
</script>

<div class="min-h-screen bg-gray-50">
	<div class="bg-white shadow">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div class="flex items-center">
					<h1 class="text-2xl font-semibold text-gray-900">Editar Producto</h1>
					<div class="ml-4 text-sm text-gray-500">
						{product.name}
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href={resolve('/admin/products')}
						class="text-sm text-gray-500 transition-colors hover:text-gray-700"
					>
						← Volver a productos
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="bg-white shadow rounded-lg">
				<!-- Success/Error Messages -->
				{#if form?.success}
					<div class="p-4 mb-6 bg-green-50 border border-green-200 rounded-md">
						<div class="flex">
							<div class="shrink-0">
								<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-green-800">{form.message}</p>
							</div>
						</div>
					</div>
				{:else if form?.message}
					<div class="p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
						<div class="flex">
							<div class="shrink-0">
								<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-red-800">{form.message}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Form -->
				<form
					method="POST"
					action="?/update"
					enctype="multipart/form-data"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result }) => {
							isSubmitting = false;
							if (result.type === 'success') {
								// Product updated successfully
							}
						};
					}}
					class="space-y-6 p-6"
				>
					<div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<!-- Name -->
						<div class="sm:col-span-4">
							<label for="name" class="block text-sm font-medium text-gray-700">
								Nombre del Producto *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								bind:value={formData.name}
								required
								class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							/>
						</div>

						<!-- SKU -->
						<div class="sm:col-span-2">
							<label for="sku" class="block text-sm font-medium text-gray-700">
								SKU
							</label>
							<input
								type="text"
								id="sku"
								name="sku"
								bind:value={formData.sku}
								class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							/>
						</div>

						<!-- Description -->
						<div class="sm:col-span-6">
							<label for="description" class="block text-sm font-medium text-gray-700">
								Descripción
							</label>
							<textarea
								id="description"
								name="description"
								bind:value={formData.description}
								rows={4}
								class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							></textarea>
						</div>

						<!-- Price -->
						<div class="sm:col-span-2">
							<label for="price" class="block text-sm font-medium text-gray-700">
								Precio *
							</label>
							<div class="mt-1 relative rounded-md shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-gray-500 sm:text-sm">$</span>
								</div>
								<input
									type="number"
									id="price"
									name="price"
									bind:value={formData.price}
									required
									min="0"
									step="0.01"
									class="pl-7 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
								/>
							</div>
						</div>

						<!-- Compare At Price -->
						<div class="sm:col-span-2">
							<label for="compareAtPrice" class="block text-sm font-medium text-gray-700">
								Precio de Comparación
							</label>
							<div class="mt-1 relative rounded-md shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-gray-500 sm:text-sm">$</span>
								</div>
								<input
									type="number"
									id="compareAtPrice"
									name="compareAtPrice"
									bind:value={formData.compareAtPrice}
									min="0"
									step="0.01"
									class="pl-7 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
								/>
							</div>
						</div>

						<!-- Stock -->
						<div class="sm:col-span-2">
							<label for="stock" class="block text-sm font-medium text-gray-700">
								Stock *
							</label>
							<input
								type="number"
								id="stock"
								name="stock"
								bind:value={formData.stock}
								required
								min="0"
								class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							/>
						</div>

						<!-- Category -->
						<div class="sm:col-span-3">
							<label for="categoryId" class="block text-sm font-medium text-gray-700">
								Categoría
							</label>
							<select
								id="categoryId"
								name="categoryId"
								bind:value={formData.categoryId}
								class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							>
								<option value="">Seleccionar categoría</option>
								{#each categories as category (category.id)}
									<option value={category.id}>{category.name}</option>
								{/each}
							</select>
						</div>

						<!-- Status -->
						<div class="sm:col-span-3">
							<label for="status" class="block text-sm font-medium text-gray-700">
								Estado
							</label>
							<select
								id="status"
								name="status"
								bind:value={formData.status}
								class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							>
								<option value="ACTIVE">Activo</option>
								<option value="INACTIVE">Inactivo</option>
								<option value="OUT_OF_STOCK">Sin Stock</option>
							</select>
						</div>

						<!-- Primary Image Preview -->
						<div class="sm:col-span-6 mb-4">
							<fieldset class="block text-sm font-medium text-gray-700 mb-2">
								<legend>Vista Previa - Imagen Principal</legend>
							</fieldset>
							<div class="border border-gray-300 rounded-lg overflow-hidden">
								{#if product.images && product.images.find((img: { isPrimary?: boolean }) => img.isPrimary)}
									{@const primaryImage = product.images.find((img: { isPrimary?: boolean }) => img.isPrimary)}
									{#if primaryImage}
										<img 
											src={primaryImage.url} 
											alt={primaryImage.alt || product.name}
											class="w-full h-48 object-cover"
										/>
									{/if}
								{:else if product.images && product.images.length > 0}
									<img 
										src={product.images[0].url} 
										alt={product.images[0].alt || product.name}
										class="w-full h-48 object-cover"
									/>
								{:else}
									<div class="flex h-48 w-full items-center justify-center bg-gray-200">
										<svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
										</svg>
									</div>
								{/if}
							</div>
						</div>

						<!-- Image Upload -->
						<div class="sm:col-span-6">
							<label for="imageUpload" class="block text-sm font-medium text-gray-700">
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

							<!-- Current Images -->
							{#if product.images && product.images.length > 0}
								<div class="mt-4">
									<h4 class="text-sm font-medium text-gray-700 mb-2">Imágenes actuales</h4>
									<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
										{#each product.images as image (image.id)}
											<div class="relative group">
												<img 
													src={image.url} 
													alt={image.alt || product.name}
													class="w-full h-24 object-cover rounded-lg border-2 {image.isPrimary ? 'border-green-500' : 'border-gray-200'}"
												/>
												{#if image.isPrimary}
													<div class="absolute top-1 left-1 bg-green-500 text-white p-1 rounded-full">
														<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
															<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
														</svg>
													</div>
												{/if}
												<div class="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
													{#if !image.isPrimary}
														<button
															type="button"
															onclick={() => setPrimaryImage(image.id)}
															class="bg-blue-500 text-white p-1 rounded-full"
															title="Marcar como principal"
														>
															<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
															</svg>
														</button>
													{/if}
													<button
														type="button"
														onclick={() => deleteImage(image.id)}
														class="bg-red-500 text-white p-1 rounded-full"
														title="Eliminar imagen"
													>
														<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
														</svg>
													</button>
												</div>
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

						<!-- Featured -->
						<div class="sm:col-span-6">
							<div class="flex items-start">
								<div class="flex items-center h-5">
									<input
										id="isFeatured"
										name="isFeatured"
										type="checkbox"
										bind:checked={formData.isFeatured}
										class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
									/>
								</div>
								<div class="ml-3 text-sm">
									<label for="isFeatured" class="font-medium text-gray-700">
										Producto Destacado
									</label>
									<p class="text-gray-500">Mostrar este producto en la página principal</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Form Actions -->
					<div class="pt-6 border-t border-gray-200">
						<div class="flex justify-end space-x-3">
							<button
								type="button"
								onclick={handleCancel}
								class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
