import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get featured products
		const featuredProductsData = await prisma.product.findMany({
			where: {
				isFeatured: true,
				status: 'PUBLISHED'
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				},
				images: {
					where: { isPrimary: true },
					take: 1
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 8
		});

		// Transform featured products to the new format
		const featuredProducts = featuredProductsData.map((product) => ({
			id: product.id,
			name: product.name,
			slug: product.slug,
			image: product.images[0]?.url || product.imageUrl || '/images/placeholder-product.png',
			price: Number(product.price),
			oldPrice: null, // Could be added to schema later
			discount: null, // Could be calculated from oldPrice
			badge: product.isFeatured ? 'Más vendidos' : null,
			badgeColor: (product.isFeatured ? 'orange' : 'blue') as 'orange' | 'pink' | 'blue' | 'green',
			promoText: '+20% OFF EN 1 PAGO + ENVÍO GRATIS', // Could be added to schema later
			isFeatured: product.isFeatured
		}));

		// Get latest products
		const latestProductsData = await prisma.product.findMany({
			where: {
				status: 'PUBLISHED'
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				},
				images: {
					where: { isPrimary: true },
					take: 1
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 8
		});

		// Transform latest products to the new format
		const latestProducts = latestProductsData.map((product) => ({
			id: product.id,
			name: product.name,
			slug: product.slug,
			image: product.images[0]?.url || product.imageUrl || '/images/placeholder-product.png',
			price: Number(product.price),
			oldPrice: null, // Could be added to schema later
			discount: null, // Could be calculated from oldPrice
			badge: 'Nuevo', // Different badge for latest products
			badgeColor: 'blue' as const,
			promoText: '+20% OFF EN 1 PAGO + ENVÍO GRATIS', // Could be added to schema later
			isFeatured: product.isFeatured
		}));

		// Get active categories
		const categories = await prisma.category.findMany({
			where: { isActive: true },
			orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
			take: 8
		});

		// Get statistics
		const stats = {
			totalProducts: await prisma.product.count({ where: { status: 'PUBLISHED' } }),
			totalCategories: await prisma.category.count({ where: { isActive: true } }),
			featuredCount: await prisma.product.count({ where: { isFeatured: true, status: 'PUBLISHED' } })
		};

		// Convert Decimal to number for serialization
		const serializeProducts = (products: typeof featuredProducts) => {
			return products.map((product) => ({
				...product,
				price: Number(product.price)
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
