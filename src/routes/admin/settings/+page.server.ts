import { fail, redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, hashPassword } from '$lib/server/auth';

const prisma = new PrismaClient();

// Mock settings storage - in a real app, this would be a separate settings table
const settingsStore = {
	storeName: 'AMADEO STORE',
	storeEmail: 'contacto@amadeostore.com',
	storePhone: '+54 9 11 1234-5678',
	storeAddress: 'Av. Principal 123, Ciudad, País',
	storeDescription: 'Tu tienda de confianza para productos de calidad',
	logoUrl: '/logo.png',
	faviconUrl: '/favicon.ico'
};

export async function load({ locals }: { locals: any }) {
	try {
		// Get current admin user
		let adminUser = null;
		if (locals.user) {
			adminUser = await prisma.user.findUnique({
				where: { id: locals.user.id },
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					status: true,
					createdAt: true
				}
			});
		}

		return {
			settings: settingsStore,
			adminUser
		};
	} catch (error) {
		console.error('Error loading settings:', error);
		return {
			settings: settingsStore,
			adminUser: null
		};
	}
}

export const actions = {
	// Store settings
	store: async ({ request }: { request: Request }) => {
		try {
			const data = await request.formData();
			
			const storeName = data.get('storeName') as string;
			const storeEmail = data.get('storeEmail') as string;
			const storePhone = data.get('storePhone') as string;
			const storeAddress = data.get('storeAddress') as string;
			const storeDescription = data.get('storeDescription') as string;
			const logoUrl = data.get('logoUrl') as string;
			const faviconUrl = data.get('faviconUrl') as string;

			// Email validation
			if (storeEmail && storeEmail.trim()) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(storeEmail.trim())) {
					return fail(400, {
						error: 'El email de contacto no es válido'
					});
				}
			}

			// URL validation for logo and favicon
			const validateUrl = (url: string) => {
				if (!url || !url.trim()) return true;
				try {
					new URL(url);
					return true;
				} catch {
					return false;
				}
			};

			if (logoUrl && !validateUrl(logoUrl)) {
				return fail(400, {
					error: 'La URL del logo no es válida'
				});
			}

			if (faviconUrl && !validateUrl(faviconUrl)) {
				return fail(400, {
					error: 'La URL del favicon no es válida'
				});
			}

			// Update settings (in a real app, save to database)
			Object.assign(settingsStore, {
				storeName: storeName.trim() || 'AMADEO STORE',
				storeEmail: storeEmail.trim() || '',
				storePhone: storePhone.trim() || '',
				storeAddress: storeAddress.trim() || '',
				storeDescription: storeDescription.trim() || '',
				logoUrl: logoUrl.trim() || '/logo.png',
				faviconUrl: faviconUrl.trim() || '/favicon.ico'
			});

			return {
				success: 'Configuración de tienda actualizada exitosamente'
			};

		} catch (error) {
			console.error('Error updating store settings:', error);
			return fail(500, {
				error: 'Error interno del servidor al actualizar la configuración'
			});
		}
	},

	// Password change
	password: async ({ request, locals }: { request: Request; locals: any }) => {
		try {
			if (!locals.user) {
				return fail(401, {
					error: 'No autorizado'
				});
			}

			const data = await request.formData();
			
			const currentPassword = data.get('currentPassword') as string;
			const newPassword = data.get('newPassword') as string;
			const confirmPassword = data.get('confirmPassword') as string;

			// Validation
			if (!currentPassword || !newPassword || !confirmPassword) {
				return fail(400, {
					error: 'Todos los campos de contraseña son obligatorios'
				});
			}

			if (newPassword.length < 8) {
				return fail(400, {
					error: 'La nueva contraseña debe tener al menos 8 caracteres'
				});
			}

			if (newPassword !== confirmPassword) {
				return fail(400, {
					error: 'Las contraseñas no coinciden'
				});
			}

			// Get current user
			const user = await prisma.user.findUnique({
				where: { id: locals.user.id },
				select: {
					id: true,
					passwordHash: true
				}
			});

			if (!user) {
				return fail(404, {
					error: 'Usuario no encontrado'
				});
			}

			// Verify current password
			const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
			if (!isValidPassword) {
				return fail(400, {
					error: 'La contraseña actual es incorrecta'
				});
			}

			// Hash new password
			const hashedPassword = await hashPassword(newPassword);

			// Update password
			await prisma.user.update({
				where: { id: user.id },
				data: {
					passwordHash: hashedPassword
				}
			});

			return {
				success: 'Contraseña actualizada exitosamente'
			};

		} catch (error) {
			console.error('Error updating password:', error);
			return fail(500, {
				error: 'Error interno del servidor al actualizar la contraseña'
			});
		}
	},

	// Delete account (dangerous action)
	deleteAccount: async ({ request, locals }: { request: Request; locals: any }) => {
		try {
			if (!locals.user) {
				return fail(401, {
					error: 'No autorizado'
				});
			}

			const data = await request.formData();
			const confirmEmail = data.get('confirmEmail') as string;
			const confirmText = data.get('confirmText') as string;

			// Validation
			if (!confirmEmail || !confirmText) {
				return fail(400, {
					error: 'Todos los campos de confirmación son obligatorios'
				});
			}

			if (confirmEmail !== locals.user.email) {
				return fail(400, {
					error: 'El email no coincide con tu cuenta'
				});
			}

			if (confirmText !== 'ELIMINAR') {
				return fail(400, {
					error: 'El texto de confirmación debe ser "ELIMINAR"'
				});
			}

			// Get user to delete
			const user = await prisma.user.findUnique({
				where: { id: locals.user.id }
			});

			if (!user) {
				return fail(404, {
					error: 'Usuario no encontrado'
				});
			}

			// In a real app, you might want to:
			// 1. Cancel all active sessions
			// 2. Delete or anonymize user data
			// 3. Handle business logic for account deletion

			// Delete user (this will cascade delete related data)
			await prisma.user.delete({
				where: { id: user.id }
			});

			// Redirect to login page
			throw redirect(303, '/admin/login');

		} catch (error: any) {
			console.error('Error deleting account:', error);
			
			// If it's a redirect, let it propagate
			if (error?.location) {
				throw error;
			}

			return fail(500, {
				error: 'Error interno del servidor al eliminar la cuenta'
			});
		}
	}
};
