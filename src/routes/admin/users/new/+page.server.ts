import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const load: PageServerLoad = async () => {
	try {
		// Get all categories for potential user preferences (future feature)
		const categories = await prisma.category.findMany({
			where: { isActive: true },
			orderBy: { name: 'asc' }
		});

		return {
			categories
		};
	} catch (error) {
		console.error('Error loading user creation form:', error);
		return {
			categories: []
		};
	}
}

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();

			const name = formData.get('name') as string;
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			const phone = formData.get('phone') as string;
			const role = formData.get('role') as string;
			const status = formData.get('status') as string;

			// Validation
			if (!name || !email || !password) {
				return fail(400, {
					message: 'Los campos nombre, email y contraseña son obligatorios',
					values: {
						name,
						email,
						phone,
						role,
						status
					}
				});
			}

			// Email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return fail(400, {
					message: 'El email no es válido',
					values: {
						name,
						email,
						phone,
						role,
						status
					}
				});
			}

			// Password validation
			if (password.length < 6) {
				return fail(400, {
					message: 'La contraseña debe tener al menos 6 caracteres',
					values: {
						name,
						email,
						phone,
						role,
						status
					}
				});
			}

			// Check if email already exists
			const existingUser = await prisma.user.findUnique({
				where: { email }
			});

			if (existingUser) {
				return fail(400, {
					message: 'El email ya está en uso',
					values: {
						name,
						email,
						phone,
						role,
						status
					}
				});
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

			// Create user
			const user = await prisma.user.create({
				data: {
					name,
					email,
					passwordHash: hashedPassword,
					phone: phone || null,
					role: role as 'ADMIN' | 'CUSTOMER',
					status: status as 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
				},
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
					role: true,
					status: true,
					createdAt: true,
					updatedAt: true
				}
			});

			return {
				success: true,
				message: 'Usuario creado exitosamente',
				user
			};

		} catch (error) {
			console.error('Error creating user:', error);
			return fail(500, {
				message: 'Error al crear el usuario'
			});
		}
	}
};
