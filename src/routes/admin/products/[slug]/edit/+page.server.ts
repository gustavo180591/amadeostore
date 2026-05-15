import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function load({ params }) {
	try {
		// Get product by slug
		const productData = await prisma.product.findUnique({
			where: { slug: params.slug },
			include: {
				category: true,
				images: {
					orderBy: { sortOrder: 'asc' }
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
			price: Number(productData.price),
			compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : null
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
			const formData = await request.formData();
			
			const name = formData.get('name') as string;
			const description = formData.get('description') as string;
			const price = formData.get('price') as string;
			const compareAtPrice = formData.get('compareAtPrice') as string;
			const stock = formData.get('stock') as string;
			const sku = formData.get('sku') as string;
			const imageUrl = formData.get('imageUrl') as string;
			const categoryId = formData.get('categoryId') as string;
			const status = formData.get('status') as string;
			const isFeatured = formData.get('isFeatured') === 'true';

			// Validation
			if (!name || !price || !stock) {
				return fail(400, {
					message: 'Los campos nombre, precio y stock son obligatorios',
					values: { name, description, price, compareAtPrice, stock, sku, imageUrl, categoryId, status, isFeatured }
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
						values: { name, description, price, compareAtPrice, stock, sku, imageUrl, categoryId, status, isFeatured }
					});
				}
			}

			// Update product
			const updatedProduct = await prisma.product.update({
				where: { slug: params.slug },
				data: {
					name,
					description: description || null,
					price: parseFloat(price),
					compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
					stock: parseInt(stock),
					sku: sku || null,
					imageUrl: imageUrl || null,
					categoryId: categoryId || null,
					status: status as 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK',
					isFeatured
				},
				include: {
					category: true,
					images: {
						orderBy: { sortOrder: 'asc' }
					}
				}
			});

			// Serialize for JSON compatibility
			const serializedProduct = {
				...updatedProduct,
				price: Number(updatedProduct.price),
				compareAtPrice: updatedProduct.compareAtPrice ? Number(updatedProduct.compareAtPrice) : null
			};

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
