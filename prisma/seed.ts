import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
	console.log('Seeding database...');

	// Create categories
	const categories = await Promise.all([
		prisma.category.upsert({
			where: { slug: 'smartphones' },
			update: {},
			create: {
				name: 'Smartphones',
				slug: 'smartphones'
			}
		}),
		prisma.category.upsert({
			where: { slug: 'laptops' },
			update: {},
			create: {
				name: 'Laptops',
				slug: 'laptops'
			}
		}),
		prisma.category.upsert({
			where: { slug: 'accesorios' },
			update: {},
			create: {
				name: 'Accesorios',
				slug: 'accesorios'
			}
		})
	]);

	console.log(`Created ${categories.length} categories`);

	// Create sample products
	const smartphone = categories.find((c: { slug: string }) => c.slug === 'smartphones');
	const laptops = categories.find((c: { slug: string }) => c.slug === 'laptops');
	const accessories = categories.find((c: { slug: string }) => c.slug === 'accesorios');

	// Create products using slug as unique identifier
	const products = [
		{
			name: 'iPhone 15 Pro',
			slug: 'iphone-15-pro',
			description: 'El último iPhone con chip A17 Pro, sistema de cámaras profesional y diseño de titanio. Pantalla Super Retina XDR de 6.1 pulgadas.',
			price: 1299.99,
			compareAtPrice: 1499.99,
			stock: 15,
			status: 'ACTIVE' as const,
			isFeatured: true,
			imageUrl: 'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400&h=400&fit=crop',
			categoryId: smartphone?.id
		},
		{
			name: 'MacBook Pro 14"',
			slug: 'macbook-pro-14',
			description: 'Laptop profesional con chip M3 Pro, 18GB RAM, 512GB SSD. Pantalla Liquid Retina XDR de 14.2 pulgadas.',
			price: 2499.99,
			compareAtPrice: 2799.99,
			stock: 8,
			status: 'ACTIVE' as const,
			isFeatured: true,
			imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
			categoryId: laptops?.id
		},
		{
			name: 'AirPods Pro (2ª Gen)',
			slug: 'airpods-pro-2',
			description: 'Auriculares inalámbricos con cancelación activa de ruido, audio espacial y chip H2. Hasta 6 horas de reproducción.',
			price: 249.99,
			compareAtPrice: 299.99,
			stock: 25,
			status: 'ACTIVE' as const,
			isFeatured: false,
			imageUrl: 'https://images.unsplash.com/photo-1606235225535-b5b6c2c9c3e2?w=400&h=400&fit=crop',
			categoryId: accessories?.id
		},
		{
			name: 'iPad Air (5ª Gen)',
			slug: 'ipad-air-5',
			description: 'Tablet con chip M1, pantalla Liquid Retina de 10.9 pulgadas, 64GB WiFi. Compatible con Apple Pencil y Magic Keyboard.',
			price: 599.99,
			compareAtPrice: 699.99,
			stock: 12,
			status: 'ACTIVE' as const,
			isFeatured: true,
			imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
			categoryId: smartphone?.id
		},
		{
			name: 'Magic Mouse',
			slug: 'magic-mouse',
			description: 'Mouse inalámbrico recargable conMulti-Touch surface. Conexión Bluetooth y puerto Lightning para carga.',
			price: 79.99,
			compareAtPrice: null,
			stock: 30,
			status: 'ACTIVE' as const,
			isFeatured: false,
			imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
			categoryId: accessories?.id
		}
	];

	// Create products
	for (const productData of products) {
		if (productData.categoryId) {
			await prisma.product.upsert({
				where: { slug: productData.slug },
				update: {
					name: productData.name,
					description: productData.description,
					price: productData.price,
					compareAtPrice: productData.compareAtPrice,
					stock: productData.stock,
					status: productData.status,
					isFeatured: productData.isFeatured,
					imageUrl: productData.imageUrl,
					categoryId: productData.categoryId
				},
				create: productData
			});
		}
	}

	console.log(`${products.length} products created`);

	// Create default admin user
	const adminExists = await prisma.user.findUnique({
		where: { email: 'admin@amadeostore.com' }
	});

	if (!adminExists) {
		const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
		await prisma.user.create({
			data: {
				email: 'admin@amadeostore.com',
				passwordHash: hashedPassword,
				name: 'Admin',
				role: 'ADMIN',
				status: 'ACTIVE'
			}
		});
		console.log('Default admin created: admin@amadeostore.com / admin123');
	} else {
		console.log('Admin already exists');
	}

	console.log('Seeding complete!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
