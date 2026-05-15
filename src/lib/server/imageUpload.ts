import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UploadResult {
	success: boolean;
	imageUrl?: string;
	imageId?: string;
	error?: string;
}

export async function uploadProductImage(file: File, productId?: string): Promise<UploadResult> {
	try {
		// Validate file
		if (!file) {
			return { success: false, error: 'No se proporcionó ningún archivo' };
		}

		// Check file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			return { 
				success: false, 
				error: 'Tipo de archivo no permitido. Solo se aceptan JPEG, PNG y WebP' 
			};
		}

		// Check file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return { 
				success: false, 
				error: 'El archivo es demasiado grande. Máximo 5MB' 
			};
		}

		// Generate unique filename
		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 15);
		const extension = file.name.split('.').pop()?.toLowerCase();
		const filename = `${timestamp}-${randomString}.${extension}`;

		// Ensure upload directory exists
		const uploadDir = join(process.cwd(), 'static', 'uploads', 'products');
		try {
			await mkdir(uploadDir, { recursive: true });
		} catch {
			// Directory might already exist
		}

		// Save file to disk
		const filePath = join(uploadDir, filename);
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(filePath, buffer);

		// Generate public URL
		const imageUrl = `/uploads/products/${filename}`;

		// If productId is provided, save to database
		if (productId) {
			// Get current max sort order for this product
			const maxSort = await prisma.productImage.findFirst({
				where: { productId },
				orderBy: { sortOrder: 'desc' }
			});

			const sortOrder = (maxSort?.sortOrder || 0) + 1;

			// Save to database
			const productImage = await prisma.productImage.create({
				data: {
					url: imageUrl,
					productId,
					sortOrder,
					isPrimary: false // New images are not primary by default
				}
			});

			return {
				success: true,
				imageUrl,
				imageId: productImage.id
			};
		}

		return {
			success: true,
			imageUrl
		};

	} catch (error) {
		console.error('Error uploading image:', error);
		return { 
			success: false, 
			error: 'Error al subir la imagen' 
		};
	}
}

export async function deleteProductImage(imageId: string): Promise<UploadResult> {
	try {
		const image = await prisma.productImage.findUnique({
			where: { id: imageId }
		});

		if (!image) {
			return { success: false, error: 'Imagen no encontrada' };
		}

		// Delete from database
		await prisma.productImage.delete({
			where: { id: imageId }
		});

		// Delete file from disk (optional, you might want to keep it)
		const filePath = join(process.cwd(), 'static', image.url);
		try {
			await unlink(filePath);
		} catch {
			// File might not exist, ignore
		}

		return { success: true };

	} catch (error) {
		console.error('Error deleting image:', error);
		return { 
			success: false, 
			error: 'Error al eliminar la imagen' 
		};
	}
}

import { unlink } from 'fs/promises';
