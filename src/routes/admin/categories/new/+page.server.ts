import { fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get existing categories to show sort order suggestions
		const categories = await prisma.category.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				sortOrder: true
			},
			orderBy: { sortOrder: 'asc' }
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
			const slug = data.get('slug') as string;
			const description = data.get('description') as string;
			const imageUrl = data.get('imageUrl') as string;
			const sortOrder = data.get('sortOrder') as string;
			const isActive = data.get('isActive') === 'on';

			// Required field validation
			if (!name || name.trim().length === 0) {
				return fail(400, {
					error: 'El nombre de la categoría es obligatorio',
					data: {
						name,
						slug,
						description,
						imageUrl,
						sortOrder,
						isActive
					}
				});
			}

			// Name length validation
			if (name.trim().length < 2) {
				return fail(400, {
					error: 'El nombre debe tener al menos 2 caracteres',
					data: {
						name,
						slug,
						description,
						imageUrl,
						sortOrder,
						isActive
					}
				});
			}

			// Sort order validation
			let parsedSortOrder = 0;
			if (sortOrder) {
				parsedSortOrder = parseInt(sortOrder);
				if (isNaN(parsedSortOrder) || parsedSortOrder < 0) {
					return fail(400, {
						error: 'El orden de visualización debe ser un número mayor o igual a 0',
						data: {
							name,
							slug,
							description,
							imageUrl,
							sortOrder,
							isActive
						}
					});
				}
			}

			// Image URL validation (if provided)
			if (imageUrl && imageUrl.trim().length > 0) {
				try {
					new URL(imageUrl);
				} catch {
					return fail(400, {
						error: 'La URL de la imagen no es válida',
						data: {
							name,
							slug,
							description,
							imageUrl,
							sortOrder,
							isActive
						}
					});
				}
			}

			// Generate slug if not provided
			const finalSlug = slug && slug.trim().length > 0 
				? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
				: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

			// Check if slug already exists
			const existingSlug = await prisma.category.findUnique({
				where: { slug: finalSlug }
			});

			if (existingSlug) {
				return fail(400, {
					error: 'El slug ya está en uso. Por favor, elige otro',
					data: {
						name,
						slug,
						description,
						imageUrl,
						sortOrder,
						isActive
					}
				});
			}

			// Check if category name already exists (case insensitive)
			const existingName = await prisma.category.findFirst({
				where: {
					name: {
						equals: name.trim(),
						mode: 'insensitive'
					}
				}
			});

			if (existingName) {
				return fail(400, {
					error: 'Ya existe una categoría con ese nombre',
					data: {
						name,
						slug,
						description,
						imageUrl,
						sortOrder,
						isActive
					}
				});
			}

			// Create the category
			const category = await prisma.category.create({
				data: {
					name: name.trim(),
					slug: finalSlug,
					description: description && description.trim().length > 0 ? description.trim() : null,
					imageUrl: imageUrl && imageUrl.trim().length > 0 ? imageUrl.trim() : null,
					sortOrder: parsedSortOrder,
					isActive
				}
			});

			return {
				success: 'Categoría creada exitosamente',
				category
			};

		} catch (error) {
			console.error('Error creating category:', error);
			
			if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
				// Unique constraint violation
				return fail(400, {
					error: 'El slug ya existe en la base de datos'
				});
			}

			return fail(500, {
				error: 'Error interno del servidor al crear la categoría'
			});
		}
	}
};
