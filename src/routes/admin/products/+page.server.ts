import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get products with pagination and filters
		const page = 1;
		const limit = 20;
		const skip = (page - 1) * limit;

		const [productsData, totalCount] = await Promise.all([
			prisma.product.findMany({
				include: {
					category: {
						select: {
							id: true,
							name: true,
							slug: true,
							isActive: true
						}
					},
					images: {
						select: {
							id: true,
							url: true,
							isPrimary: true
						},
						orderBy: { sortOrder: 'asc' },
						take: 1
					}
				},
				orderBy: {
					createdAt: 'desc'
				},
				skip,
				take: limit
			}),
			prisma.product.count()
		]);

		// Serialize prices for JSON compatibility
		const products = productsData.map((product) => ({
			...product,
			price: Number(product.price)
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
			activeProducts: products.filter((p) => p.status === 'PUBLISHED').length,
			inactiveProducts: products.filter((p) => p.status === 'DRAFT').length,
			outOfStockProducts: products.filter((p) => p.status === 'OUT_OF_STOCK' || p.stock === 0)
				.length,
			featuredProducts: products.filter((p) => p.isFeatured).length,
			totalValue: products.reduce((sum, product) => {
				return sum + product.price * product.stock;
			}, 0),
			lowStockProducts: products.filter((p) => p.stock > 0 && p.stock <= 5).length
		};

		
		return {
			products,
			categories,
			stats,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalCount / limit),
				totalCount,
				limit
			}
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
