import { getProductById } from '$lib/server/products';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductById(params.id);

	if (!product) {
		throw error(404, 'Product not found');
	}

	return {
		product
	};
};
