import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { categoryId } = params;

	try {
		const body = await request.json();
		const { isActive } = body;

		// Update category status
		const updatedCategory = await prisma.category.update({
			where: { id: categoryId },
			data: { isActive }
		});

		return json({
			success: true,
			category: updatedCategory
		});
	} catch (error) {
		console.error('Error updating category:', error);
		return json(
			{
				success: false,
				error: 'Error updating category'
			},
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { categoryId } = params;

	try {
		// Check if category has products
		const productCount = await prisma.product.count({
			where: { categoryId }
		});

		if (productCount > 0) {
			return json(
				{
					success: false,
					error: 'Cannot delete category with associated products'
				},
				{ status: 400 }
			);
		}

		// Delete category
		await prisma.category.delete({
			where: { id: categoryId }
		});

		return json({
			success: true,
			message: 'Category deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting category:', error);
		return json(
			{
				success: false,
				error: 'Error deleting category'
			},
			{ status: 500 }
		);
	}
};
