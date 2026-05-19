<script lang="ts">
	import { resolve } from '$app/paths';

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
	href={resolve(`/products/${product.slug}`)}
	class="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>
	<div class="relative flex min-h-[280px] items-center justify-center bg-[#f8f8f8] p-6">
		{#if product.badge}
			<div
				class="absolute top-3 left-0 z-10 rounded-r-md px-3 py-1 text-xs font-extrabold tracking-wide uppercase {badgeClasses(
					product.badgeColor
				)}"
			>
				{product.badge}
			</div>
		{/if}

		{#if product.discount}
			<div
				class="absolute top-12 left-4 z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-cyan-500 text-white shadow-md"
			>
				<span class="text-3xl leading-none font-extrabold">{product.discount}</span>
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
		<h3 class="min-h-[64px] text-[1.05rem] leading-tight font-extrabold text-zinc-900">
			{product.name}
		</h3>

		<div class="mt-3 text-sm text-zinc-500">Desde</div>

		<div class="flex items-end gap-2">
			<span class="text-[2rem] leading-none font-extrabold text-green-600">
				{formatPrice(product.price)}
			</span>

			{#if product.oldPrice}
				<span class="pb-1 text-sm text-zinc-400 line-through">
					{formatPrice(product.oldPrice)}
				</span>
			{/if}
		</div>
	</div>
</a>
