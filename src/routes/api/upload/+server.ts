import { uploadProductImage, deleteProductImage } from '$lib/server/imageUpload';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('image') as File;
		const productId = formData.get('productId') as string;

		if (!file) {
			return error(400, 'No se proporcionó ningún archivo');
		}

		const result = await uploadProductImage(file, productId);

		if (result.success) {
			return json(result);
		} else {
			return error(400, result.error || 'Error al subir la imagen');
		}
	} catch (err) {
		console.error('Upload error:', err);
		return error(500, 'Error interno del servidor');
	}
}

export async function DELETE({ request }) {
	try {
		const { imageId } = await request.json();

		if (!imageId) {
			return error(400, 'No se proporcionó el ID de la imagen');
		}

		const result = await deleteProductImage(imageId);

		if (result.success) {
			return json(result);
		} else {
			return error(400, result.error || 'Error al eliminar la imagen');
		}
	} catch (err) {
		console.error('Delete error:', err);
		return error(500, 'Error interno del servidor');
	}
}
