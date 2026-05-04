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

	if (smartphone) {
		await prisma.product.upsert({
			where: { id: 'sample-phone-1' },
			update: {},
			create: {
				id: 'sample-phone-1',
				name: 'iPhone 15 Pro',
				description: 'El último iPhone con chip A17 Pro',
				price: 1200.0,
				stock: 10,
				isActive: true,
				categoryId: smartphone.id
			}
		});
	}

	if (laptops) {
		await prisma.product.upsert({
			where: { id: 'sample-laptop-1' },
			update: {},
			create: {
				id: 'sample-laptop-1',
				name: 'MacBook Pro 14"',
				description: 'Laptop profesional con chip M3',
				price: 2500.0,
				stock: 5,
				isActive: true,
				categoryId: laptops.id
			}
		});
	}

	console.log('Sample products created');

	// Create default settings
	await prisma.settings.upsert({
		where: { id: 'default' },
		update: {},
		create: {
			id: 'default',
			storeName: 'AMADEO STORE',
			whatsappNumber: '',
			logoUrl: '/logo.png',
			welcomeMessage: 'Hola, quiero realizar el siguiente pedido:'
		}
	});

	console.log('Default settings created');

	// Create default admin user
	const adminExists = await prisma.adminUser.findUnique({
		where: { email: 'admin@amadeostore.com' }
	});

	if (!adminExists) {
		const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
		await prisma.adminUser.create({
			data: {
				email: 'admin@amadeostore.com',
				password: hashedPassword,
				name: 'Admin',
				isActive: true
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
