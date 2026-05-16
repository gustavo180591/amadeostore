import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function load({ params }) {
	try {
		// First try to find by slug, then by ID (handle both cases)
		let productData = await prisma.product.findUnique({
			where: { slug: params.slug },
			include: {
				category: true,
				images: {
					orderBy: { sortOrder: 'asc' }
				}
			}
		});

		// If not found by slug, try by ID
		if (!productData) {
			productData = await prisma.product.findUnique({
				where: { id: params.slug },
				include: {
					category: true,
					images: {
						orderBy: { sortOrder: 'asc' }
					}
				}
			});
		}

		if (!productData) {
			throw fail(404, {
				message: 'Producto no encontrado'
			});
		}

		// Serialize product for JSON compatibility
		const product = {
			...productData,
			price: Number(productData.price)
		};

		// Get all categories for dropdown
		const categories = await prisma.category.findMany({
			where: { isActive: true },
			orderBy: { name: 'asc' }
		});

		return {
			product,
			categories
		};
	} catch (error) {
		console.error('Error loading product for edit:', error);
		throw fail(500, {
			message: 'Error al cargar el producto'
		});
	}
}

export const actions = {
	update: async ({ request, params }) => {
		try {
			console.log('=== PRODUCT UPDATE DEBUG ===');
			console.log('Update action called with params:', params);
			const formData = await request.formData();
			console.log('Form data received:', Object.fromEntries(formData.entries()));

			const name = formData.get('name') as string;
			const description = formData.get('description') as string;
			const price = formData.get('price') as string;
			const stock = formData.get('stock') as string;
			const sku = formData.get('sku') as string;
			const imageUrl = formData.get('imageUrl') as string;
			const categoryId = formData.get('categoryId')?.toString() || null;
			const isFeatured = formData.get('isFeatured') === 'true';

			// Validar status con valores seguros
			const rawStatus = formData.get('status');
			const status =
				rawStatus === 'PUBLISHED' ||
				rawStatus === 'DRAFT' ||
				rawStatus === 'OUT_OF_STOCK' ||
				rawStatus === 'ARCHIVED'
					? rawStatus
					: 'DRAFT';

			console.log('Processed form data:', { name, price, stock, status, categoryId, isFeatured });

			// Validation
			if (!name || !price || !stock) {
				return fail(400, {
					message: 'Los campos nombre, precio y stock son obligatorios',
					values: {
						name,
						description,
						price,
						stock,
						sku,
						imageUrl,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			// Check if SKU already exists (excluding current product)
			if (sku) {
				const existingProduct = await prisma.product.findFirst({
					where: {
						sku,
						slug: { not: params.slug }
					}
				});

				if (existingProduct) {
					return fail(400, {
						message: 'El SKU ya está en uso por otro producto',
						values: {
							name,
							description,
							price,
							stock,
							sku,
							imageUrl,
							categoryId,
							status,
							isFeatured
						}
					});
				}
			}

			// Update product - try by slug first, then by ID
			let updatedProduct;

			try {
				// Try by slug first
				updatedProduct = await prisma.product.update({
					where: { slug: params.slug },
					data: {
						name,
						description: description || null,
						price: parseFloat(price),
						stock: parseInt(stock),
						sku: sku || null,
						imageUrl: imageUrl || null,
						categoryId,
						status,
						isFeatured
					},
					include: {
						category: true,
						images: {
							orderBy: { sortOrder: 'asc' }
						}
					}
				});
			} catch (error) {
				// If slug fails, try by ID
				updatedProduct = await prisma.product.update({
					where: { id: params.slug },
					data: {
						name,
						description: description || null,
						price: parseFloat(price),
						stock: parseInt(stock),
						sku: sku || null,
						imageUrl: imageUrl || null,
						categoryId,
						status,
						isFeatured
					},
					include: {
						category: true,
						images: {
							orderBy: { sortOrder: 'asc' }
						}
					}
				});
			}

			// Serialize for JSON compatibility
			const serializedProduct = {
				...updatedProduct,
				price: Number(updatedProduct.price)
			};

			console.log('Product updated successfully:', serializedProduct);
			console.log('=== END PRODUCT UPDATE DEBUG ===');

			return {
				success: true,
				message: 'Producto actualizado correctamente',
				product: serializedProduct
			};
		} catch (error) {
			console.error('Error updating product:', error);
			return fail(500, {
				message: 'Error al actualizar el producto'
			});
		}
	}
};
