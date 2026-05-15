import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get all categories with product count
		const categories = await prisma.category.findMany({
			include: {
				_count: {
					select: {
						products: {
							where: { status: 'ACTIVE' }
						}
					}
				}
			},
			orderBy: [
				{ sortOrder: 'asc' },
				{ name: 'asc' }
			]
		});

		// Get statistics
		const stats = {
			totalCategories: await prisma.category.count(),
			activeCategories: await prisma.category.count({ where: { isActive: true } }),
			inactiveCategories: await prisma.category.count({ where: { isActive: false } }),
			totalProducts: await prisma.product.count({ where: { status: 'ACTIVE' } })
		};

		return {
			categories,
			stats
		};
	} catch (error) {
		console.error('Error loading categories:', error);
		return {
			categories: [],
			stats: {
				totalCategories: 0,
				activeCategories: 0,
				inactiveCategories: 0,
				totalProducts: 0
			}
		};
	}
}
