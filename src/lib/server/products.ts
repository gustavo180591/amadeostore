import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProducts() {
	const products = await prisma.product.findMany({
		where: { isActive: true },
		include: {
			category: true
		},
		orderBy: {
			name: 'asc'
		}
	});

	return products;
}

export async function getProductById(id: string) {
	const product = await prisma.product.findUnique({
		where: { 
			id,
			isActive: true 
		},
		include: {
			category: true
		}
	});

	return product;
}

export async function getProductsByCategory(categoryId: string) {
	const products = await prisma.product.findMany({
		where: { 
			categoryId,
			isActive: true 
		},
		include: {
			category: true
		},
		orderBy: {
			name: 'asc'
		}
	});

	return products;
}

export async function getCategories() {
	const categories = await prisma.category.findMany({
		include: {
			_count: {
				select: {
					products: {
						where: { isActive: true }
					}
				}
			}
		},
		orderBy: {
			name: 'asc'
		}
	});

	return categories;
}
