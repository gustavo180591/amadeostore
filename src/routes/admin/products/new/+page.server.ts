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
			console.log('Product creation form submission started');
			const data = await request.formData();
			console.log('Form data received:', Object.fromEntries(data.entries()));

			// Extract and validate form data
			const name = data.get('name') as string;
			const brand = data.get('brand') as string;
			const model = data.get('model') as string;
			const sku = data.get('sku') as string;
			const slug = data.get('slug') as string;
			const description = data.get('description') as string;
			const price = data.get('price') as string;
			const stock = data.get('stock') as string;
			const categoryId = data.get('categoryId') as string;
			const status = data.get('status') as string;
			const isFeatured = data.get('isFeatured') === 'on';

			console.log('Extracted form data:', { name, price, stock, status });

			// Handle uploaded image URLs
			const uploadedImageUrls = data.getAll('uploadedImageUrls') as string[];
			const primaryImageIndex = parseInt(data.get('primaryImageIndex') as string) || 0;
			
			console.log('Images:', { uploadedImageUrls, primaryImageIndex });

			console.log('About to start validation...');
			// Required field validation
			if (!name || !price || !stock) {
				console.log('Validation failed:', { name: !!name, price: !!price, stock: !!stock });
				return fail(400, {
					error: 'Nombre, precio y stock son campos obligatorios',
					data: {
						name,
						sku,
						slug,
						description,
						price,
						stock,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			console.log('Validation passed, proceeding to price validation...');
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
						stock,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			console.log('Price validation passed, proceeding to stock validation...');
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
						stock,
						categoryId,
						status,
						isFeatured
					}
				});
			}

			console.log('Stock validation passed, stock value is:', parsedStock);

			console.log('Skipping compare price validation (field removed), proceeding to slug generation...');
			// Generate slug if not provided
			const finalSlug =
				slug ||
				name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/(^-|-$)/g, '');

			console.log('Generated slug:', finalSlug);
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
							stock,
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
						stock,
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
							stock,
							categoryId,
							status,
							isFeatured
						}
					});
				}
			}

			// Create the product
			console.log('Creating product with data:', {
				name,
				brand,
				model,
				sku,
				slug: finalSlug,
				description,
				price: parsedPrice,
				stock: parsedStock,
				categoryId,
				status,
				isFeatured
			});
			
			const product = await prisma.product.create({
				data: {
					name,
					brand: brand || null,
					model: model || null,
					sku: sku || null,
					slug: finalSlug,
					description: description || null,
					price: parsedPrice,
					stock: parsedStock,
					categoryId: categoryId || null,
					status: status as 'DRAFT' | 'PUBLISHED' | 'OUT_OF_STOCK' | 'ARCHIVED',
					isFeatured
				}
			});
			
			console.log('Product created successfully:', product.id);

			// Process uploaded images
			if (uploadedImageUrls.length > 0) {
				// Create database records for uploaded images
				for (const [index, imageUrl] of uploadedImageUrls.entries()) {
					try {
						await prisma.productImage.create({
							data: {
								url: imageUrl,
								productId: product.id,
								sortOrder: index + 1,
								isPrimary: index === primaryImageIndex // User selected primary image
							}
						});
					} catch (error) {
						console.error('Error creating image record:', error);
					}
				}
			}

			const result = {
				success: 'Producto creado exitosamente',
				product: {
					...product,
					price: Number(product.price)
				}
			};
			
			console.log('Returning success result:', result);
			return result;
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
