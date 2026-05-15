import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get featured products
		const featuredProducts = await prisma.product.findMany({
			where: {
				isFeatured: true,
				status: 'ACTIVE'
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 8
		});

		// Get latest products
		const latestProducts = await prisma.product.findMany({
			where: {
				status: 'ACTIVE'
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 12
		});

		// Get active categories
		const categories = await prisma.category.findMany({
			where: { isActive: true },
			orderBy: [
				{ sortOrder: 'asc' },
				{ name: 'asc' }
			],
			take: 8
		});

		// Get statistics
		const stats = {
			totalProducts: await prisma.product.count({ where: { status: 'ACTIVE' } }),
			totalCategories: await prisma.category.count({ where: { isActive: true } }),
			featuredCount: await prisma.product.count({ where: { isFeatured: true, status: 'ACTIVE' } })
		};

		// Convert Decimal to number for serialization
		const serializeProducts = (products: typeof featuredProducts) => {
			return products.map(product => ({
				...product,
				price: Number(product.price),
				compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
			}));
		};

		return {
			featuredProducts: serializeProducts(featuredProducts),
			latestProducts: serializeProducts(latestProducts),
			categories,
			stats
		};
	} catch (error) {
		console.error('Error loading homepage data:', error);
		return {
			featuredProducts: [],
			latestProducts: [],
			categories: [],
			stats: {
				totalProducts: 0,
				totalCategories: 0,
				featuredCount: 0
			}
		};
	}
}
