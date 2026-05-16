<script lang="ts">
	type FeaturedProduct = {
		id: string;
		name: string;
		slug: string;
		image: string;
		price: number;
		oldPrice?: number | null;
		discount?: number | null;
		badge?: string | null;
		badgeColor?: 'orange' | 'pink' | 'blue' | 'green';
		promoText?: string | null;
		isFeatured?: boolean;
	};

	let { product }: { product: FeaturedProduct } = $props();

	const formatPrice = (value: number) =>
		new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			maximumFractionDigits: 0
		}).format(value);

	const taxFreePrice = $derived(Math.round(product.price / 1.21));

	function badgeClasses(color?: 'orange' | 'pink' | 'blue' | 'green') {
		switch (color) {
			case 'pink':
				return 'bg-pink-600 text-white';
			case 'blue':
				return 'bg-sky-500 text-white';
			case 'green':
				return 'bg-green-600 text-white';
			case 'orange':
			default:
				return 'bg-orange-500 text-white';
		}
	}
</script>

<a
	href={`/products/${product.slug}`}
	class="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>
	<div class="relative flex min-h-[280px] items-center justify-center bg-[#f8f8f8] p-6">
		{#if product.badge}
			<div
				class="absolute left-0 top-3 z-10 rounded-r-md px-3 py-1 text-xs font-extrabold uppercase tracking-wide {badgeClasses(product.badgeColor)}"
			>
				{product.badge}
			</div>
		{/if}

		{#if product.discount}
			<div
				class="absolute left-4 top-12 z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-cyan-500 text-white shadow-md"
			>
				<span class="text-3xl font-extrabold leading-none">{product.discount}</span>
				<span class="-mt-1 text-xs font-bold">% OFF</span>
			</div>
		{/if}

		<img
			src={product.image}
			alt={product.name}
			class="max-h-[220px] w-auto object-contain transition duration-300 group-hover:scale-[1.03]"
		/>
	</div>

	<div class="flex flex-1 flex-col p-4">
		<h3 class="min-h-[64px] text-[1.05rem] font-extrabold leading-tight text-zinc-900">
			{product.name}
		</h3>

		<div class="mt-3 text-sm text-zinc-500">Desde</div>

		<div class="flex items-end gap-2">
			<span class="text-[2rem] font-extrabold leading-none text-green-600">
				{formatPrice(product.price)}
			</span>

			{#if product.oldPrice}
				<span class="pb-1 text-sm text-zinc-400 line-through">
					{formatPrice(product.oldPrice)}
				</span>
			{/if}
		</div>

		<div class="mt-1 text-xs uppercase text-zinc-400">
			PRECIO SIN IMPUESTOS {formatPrice(taxFreePrice)}
		</div>

		{#if product.promoText}
			<div class="mt-3 text-sm font-extrabold uppercase text-cyan-600">
				{product.promoText}
			</div>
		{/if}
	</div>
</a>
