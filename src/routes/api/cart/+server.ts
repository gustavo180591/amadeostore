import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ locals }) => {
	try {
		// For now, return empty cart (we'll implement user authentication later)
		return json({
			items: [],
			total: 0,
			count: 0
		});
	} catch (error) {
		console.error('Error fetching cart:', error);
		return json(
			{ error: 'Error fetching cart' },
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { productId, quantity = 1 } = await request.json();

		// Validate product exists
		const product = await prisma.product.findUnique({
			where: { id: productId }
		});

		if (!product) {
			return json(
				{ error: 'Product not found' },
				{ status: 404 }
			);
		}

		if (product.status !== 'ACTIVE') {
			return json(
				{ error: 'Product is not available' },
				{ status: 400 }
			);
		}

		if (product.stock < quantity) {
			return json(
				{ error: 'Not enough stock' },
				{ status: 400 }
			);
		}

		// For now, just return success (we'll implement actual cart logic with user authentication later)
		return json({
			success: true,
			message: 'Product added to cart successfully',
			product: {
				id: product.id,
				name: product.name,
				price: Number(product.price),
				imageUrl: product.imageUrl,
				quantity
			}
		});
	} catch (error) {
		console.error('Error adding to cart:', error);
		return json(
			{ error: 'Error adding to cart' },
			{ status: 500 }
		);
	}
};
