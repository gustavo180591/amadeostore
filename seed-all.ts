import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAll() {
	console.log('🌱 Starting complete seed process...');

	// 1. Create categories
	console.log('\n📁 Creating categories...');
	const categories = [
		{ name: 'Smartphones', slug: 'smartphones', isActive: true },
		{ name: 'Laptops', slug: 'laptops', isActive: true },
		{ name: 'Tablets', slug: 'tablets', isActive: true },
		{ name: 'Accessories', slug: 'accessories', isActive: true }
	];

	for (const catData of categories) {
		const existing = await prisma.category.findFirst({
			where: { slug: catData.slug }
		});

		if (!existing) {
			const category = await prisma.category.create({
				data: catData
			});
			console.log(`  ✅ Created category: ${category.name}`);
		} else {
			console.log(`  ⏭️  Category already exists: ${existing.name}`);
		}
	}

	// 2. Get categories for product creation
	const smartphoneCat = await prisma.category.findFirst({ where: { slug: 'smartphones' } });
	const laptopCat = await prisma.category.findFirst({ where: { slug: 'laptops' } });
	const tabletCat = await prisma.category.findFirst({ where: { slug: 'tablets' } });
	const accessoriesCat = await prisma.category.findFirst({ where: { slug: 'accessories' } });

	// 3. Create products
	console.log('\n📱 Creating products...');
	const products = [
		{
			name: 'iPhone 15 Pro',
			slug: 'iphone-15-pro',
			description:
				'El iPhone más avanzado con chip A17 Pro, titanio y sistema de cámaras profesional',
			price: 1200,
			oldPrice: 1400,
			stock: 15,
			sku: 'IPHONE15PRO001',
			status: 'PUBLISHED' as const,
			isFeatured: true,
			badge: 'NEW',
			promoText: '20% OFF',
			brand: 'Apple',
			model: 'iPhone 15 Pro',
			categoryId: smartphoneCat?.id || '',
			imageUrl: 'https://picsum.photos/400/300?random=1'
		},
		{
			name: 'Samsung Galaxy S24 Ultra',
			slug: 'samsung-galaxy-s24-ultra',
			description: 'Smartphone premium con S Pen integrado y cámara de 200MP',
			price: 1100,
			oldPrice: 1300,
			stock: 12,
			sku: 'GALAXYS24U001',
			status: 'PUBLISHED' as const,
			isFeatured: true,
			badge: 'HOT',
			promoText: 'Limited Offer',
			brand: 'Samsung',
			model: 'Galaxy S24 Ultra',
			categoryId: smartphoneCat?.id || '',
			imageUrl: 'https://picsum.photos/400/300?random=2'
		},
		{
			name: 'MacBook Pro M3',
			slug: 'macbook-pro-m3',
			description: 'Laptop profesional con chip M3 de última generación',
			price: 2500,
			stock: 8,
			sku: 'MACBOOKM3001',
			status: 'PUBLISHED' as const,
			isFeatured: false,
			badge: null,
			promoText: null,
			brand: 'Apple',
			model: 'MacBook Pro M3',
			categoryId: laptopCat?.id || '',
			imageUrl: 'https://picsum.photos/400/300?random=3'
		},
		{
			name: 'iPad Pro 12.9"',
			slug: 'ipad-pro-12-9',
			description: 'Tablet profesional con chip M2 y pantalla Liquid Retina XDR',
			price: 1099,
			oldPrice: 1199,
			stock: 10,
			sku: 'IPADPRO129001',
			status: 'PUBLISHED' as const,
			isFeatured: true,
			badge: 'SALE',
			promoText: '15% OFF',
			brand: 'Apple',
			model: 'iPad Pro 12.9"',
			categoryId: tabletCat?.id || '',
			imageUrl: 'https://picsum.photos/400/300?random=4'
		},
		{
			name: 'AirPods Pro (2ª Gen)',
			slug: 'airpods-pro-2',
			description: 'Auriculares inalámbricos con cancelación activa de ruido',
			price: 249,
			stock: 20,
			sku: 'AIRPODSPRO2001',
			status: 'PUBLISHED' as const,
			isFeatured: false,
			badge: null,
			promoText: null,
			brand: 'Apple',
			model: 'AirPods Pro (2ª Gen)',
			categoryId: accessoriesCat?.id || '',
			imageUrl: 'https://picsum.photos/400/300?random=5'
		},
		{
			name: 'Magic Mouse',
			slug: 'magic-mouse',
			description: 'Mouse multi-touch inalámbrico recargable',
			price: 79,
			stock: 25,
			sku: 'MAGICMOUSE001',
			status: 'PUBLISHED' as const,
			isFeatured: false,
			badge: null,
			promoText: null,
			brand: 'Apple',
			model: 'Magic Mouse',
			categoryId: accessoriesCat?.id || '',
			imageUrl: 'https://picsum.photos/400/300?random=6'
		}
	];

	for (const productData of products) {
		const existing = await prisma.product.findUnique({
			where: { slug: productData.slug }
		});

		if (!existing) {
			const product = await prisma.product.create({
				data: productData
			});
			console.log(`  ✅ Created product: ${product.name}`);

			// Create primary image
			await prisma.productImage.create({
				data: {
					url: productData.imageUrl,
					alt: `${product.name} - Image 1`,
					sortOrder: 0,
					isPrimary: true,
					productId: product.id
				}
			});
		} else {
			console.log(`  ⏭️  Product already exists: ${existing.name}`);
		}
	}

	// 4. Create variants for products
	console.log('\n🎨 Creating product variants...');
	const createdProducts = await prisma.product.findMany({
		where: { status: 'PUBLISHED' }
	});

	for (const product of createdProducts) {
		console.log(`  Creating variants for ${product.name}...`);

		if (product.name.includes('iPhone')) {
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

			await createVariantsForProduct(product.id, variants, product.name);
		} else if (product.name.includes('Samsung')) {
			const variants = [
				{
					colorName: 'Phantom Black',
					colorHex: '#1C1C1E',
					storage: '128GB',
					price: 1100,
					oldPrice: 1300,
					stock: 8,
					sku: `${product.sku}-BLACK-128`,
					isDefault: true
				},
				{
					colorName: 'Phantom Silver',
					colorHex: '#C0C0C0',
					storage: '256GB',
					price: 1200,
					oldPrice: 1400,
					stock: 4,
					sku: `${product.sku}-SILVER-256`,
					isDefault: false
				},
				{
					colorName: 'Phantom Violet',
					colorHex: '#8A2BE2',
					storage: '512GB',
					price: 1400,
					oldPrice: 1600,
					stock: 3,
					sku: `${product.sku}-VIOLET-512`,
					isDefault: false
				}
			];

			await createVariantsForProduct(product.id, variants, product.name);
		} else if (product.name.includes('MacBook')) {
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

			await createVariantsForProduct(product.id, variants, product.name);
		} else if (product.name.includes('iPad')) {
			const variants = [
				{
					colorName: 'Space Gray',
					colorHex: '#4A4A4A',
					storage: '128GB',
					price: 1099,
					oldPrice: 1199,
					stock: 5,
					sku: `${product.sku}-GRAY-128`,
					isDefault: true
				},
				{
					colorName: 'Silver',
					colorHex: '#E8E8E8',
					storage: '256GB',
					price: 1299,
					oldPrice: 1399,
					stock: 3,
					sku: `${product.sku}-SILVER-256`,
					isDefault: false
				}
			];

			await createVariantsForProduct(product.id, variants, product.name);
		}
	}

	console.log('\n🎉 Seed process completed successfully!');
	console.log('\n📊 Summary:');
	console.log(`  - Categories: ${await prisma.category.count()}`);
	console.log(`  - Products: ${await prisma.product.count()}`);
	console.log(`  - Variants: ${await prisma.productVariant.count()}`);
	console.log(`  - Images: ${await prisma.productImage.count()}`);
	console.log(`  - Variant Images: ${await prisma.productVariantImage.count()}`);
}

async function createVariantsForProduct(productId: string, variants: any[], productName: string) {
	for (const variantData of variants) {
		const existing = await prisma.productVariant.findFirst({
			where: { sku: variantData.sku }
		});

		if (!existing) {
			const variant = await prisma.productVariant.create({
				data: {
					...variantData,
					productId
				}
			});
			console.log(`    ✅ Created variant: ${variant.colorName} ${variant.storage}`);

			// Create image for variant
			await prisma.productVariantImage.create({
				data: {
					url: `https://picsum.photos/400/300?random=${Math.random()}`,
					alt: `${productName} - ${variant.colorName} ${variant.storage}`,
					sortOrder: 0,
					variantId: variant.id
				}
			});
		}
	}
}

seedAll()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
