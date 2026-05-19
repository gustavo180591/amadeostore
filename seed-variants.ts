import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createProductVariants() {
	console.log('Creating product variants...');

	// Get products
	const products = await prisma.product.findMany({
		where: { status: 'PUBLISHED' }
	});

	for (const product of products) {
		console.log(`Creating variants for ${product.name}...`);

		if (product.name.includes('iPhone')) {
			// iPhone variants
			const variants = [
				{
					colorName: 'Titanium Blue',
					colorHex: '#4A90E2',
					storage: '128GB',
					price: 1200,
					oldPrice: 1400,
					stock: 5,
					sku: `${product.sku}-BLUE-128`,
					isDefault: true
				},
				{
					colorName: 'Titanium White',
					colorHex: '#F5F5F5',
					storage: '128GB',
					price: 1200,
					oldPrice: 1400,
					stock: 3,
					sku: `${product.sku}-WHITE-128`,
					isDefault: false
				},
				{
					colorName: 'Titanium Black',
					colorHex: '#1C1C1E',
					storage: '256GB',
					price: 1400,
					oldPrice: 1600,
					stock: 2,
					sku: `${product.sku}-BLACK-256`,
					isDefault: false
				}
			];

			for (const variantData of variants) {
				const existing = await prisma.productVariant.findFirst({
					where: { sku: variantData.sku }
				});

				if (!existing) {
					const variant = await prisma.productVariant.create({
						data: {
							...variantData,
							productId: product.id
						}
					});
					console.log(`  Created variant: ${variant.colorName} ${variant.storage}`);

					// Create image for variant
					await prisma.productVariantImage.create({
						data: {
							url: `https://picsum.photos/400/300?random=${Math.random()}`,
							alt: `${product.name} - ${variant.colorName} ${variant.storage}`,
							sortOrder: 0,
							variantId: variant.id
						}
					});
				}
			}
		} else if (product.name.includes('Samsung')) {
			// Samsung variants
			const variants = [
				{
					colorName: 'Phantom Black',
					colorHex: '#1C1C1E',
					storage: '128GB',
					price: 999,
					oldPrice: 1199,
					stock: 8,
					sku: `${product.sku}-BLACK-128`,
					isDefault: true
				},
				{
					colorName: 'Phantom Silver',
					colorHex: '#C0C0C0',
					storage: '256GB',
					price: 1099,
					oldPrice: 1299,
					stock: 4,
					sku: `${product.sku}-SILVER-256`,
					isDefault: false
				},
				{
					colorName: 'Phantom Violet',
					colorHex: '#8A2BE2',
					storage: '512GB',
					price: 1299,
					oldPrice: 1499,
					stock: 3,
					sku: `${product.sku}-VIOLET-512`,
					isDefault: false
				}
			];

			for (const variantData of variants) {
				const existing = await prisma.productVariant.findFirst({
					where: { sku: variantData.sku }
				});

				if (!existing) {
					const variant = await prisma.productVariant.create({
						data: {
							...variantData,
							productId: product.id
						}
					});
					console.log(`  Created variant: ${variant.colorName} ${variant.storage}`);

					// Create image for variant
					await prisma.productVariantImage.create({
						data: {
							url: `https://picsum.photos/400/300?random=${Math.random()}`,
							alt: `${product.name} - ${variant.colorName} ${variant.storage}`,
							sortOrder: 0,
							variantId: variant.id
						}
					});
				}
			}
		} else if (product.name.includes('MacBook')) {
			// MacBook variants
			const variants = [
				{
					colorName: 'Space Gray',
					colorHex: '#4A4A4A',
					storage: '512GB SSD',
					price: 2500,
					oldPrice: null,
					stock: 3,
					sku: `${product.sku}-GRAY-512`,
					isDefault: true
				},
				{
					colorName: 'Silver',
					colorHex: '#E8E8E8',
					storage: '1TB SSD',
					price: 3000,
					oldPrice: null,
					stock: 2,
					sku: `${product.sku}-SILVER-1TB`,
					isDefault: false
				}
			];

			for (const variantData of variants) {
				const existing = await prisma.productVariant.findFirst({
					where: { sku: variantData.sku }
				});

				if (!existing) {
					const variant = await prisma.productVariant.create({
						data: {
							...variantData,
							productId: product.id
						}
					});
					console.log(`  Created variant: ${variant.colorName} ${variant.storage}`);

					// Create image for variant
					await prisma.productVariantImage.create({
						data: {
							url: `https://picsum.photos/400/300?random=${Math.random()}`,
							alt: `${product.name} - ${variant.colorName} ${variant.storage}`,
							sortOrder: 0,
							variantId: variant.id
						}
					});
				}
			}
		}
	}

	console.log('Product variants created successfully!');
}

createProductVariants()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
