import { fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get all categories for the dropdown
		const categories = await prisma.category.findMany({
			where: { isActive: true },
			select: {
				id: true,
				name: true,
				slug: true
			},
			orderBy: { name: 'asc' }
		});

		return {
			categories
		};
	} catch (error) {
		console.error('Error loading categories:', error);
		return {
			categories: []
		};
	}
}

export const actions = {
	default: async ({ request }: { request: Request }) => {
		try {
			const data = await request.formData();

			// Extract and validate form data
			const name = data.get('name') as string;
			const sku = data.get('sku') as string;
			const slug = data.get('slug') as string;
			const description = data.get('description') as string;
			const price = data.get('price') as string;
			const compareAtPrice = data.get('compareAtPrice') as string;
			const stock = data.get('stock') as string;
			const imageUrl = data.get('imageUrl') as string;
			const categoryId = data.get('categoryId') as string;
			const status = data.get('status') as string;
			const isFeatured = data.get('isFeatured') === 'on';

			// Required field validation
			if (!name || !price || !stock) {
				return fail(400, {
					error: 'Nombre, precio y stock son campos obligatorios',
					data: {
						name,
						sku,
						slug,
						description,
						price,
						compareAtPrice,
						stock,
						imageUrl,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			// Price validation
			const parsedPrice = parseFloat(price);
			if (isNaN(parsedPrice) || parsedPrice < 0) {
				return fail(400, {
					error: 'El precio debe ser un número válido mayor o igual a 0',
					data: {
						name,
						sku,
						slug,
						description,
						price,
						compareAtPrice,
						stock,
						imageUrl,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			// Stock validation
			const parsedStock = parseInt(stock);
			if (isNaN(parsedStock) || parsedStock < 0) {
				return fail(400, {
					error: 'El stock debe ser un número entero mayor o igual a 0',
					data: {
						name,
						sku,
						slug,
						description,
						price,
						compareAtPrice,
						stock,
						imageUrl,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			// Compare at price validation
			let parsedCompareAtPrice = null;
			if (compareAtPrice) {
				parsedCompareAtPrice = parseFloat(compareAtPrice);
				if (isNaN(parsedCompareAtPrice) || parsedCompareAtPrice < 0) {
					return fail(400, {
						error: 'El precio de comparación debe ser un número válido mayor o igual a 0',
						data: {
							name,
							sku,
							slug,
							description,
							price,
							compareAtPrice,
							stock,
							imageUrl,
							categoryId,
							status,
							isFeatured
						}
					});
				}
			}

			// Generate slug if not provided
			const finalSlug =
				slug ||
				name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/(^-|-$)/g, '');

			// Check if SKU already exists (if provided)
			if (sku) {
				const existingProduct = await prisma.product.findUnique({
					where: { sku }
				});

				if (existingProduct) {
					return fail(400, {
						error: 'El SKU ya está en uso por otro producto',
						data: {
							name,
							sku,
							slug,
							description,
							price,
							compareAtPrice,
							stock,
							imageUrl,
							categoryId,
							status,
							isFeatured
						}
					});
				}
			}

			// Check if slug already exists
			const existingSlug = await prisma.product.findUnique({
				where: { slug: finalSlug }
			});

			if (existingSlug) {
				return fail(400, {
					error: 'El slug ya está en uso. Por favor, elige otro',
					data: {
						name,
						sku,
						slug,
						description,
						price,
						compareAtPrice,
						stock,
						imageUrl,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			// Validate category if provided
			if (categoryId) {
				const category = await prisma.category.findUnique({
					where: { id: categoryId }
				});

				if (!category) {
					return fail(400, {
						error: 'La categoría seleccionada no es válida',
						data: {
							name,
							sku,
							slug,
							description,
							price,
							compareAtPrice,
							stock,
							imageUrl,
							categoryId,
							status,
							isFeatured
						}
					});
				}
			}

			// Create the product
			const product = await prisma.product.create({
				data: {
					name,
					sku: sku || null,
					slug: finalSlug,
					description: description || null,
					price: parsedPrice,
					compareAtPrice: parsedCompareAtPrice,
					stock: parsedStock,
					imageUrl: imageUrl || null,
					categoryId: categoryId || null,
					status: status as 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK',
					isFeatured
				}
			});

			return {
				success: 'Producto creado exitosamente',
				product
			};
		} catch (error) {
			console.error('Error creating product:', error);

			if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
				// Unique constraint violation
				return fail(400, {
					error: 'El SKU o slug ya existe en la base de datos'
				});
			}

			return fail(500, {
				error: 'Error interno del servidor al crear el producto'
			});
		}
	}
};
