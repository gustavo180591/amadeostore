import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params, url }) => {
	const { slug } = params;

	try {
		// Get product by slug with variants
		const product = await prisma.product.findFirst({
			where: {
				slug,
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
					orderBy: {
						sortOrder: 'asc'
					}
				},
				variants: {
					where: {
						isActive: true
					},
					include: {
						images: {
							orderBy: {
								sortOrder: 'asc'
							}
						}
					},
					orderBy: [
						{
							isDefault: 'desc'
						},
						{
							storage: 'asc'
						},
						{
							colorName: 'asc'
						}
					]
				}
			}
		});

		if (!product) {
			throw error(404, 'Producto no encontrado');
		}

		// Get related products (same category, excluding current product)
		const relatedProducts = await prisma.product.findMany({
			where: {
				categoryId: product.categoryId,
				id: { not: product.id },
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
					orderBy: {
						sortOrder: 'asc'
					}
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 4
		});

		// Find selected variant from URL params or use default
		const variantId = url.searchParams.get('variant');
		
		const selectedVariant =
			product.variants?.find((variant: any) => variant.id === variantId) ||
			product.variants?.find((variant: any) => variant.isDefault) ||
			product.variants?.[0] ||
			null;

		// Serialize for JSON compatibility
		const serializeProduct = (product: any) => ({
			...product,
			price: product.price ? Number(product.price) : null,
			oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
			variants: product.variants?.map((variant: any) => ({
				...variant,
				price: Number(variant.price),
				oldPrice: variant.oldPrice ? Number(variant.oldPrice) : null
			})) || []
		});

		const serializeProducts = (products: any[]) => {
			return products.map((product: any) => ({
				...product,
				price: Number(product.price)
			}));
		};

		return {
			product: serializeProduct(product),
			selectedVariant: selectedVariant ? {
				...selectedVariant,
				price: Number(selectedVariant.price),
				oldPrice: selectedVariant.oldPrice ? Number(selectedVariant.oldPrice) : null
			} : null,
			relatedProducts: serializeProducts(relatedProducts)
		};
	} catch (err) {
		if (err instanceof Error && err.message.includes('not found')) {
			throw err;
		}

		console.error('Error loading product:', err);
		throw error(500, 'Error loading product');
	}
};
