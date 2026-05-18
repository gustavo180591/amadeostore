import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Find product by slug
		const productData = await prisma.product.findUnique({
			where: { slug: params.slug },
			include: {
				category: true,
				images: {
					orderBy: { sortOrder: 'asc' }
				},
				variants: {
					where: { stock: { gt: 0 } },
					include: {
						images: {
							orderBy: { sortOrder: 'asc' }
						}
					},
					orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }]
				}
			}
		});

		if (!productData) {
			throw fail(404, {
				message: 'Producto no encontrado'
			});
		}

		// Serialize product for JSON compatibility
		const product = {
			...productData,
			price: productData.price ? Number(productData.price) : null,
			oldPrice: productData.oldPrice ? Number(productData.oldPrice) : null,
			variants: productData.variants.map((variant) => ({
				...variant,
				price: Number(variant.price),
				oldPrice: variant.oldPrice ? Number(variant.oldPrice) : null
			}))
		};

		// Get related products (same category, excluding current)
		let relatedProducts: Array<Record<string, any>> = [];
		if (product.categoryId) {
			const relatedProductsData = await prisma.product.findMany({
				where: {
					categoryId: product.categoryId,
					id: { not: product.id },
					status: 'PUBLISHED',
					stock: { gt: 0 }
				},
				include: {
					category: true,
					images: {
						where: { isPrimary: true },
						take: 1,
						orderBy: { sortOrder: 'asc' }
					}
				},
				orderBy: { createdAt: 'desc' },
				take: 4
			});

			relatedProducts = relatedProductsData.map((p) => ({
				...p,
				price: p.price ? Number(p.price) : null,
				oldPrice: p.oldPrice ? Number(p.oldPrice) : null
			}));
		}

		return {
			product,
			relatedProducts
		};
	} catch (error) {
		console.error('Error loading product:', error);
		throw fail(500, {
			message: 'Error al cargar el producto'
		});
	}
};
