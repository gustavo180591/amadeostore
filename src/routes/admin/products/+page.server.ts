import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get all products with category info
		const productsData = await prisma.product.findMany({
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		// Serialize prices for JSON compatibility
		const products = productsData.map(product => ({
			...product,
			price: Number(product.price),
			compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
		}));

		// Get all categories for filters
		const categories = await prisma.category.findMany({
			where: { isActive: true },
			select: {
				id: true,
				name: true,
				slug: true
			},
			orderBy: { name: 'asc' }
		});

		// Calculate statistics
		const stats = {
			totalProducts: products.length,
			activeProducts: products.filter((p) => p.status === 'ACTIVE').length,
			inactiveProducts: products.filter((p) => p.status === 'INACTIVE').length,
			outOfStockProducts: products.filter((p) => p.status === 'OUT_OF_STOCK' || p.stock === 0)
				.length,
			featuredProducts: products.filter((p) => p.isFeatured).length,
			totalValue: products.reduce((sum, product) => {
				return sum + product.price * product.stock;
			}, 0),
			lowStockProducts: products.filter((p) => p.stock > 0 && p.stock <= 5).length
		};

		console.log('Admin products loading:', { 
			productsCount: products.length, 
			categoriesCount: categories.length,
			productsData: products.slice(0, 2) // Log first 2 products for debugging
		});
		
		return {
			products,
			categories,
			stats
		};
	} catch (error) {
		console.error('Error loading products:', error);
		return {
			products: [],
			categories: [],
			stats: {
				totalProducts: 0,
				activeProducts: 0,
				inactiveProducts: 0,
				outOfStockProducts: 0,
				featuredProducts: 0,
				totalValue: 0,
				lowStockProducts: 0
			}
		};
	}
}
