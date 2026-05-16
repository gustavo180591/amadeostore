import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
	console.log('Seeding database...');

	// Create categories - Solo categorías de tecnología
	const categoryData = [
		// Cámaras y Accesorios
		{ name: 'Accesorios para Cámaras', slug: 'accesorios-para-camaras' },
		{ name: 'Cables', slug: 'cables-camaras' },
		{ name: 'Cámaras', slug: 'camaras' },
		{ name: 'Drones y Accesorios', slug: 'drones-y-accesorios-camaras' },
		{ name: 'Filmadoras y Cámaras de Acción', slug: 'filmadoras-y-camaras-de-accion' },
		{ name: 'Instrumentos Ópticos', slug: 'instrumentos-opticos' },
		{ name: 'Lentes y Filtros', slug: 'lentes-y-filtros' },
		{ name: 'Repuestos para Cámaras', slug: 'repuestos-para-camaras' },
		{ name: 'Revelado y Laboratorio', slug: 'revelado-y-laboratorio' },
		{ name: 'Álbumes y Portarretratos', slug: 'albumes-y-portarretratos' },
		{ name: 'Otros Cámaras', slug: 'otros-camaras' },
		
		// Celulares y Teléfonos
		{ name: 'Accesorios para Celulares', slug: 'accesorios-para-celulares' },
		{ name: 'Celulares y Smartphones', slug: 'celulares-y-smartphones' },
		{ name: 'Handies y Radiofrecuencia', slug: 'handies-y-radiofrecuencia' },
		{ name: 'Lentes Celulares', slug: 'lentes-celulares' },
		{ name: 'Repuestos de Celulares', slug: 'repuestos-de-celulares' },
		{ name: 'Smartwatches y Accesorios', slug: 'smartwatches-y-accesorios' },
		{ name: 'Tarifadores y Cabinas', slug: 'tarifadores-y-cabinas' },
		{ name: 'Telefonía Fija e Inalámbrica', slug: 'telefonia-fija-e-inalambrica' },
		{ name: 'Telefonía IP', slug: 'telefonia-ip' },
		{ name: 'Otros Celulares', slug: 'otros-celulares' },
		
		// Computación
		{ name: 'Accesorios de Antiestática', slug: 'accesorios-de-antiestatica' },
		{ name: 'Accesorios para PC Gaming', slug: 'accesorios-para-pc-gaming' },
		{ name: 'Almacenamiento', slug: 'almacenamiento' },
		{ name: 'Cables y Hubs USB', slug: 'cables-y-hubs-usb' },
		{ name: 'Componentes de PC', slug: 'componentes-de-pc' },
		{ name: 'Conectividad y Redes', slug: 'conectividad-y-redes' },
		{ name: 'Criptomonedas', slug: 'criptomonedas' },
		{ name: 'Estabilizadores y UPS', slug: 'estabilizadores-y-ups' },
		{ name: 'Gift Cards', slug: 'gift-cards' },
		{ name: 'Impresión', slug: 'impresion' },
		{ name: 'Lectores y Scanners', slug: 'lectores-y-scanners' },
		{ name: 'Limpieza y Cuidado de PCs', slug: 'limpieza-y-cuidado-de-pcs' },
		{ name: 'Monitores y Accesorios', slug: 'monitores-y-accesorios' },
		{ name: 'Notebooks y Accesorios', slug: 'notebooks-y-accesorios' },
		{ name: 'PC de Escritorio', slug: 'pc-de-escritorio' },
		{ name: 'Palms y Handhelds', slug: 'palms-y-handhelds' },
		{ name: 'Periféricos de PC', slug: 'perifericos-de-pc' },
		{ name: 'Proyectores y Pantallas', slug: 'proyectores-y-pantallas' },
		{ name: 'Software', slug: 'software' },
		{ name: 'Tablets y Accesorios', slug: 'tablets-y-accesorios' },
		{ name: 'Otros Computación', slug: 'otros-computacion' },
		
		// Consolas y Videojuegos
		{ name: 'Accesorios para Consolas', slug: 'accesorios-para-consolas' },
		{ name: 'Accesorios para PC Gaming', slug: 'accesorios-para-pc-gaming-consolas' },
		{ name: 'Consolas', slug: 'consolas' },
		{ name: 'Flippers y Arcade', slug: 'flippers-y-arcade' },
		{ name: 'Repuestos para Consolas', slug: 'repuestos-para-consolas' },
		{ name: 'Videojuegos', slug: 'videojuegos' },
		{ name: 'Otros Videojuegos', slug: 'otros-videojuegos' },
		
		// Electrónica, Audio y Video
		{ name: 'Accesorios para Audio y Video', slug: 'accesorios-para-audio-y-video' },
		{ name: 'Accesorios para TV', slug: 'accesorios-para-tv' },
		{ name: 'Audio', slug: 'audio' },
		{ name: 'Cables Electrónica', slug: 'cables-electronica' },
		{ name: 'Componentes Electrónicos', slug: 'componentes-electronicos' },
		{ name: 'Controles Remotos', slug: 'controles-remotos' },
		{ name: 'Drones y Accesorios Electrónica', slug: 'drones-y-accesorios-electronica' },
		{ name: 'Fundas y Bolsos', slug: 'fundas-y-bolsos' },
		{ name: 'Media Streaming', slug: 'media-streaming' },
		{ name: 'Pilas y Cargadores', slug: 'pilas-y-cargadores' },
		{ name: 'Proyectores y Pantallas Electrónica', slug: 'proyectores-y-pantallas-electronica' },
		{ name: 'Repuestos para TV', slug: 'repuestos-para-tv' },
		{ name: 'Televisores', slug: 'televisores' },
		{ name: 'Video', slug: 'video' },
		{ name: 'Otros Electrónica', slug: 'otros-electronica' }
	];

	const categories = await Promise.all(
		categoryData.map(category =>
			prisma.category.upsert({
				where: { slug: category.slug },
				update: {},
				create: category
			})
		)
	);

	console.log(`Created ${categories.length} categories`);

	// Create sample products
	const smartphones = categories.find((c: { slug: string }) => c.slug === 'celulares-y-smartphones');
	const notebooks = categories.find((c: { slug: string }) => c.slug === 'notebooks-y-accesorios');
	const accesorios = categories.find((c: { slug: string }) => c.slug === 'accesorios-para-celulares');
	const tablets = categories.find((c: { slug: string }) => c.slug === 'tablets-y-ipads');

	// Create products using slug as unique identifier
	const products = [
		{
			name: 'iPhone 15 Pro',
			slug: 'iphone-15-pro',
			description:
				'El último iPhone con chip A17 Pro, sistema de cámaras profesional y diseño de titanio. Pantalla Super Retina XDR de 6.1 pulgadas.',
			price: 1299.99,
			stock: 15,
			status: 'PUBLISHED' as const,
			isFeatured: true,
			imageUrl: 'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400&h=400&fit=crop',
			categoryId: smartphones?.id
		},
		{
			name: 'MacBook Pro 14"',
			slug: 'macbook-pro-14',
			description:
				'Laptop profesional con chip M3 Pro, 18GB RAM, 512GB SSD. Pantalla Liquid Retina XDR de 14.2 pulgadas.',
			price: 2499.99,
			stock: 8,
			status: 'PUBLISHED' as const,
			isFeatured: true,
			imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
			categoryId: notebooks?.id
		},
		{
			name: 'AirPods Pro (2ª Gen)',
			slug: 'airpods-pro-2',
			description:
				'Auriculares inalámbricos con cancelación activa de ruido, audio espacial y chip H2. Hasta 6 horas de reproducción.',
			price: 249.99,
			stock: 25,
			status: 'PUBLISHED' as const,
			isFeatured: false,
			imageUrl: 'https://images.unsplash.com/photo-1606235225535-b5b6c2c9c3e2?w=400&h=400&fit=crop',
			categoryId: accesorios?.id
		},
		{
			name: 'iPad Air (5ª Gen)',
			slug: 'ipad-air-5',
			description:
				'Tablet con chip M1, pantalla Liquid Retina de 10.9 pulgadas, 64GB WiFi. Compatible con Apple Pencil y Magic Keyboard.',
			price: 599.99,
			stock: 12,
			status: 'PUBLISHED' as const,
			isFeatured: true,
			imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
			categoryId: tablets?.id
		},
		{
			name: 'Magic Mouse',
			slug: 'magic-mouse',
			description:
				'Mouse inalámbrico recargable conMulti-Touch surface. Conexión Bluetooth y puerto Lightning para carga.',
			price: 79.99,
			stock: 30,
			status: 'PUBLISHED' as const,
			isFeatured: false,
			imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
			categoryId: accesorios?.id
		}
	];

	// Create products
	const createdProducts = [];
	for (const productData of products) {
		if (productData.categoryId) {
			const product = await prisma.product.upsert({
				where: { slug: productData.slug },
				update: {
					name: productData.name,
					description: productData.description,
					price: productData.price,
					stock: productData.stock,
					status: productData.status,
					isFeatured: productData.isFeatured,
					imageUrl: productData.imageUrl,
					categoryId: productData.categoryId
				},
				create: productData
			});
			createdProducts.push(product);
		}
	}

	// Create product images
	for (const product of createdProducts) {
		if (product.imageUrl) {
			await prisma.productImage.create({
				data: {
					url: product.imageUrl,
					alt: product.name,
					sortOrder: 0,
					isPrimary: true,
					productId: product.id
				}
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
