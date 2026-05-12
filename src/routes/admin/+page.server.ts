import type { PageServerLoad } from './$types';
import { getProducts, getCategories } from '$lib/server/products';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	try {
		// Get basic statistics
		const [productsCount, categoriesCount, recentProducts] = await Promise.all([
			prisma.product.count({
				where: { isActive: true }
			}),
			prisma.category.count(),
			getProducts()
		]);

		// Calculate total stock value
		const products = await prisma.product.findMany({
			where: { isActive: true },
			select: {
				price: true,
				stock: true
			}
		});

		const totalStockValue = products.reduce((sum, product) => {
			return sum + Number(product.price) * product.stock;
		}, 0);

		// Get low stock products
		const lowStockProducts = await prisma.product.findMany({
			where: {
				isActive: true,
				stock: {
					lt: 5
				}
			},
			include: {
				category: true
			},
			orderBy: {
				stock: 'asc'
			},
			take: 5
		});

		return {
			stats: {
				productsCount,
				categoriesCount,
				totalStockValue,
				lowStockCount: lowStockProducts.length
			},
			recentProducts: recentProducts.slice(0, 5),
			lowStockProducts
		};
	} catch (error) {
		console.error('Dashboard load error:', error);
		return {
			stats: {
				productsCount: 0,
				categoriesCount: 0,
				totalStockValue: 0,
				lowStockCount: 0
			},
			recentProducts: [],
			lowStockProducts: []
		};
	}
};
