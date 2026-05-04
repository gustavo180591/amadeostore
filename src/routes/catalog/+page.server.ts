import { getProducts, getCategories } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await getProducts();
	const categories = await getCategories();

	return {
		products,
		categories
	};
};
