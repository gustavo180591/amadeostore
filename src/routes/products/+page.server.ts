import { getProducts, getCategories } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await getProducts();
	const categories = await getCategories();

	// Serialize products to convert Decimal to number
	const serializedProducts = products.map(product => ({
		...product,
		price: Number(product.price)
	}));

	return {
		products: serializedProducts,
		categories
	};
};
