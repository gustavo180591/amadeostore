import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function load({ params }) {
	const { slug } = params;

	try {
		// Get product by slug
		const product = await prisma.product.findUnique({
			where: { slug },
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				},
				images: {
					orderBy: { sortOrder: 'asc' }
				}
			}
		});

		if (!product) {
			throw error(404, 'Product not found');
		}

		if (product.status !== 'ACTIVE') {
			throw error(404, 'Product not available');
		}

		// Get related products (same category, excluding current product)
		const relatedProducts = await prisma.product.findMany({
			where: {
				categoryId: product.categoryId,
				id: { not: product.id },
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
			take: 4
		});

		// Convert Decimal to number for serialization
		const serializeProduct = (product: any) => ({
			...product,
			price: Number(product.price),
			compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
		});

		const serializeProducts = (products: any[]) => {
			return products.map(serializeProduct);
		};

		return {
			product: serializeProduct(product),
			relatedProducts: serializeProducts(relatedProducts)
		};
	} catch (err) {
		if (err instanceof Error && err.message.includes('not found')) {
			throw err;
		}
		
		console.error('Error loading product:', err);
		throw error(500, 'Error loading product');
	}
}
