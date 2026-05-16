import { getCategories, getProductsByCategory } from '$lib/server/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const categories = await getCategories();
	
	// Get products for each category
	const categoriesWithProducts = await Promise.all(
		categories.map(async (category) => {
			const products = await getProductsByCategory(category.id);
			const serializedProducts = products.slice(0, 4).map(product => ({
				...product,
				price: Number(product.price)
			}));
			return {
				...category,
				products: serializedProducts
			};
		})
	);

	return {
		categories: categoriesWithProducts
	};
};
