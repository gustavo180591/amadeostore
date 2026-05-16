<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ChevronRight, ChevronLeft, Check, CreditCard, Home, Store } from '@lucide/svelte';

	const data = $derived($page.data);
	const product = $derived(data?.product);
	const selectedVariant = $derived(data?.selectedVariant);

	// Get available colors from variants
	const colors = $derived(() => {
		if (!product?.variants?.length) return [];
		
		const uniqueColors = Array.from(
			new Map(
				product.variants
					.filter((variant: any) => variant.colorName)
					.map((variant: any) => [
						variant.colorName,
						{
							name: variant.colorName,
							hex: variant.colorHex || '#000000'
						}
					])
			).values()
		);
		return uniqueColors as { name: string; hex: string }[];
	});

	// Get available storages from variants
	const storages = $derived(() => {
		if (!product?.variants?.length) return [];
		
		return Array.from(
			new Set(
				product.variants
					.map((variant: any) => variant.storage)
					.filter(Boolean)
			)
		) as string[];
	});

	// Get images for selected variant or fallback to product images
	const images = $derived(() => {
		if (selectedVariant?.images?.length) {
			return selectedVariant.images;
		}
		return product?.images || [];
	});

	// Selected image state
	let selectedImage = $state('/images/placeholder-product.png');

	// Update selected image when variant changes
	$effect(() => {
		const currentImages = images();
		if (currentImages.length > 0) {
			selectedImage = currentImages[0].url;
		} else if (product?.imageUrl) {
			selectedImage = product.imageUrl;
		} else {
			selectedImage = '/images/placeholder-product.png';
		}
	});

	const formatPrice = (value: number) =>
		new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			maximumFractionDigits: 0
		}).format(value);

	// Calculate discount from variant
	const discount = $derived(() => {
		if (!selectedVariant) return 0;
		if (!selectedVariant.oldPrice) return 0;
		return Math.round(((Number(selectedVariant.oldPrice) - Number(selectedVariant.price)) / Number(selectedVariant.oldPrice)) * 100);
	});

	const taxFreePrice = $derived(() => {
		if (!selectedVariant) return 0;
		return Math.round(Number(selectedVariant.price) / 1.21);
	});

	// Find variant by color and storage
	function findVariant(colorName: string | null, storage: string | null) {
		if (!product?.variants?.length) return null;
		
		return product.variants.find((variant: any) => {
			const sameColor = colorName ? variant.colorName === colorName : true;
			const sameStorage = storage ? variant.storage === storage : true;
			return sameColor && sameStorage;
		});
	}

	// Handle color selection
	function selectColor(colorName: string) {
		const variant = findVariant(colorName, selectedVariant?.storage || null);
		if (variant) {
			goto(`?variant=${variant.id}`, { replaceState: true, noScroll: true });
		}
	}

	// Handle storage selection
	function selectStorage(storage: string) {
		const variant = findVariant(selectedVariant?.colorName || null, storage);
		if (variant) {
			goto(`?variant=${variant.id}`, { replaceState: true, noScroll: true });
		}
	}

	function goBack() {
		history.back();
	}

	function handleBuy() {
		const message = `Hola Amadeo Store, quiero consultar por este producto:

Producto: ${product?.name}
${selectedVariant?.colorName ? `Color: ${selectedVariant.colorName}` : ''}
${selectedVariant?.storage ? `Memoria: ${selectedVariant.storage}` : ''}
Precio: ${formatPrice(Number(selectedVariant?.price || 0))}
${selectedVariant?.sku ? `Código: ${selectedVariant.sku}` : ''}`;

		const phone = '5493760000000';
		window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
	}
</script>

<svelte:head>
	<title>{product?.name || 'Producto'} | Amadeo Store</title>
	<meta name="description" content={product?.description || 'Producto en Amadeo Store'} />
</svelte:head>

