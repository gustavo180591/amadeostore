<script lang="ts">
	import FeaturedProductCard from './FeaturedProductCard.svelte';

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

	let {
		products = [],
		title = 'Productos destacados'
	}: { products: FeaturedProduct[]; title: string } = $props();
</script>

<section class="bg-[#f2f2f2] py-10">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-6 flex items-center justify-between gap-4">
			<h2 class="text-3xl font-light tracking-tight text-zinc-800">
				{title}
			</h2>

			<a
				href="/catalog"
				class="inline-flex items-center gap-2 text-lg text-zinc-700 transition hover:text-zinc-950"
			>
				Ver catálogo completo
				<span aria-hidden="true">›</span>
			</a>
		</div>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
			{#each products as product (product.id)}
				<FeaturedProductCard {product} />
			{/each}
		</div>
	</div>
</section>
