import { PrismaClient } from '@prisma/client';
import { error, json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function POST({ request }) {
	try {
		const { imageId, productId } = await request.json();

		if (!imageId || !productId) {
			return error(400, 'Se requieren imageId y productId');
		}

		// Check if Prisma client supports isPrimary field
		console.log('Testing Prisma client...');
		const testImage = await prisma.productImage.findFirst();
		console.log('Test image fields:', testImage ? Object.keys(testImage) : 'No images found');

		// First, unset all primary images for this product using raw SQL if needed
		try {
			await prisma.productImage.updateMany({
				where: { productId },
				data: { isPrimary: false }
			});
		} catch (updateError) {
			console.error('UpdateMany error:', updateError);
			// Fallback to raw SQL
			await prisma.$executeRaw`UPDATE "ProductImage" SET "isPrimary" = false WHERE "productId" = ${productId}`;
		}

		// Set the new primary image
		let updatedImage;
		try {
			updatedImage = await prisma.productImage.update({
				where: { id: imageId },
				data: { isPrimary: true }
			});
		} catch (updateError) {
			console.error('Update error:', updateError);
			// Fallback to raw SQL
			await prisma.$executeRaw`UPDATE "ProductImage" SET "isPrimary" = true WHERE id = ${imageId}`;
			updatedImage = await prisma.productImage.findUnique({ where: { id: imageId } });
		}

		return json({
			success: true,
			message: 'Imagen principal actualizada',
			image: updatedImage
		});

	} catch (err) {
		console.error('Error setting primary image:', err);
		return error(500, 'Error interno del servidor');
	}
}
