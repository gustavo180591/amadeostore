import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	// Get all categories
	const categories = await prisma.category.findMany({
		where: { isActive: true },
		orderBy: { name: 'asc' }
	});

	// Get products with variants and images
	const products = await prisma.product.findMany({
		where: {
			status: 'PUBLISHED',
			stock: { gt: 0 }
		},
		include: {
			category: true,
			images: {
				where: { isPrimary: true },
				take: 1,
				orderBy: { sortOrder: 'asc' }
			},
			variants: {
				where: { stock: { gt: 0 } },
				orderBy: { isDefault: 'desc' },
				take: 1
			},
			_count: {
				select: {
					variants: {
						where: { stock: { gt: 0 } }
					}
				}
			}
		},
		orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
	});

	// Serialize products and calculate effective pricing
	const serializedProducts = products.map((product) => {
		const primaryImage = product.images[0];
		const defaultVariant = product.variants[0];

		// Use variant price if available, otherwise product price
		const effectivePrice = defaultVariant ? Number(defaultVariant.price) : Number(product.price);
		const effectiveOldPrice = defaultVariant?.oldPrice
			? Number(defaultVariant.oldPrice)
			: product.oldPrice
				? Number(product.oldPrice)
				: null;
		const effectiveStock = defaultVariant ? defaultVariant.stock : product.stock;

		return {
			id: product.id,
			name: product.name,
			slug: product.slug,
			brand: product.brand,
			model: product.model,
			description: product.description,
			price: effectivePrice,
			oldPrice: effectiveOldPrice,
			stock: effectiveStock,
			sku: product.sku,
			status: product.status,
			isFeatured: product.isFeatured,
			badge: product.badge,
			promoText: product.promoText,
			categoryId: product.categoryId,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
			category: product.category,
			imageUrl: primaryImage?.url || product.imageUrl,
			hasVariants: product._count.variants > 1,
			defaultVariant: defaultVariant
				? {
						id: defaultVariant.id,
						colorName: defaultVariant.colorName,
						colorHex: defaultVariant.colorHex,
						storage: defaultVariant.storage,
						sku: defaultVariant.sku
					}
				: null
		};
	});

	return {
		products: serializedProducts,
		categories,
		totalProducts: serializedProducts.length
	};
};
