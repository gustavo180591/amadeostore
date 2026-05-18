import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestProducts() {
	console.log('Creating test products...');

	// Get first category
	const category = await prisma.category.findFirst();
	if (!category) {
		console.log('No categories found. Creating category first...');
		const newCategory = await prisma.category.create({
			data: {
				name: 'Test Category',
				slug: 'test-category',
				isActive: true
			}
		});
		console.log('Created category:', newCategory.name);
	}

	// Create test products
	const testProducts = [
		{
			name: 'iPhone 15 Pro',
			slug: 'iphone-15-pro',
			description: 'Latest iPhone with advanced features',
			price: 1200,
			oldPrice: 1400,
			stock: 10,
			sku: 'IPHONE15PRO001',
			status: 'PUBLISHED' as const,
			isFeatured: true,
			badge: 'NEW',
			promoText: '20% OFF',
			brand: 'Apple',
			model: 'iPhone 15 Pro',
			categoryId: category?.id || '1'
		},
		{
			name: 'Samsung Galaxy S24',
			slug: 'samsung-galaxy-s24',
			description: 'Premium Android smartphone',
			price: 999,
			oldPrice: 1199,
			stock: 15,
			sku: 'GALAXYS24001',
			status: 'PUBLISHED' as const,
			isFeatured: true,
			badge: 'HOT',
			promoText: 'Limited Offer',
			brand: 'Samsung',
			model: 'Galaxy S24',
			categoryId: category?.id || '1'
		},
		{
			name: 'MacBook Pro M3',
			slug: 'macbook-pro-m3',
			description: 'Professional laptop with M3 chip',
			price: 2500,
			stock: 5,
			sku: 'MACBOOKM3001',
			status: 'PUBLISHED' as const,
			isFeatured: false,
			badge: null,
			promoText: null,
			brand: 'Apple',
			model: 'MacBook Pro M3',
			categoryId: category?.id || '1'
		}
	];

	for (const productData of testProducts) {
		// Check if product already exists
		const existing = await prisma.product.findUnique({
			where: { slug: productData.slug }
		});

		if (!existing) {
			const product = await prisma.product.create({
				data: productData
			});
			console.log('Created product:', product.name);

			// Create a primary image for each product
			await prisma.productImage.create({
				data: {
					url: `https://picsum.photos/400/300?random=${Math.random()}`,
					alt: `${product.name} - Image 1`,
					sortOrder: 0,
					isPrimary: true,
					productId: product.id
				}
			});
		} else {
			console.log('Product already exists:', existing.name);
		}
	}

	console.log('Test products created successfully!');
}

createTestProducts()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