<section class="min-h-screen bg-[#f2f2f2] px-4 py-4">
	<div class="mx-auto max-w-7xl">
		<div class="mb-4 flex items-center justify-between text-sm">
			<div class="flex items-center gap-2">
				<a href="/" class="font-medium text-cyan-600 hover:underline">Tienda</a>
				<ChevronRight size={16} class="text-zinc-500" />
				<span class="font-semibold text-zinc-900">{product?.name}</span>
			</div>

			<button
				type="button"
				onclick={goBack}
				class="inline-flex items-center gap-1 font-medium text-cyan-600 hover:underline"
			>
				<ChevronLeft size={16} />
				Volver
			</button>
		</div>

		{#if product}
			<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md">
				<div class="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr]">
					<!-- Columna izquierda: imágenes -->
					<div class="relative border-b border-zinc-200 p-4 lg:border-b-0 lg:border-r">
						{#if product.badge}
							<div
								class="absolute left-0 top-4 z-20 bg-orange-500 px-4 py-2 text-xl font-bold uppercase tracking-wide text-white shadow"
								style="clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%);"
							>
								{product.badge}
							</div>
						{:else}
							<div
								class="absolute left-0 top-4 z-20 bg-orange-500 px-4 py-2 text-xl font-bold uppercase tracking-wide text-white shadow"
								style="clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%);"
							>
								Más vendidos
							</div>
						{/if}

						{#if discount}
							<div
								class="absolute left-5 top-24 z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg"
							>
								<span class="text-6xl font-extrabold leading-none">{discount}</span>
								<span class="-mt-1 text-3xl font-light leading-none">%</span>
								<span class="-mt-1 text-lg font-bold uppercase leading-none">OFF</span>
							</div>
						{/if}

						<div class="grid min-h-[560px] grid-cols-1 items-center gap-4 md:grid-cols-[1fr_76px]">
							<div class="flex items-center justify-center px-6 pt-20 md:pt-8">
								<img
									src={selectedImage}
									alt={product.name}
									class="max-h-[510px] w-auto object-contain"
								/>
							</div>

							<div class="flex justify-center gap-3 md:flex-col">
								{#each product.images as image}
									<button
										type="button"
										onclick={() => (selectedImage = image.url)}
										class={`flex h-16 w-16 items-center justify-center rounded-lg border bg-white p-1 shadow-sm transition ${
											selectedImage === image.url ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-zinc-200'
										}`}
									>
										<img src={image.url} alt={product.name} class="max-h-full object-contain" />
									</button>
								{/each}

								{#if !product.images?.length}
									<button
										type="button"
										class="flex h-16 w-16 items-center justify-center rounded-lg border border-cyan-500 bg-white p-1 shadow-sm ring-2 ring-cyan-100"
									>
										<img src={selectedImage} alt={product.name} class="max-h-full object-contain" />
									</button>
								{/if}
							</div>
						</div>
					</div>

					<!-- Columna derecha: información -->
					<div class="p-7 lg:p-8">
						<div class="mb-3 flex items-start justify-between gap-4">
							<h1 class="text-4xl font-extrabold leading-tight text-zinc-900">
								{product.name}
							</h1>

							{#if product.stock > 0}
								<div class="mt-2 flex shrink-0 items-center gap-2 text-sm font-bold uppercase text-emerald-700">
									<Check size={16} />
									En stock
								</div>
							{:else}
								<div class="mt-2 text-sm font-bold uppercase text-red-600">
									Sin stock
								</div>
							{/if}
						</div>

						<div class="mt-5 flex items-end gap-3">
							<span class="text-4xl font-light text-red-600">
								{formatPrice(Number(selectedVariant?.price || product?.price || 0))}
							</span>

							{#if selectedVariant?.oldPrice}
								<span class="pb-2 text-lg text-zinc-400 line-through">
									{formatPrice(Number(selectedVariant.oldPrice))}
								</span>
							{/if}
						</div>

						<p class="mt-1 text-xs uppercase text-zinc-400">
							Precio sin impuestos {formatPrice(taxFreePrice())}
						</p>

						<p class="mt-5 text-base font-extrabold uppercase text-cyan-600">
							{product?.promoText || '+20% OFF EN 1 PAGO + ENVÍO GRATIS'}
						</p>

						{#if colors().length > 0}
							<div class="mt-6">
								<p class="text-base text-zinc-900">
									Color:
									<strong>{selectedVariant?.colorName || 'Seleccionar'}</strong>
								</p>

								<div class="mt-3 flex gap-3">
									{#each colors() as color (color.name)}
										<button
											type="button"
											aria-label={color.name}
											onclick={() => selectColor(color.name)}
											class={`h-9 w-9 rounded-full border-2 shadow-md transition ${
												selectedVariant?.colorName === color.name
													? 'border-cyan-500 ring-2 ring-cyan-200'
													: 'border-white'
											}`}
											style={`background-color: ${color.hex}`}
										></button>
									{/each}
								</div>
							</div>
						{/if}

						{#if storages().length > 0}
							<div class="mt-6">
								<p class="text-base text-zinc-900">
									Memoria:
									<strong>{selectedVariant?.storage || 'Seleccionar'}</strong>
								</p>

								<div class="mt-3 flex gap-2">
									{#each storages() as storage (storage)}
										<button
											type="button"
											onclick={() => selectStorage(storage)}
											class={`rounded-md border px-4 py-3 text-sm font-bold transition ${
												selectedVariant?.storage === storage
													? 'border-cyan-600 bg-cyan-600 text-white'
													: 'border-zinc-300 bg-white text-zinc-800 hover:border-cyan-500'
											}`}
										>
											{storage}
										</button>
									{/each}
								</div>
							</div>
						{/if}

						<p class="mt-5 text-xs text-zinc-400">
							Código: {selectedVariant?.sku || product?.sku || product?.id?.slice(0, 8)}
						</p>

						<button
							type="button"
							onclick={handleBuy}
							disabled={(selectedVariant?.stock || product?.stock || 0) <= 0}
							class="mt-6 flex w-full items-center justify-center rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
						>
							Consultar por WhatsApp
						</button>

						<div class="mt-5 space-y-4">
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-4 py-3 text-left transition hover:border-cyan-500"
							>
								<span class="flex items-center gap-4">
									<span class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100">
										<CreditCard size={22} />
									</span>
									<span class="text-lg text-zinc-700">Medios de pago</span>
								</span>

								<ChevronRight size={24} />
							</button>

							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-4 py-3 text-left transition hover:border-cyan-500"
							>
								<span class="flex items-center gap-4">
									<span class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100">
										<Home size={22} />
									</span>
									<span>
										<span class="block text-lg text-zinc-700">Envío a domicilio</span>
										<span class="block text-xs text-emerald-600">Siempre disponible</span>
									</span>
								</span>

								<ChevronRight size={24} />
							</button>

							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-4 py-3 text-left transition hover:border-cyan-500"
							>
								<span class="flex items-center gap-4">
									<span class="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100">
										<Store size={22} />
									</span>
									<span>
										<span class="block text-lg text-zinc-700">Retiro en sucursal</span>
										<span class="block text-xs text-orange-500">Sujeto a disponibilidad de stock</span>
									</span>
								</span>

								<ChevronRight size={24} />
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div class="text-center">
					<h1 class="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
					<p class="mt-4 text-gray-600">El producto que buscas no existe o no está disponible.</p>
					<a href="/products" class="mt-6 inline-block text-green-600 hover:text-green-700">
						← Volver a productos
					</a>
				</div>
			</div>
		{/if}
	</div>
</section>
