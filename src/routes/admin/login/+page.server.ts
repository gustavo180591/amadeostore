import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { authenticateAdmin } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	// If user is already logged in, redirect to dashboard
	const sessionId = cookies.get('admin-session');
	if (sessionId) {
		throw redirect(302, '/admin');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		// Validate input
		if (!email || !password) {
			return fail(400, {
				error: 'Email y contraseña son requeridos',
				email
			});
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Email inválido',
				email
			});
		}

		try {
			// Authenticate user
			const user = await authenticateAdmin(email, password);

			if (!user) {
				return fail(401, {
					error: 'Email o contraseña incorrectos',
					email
				});
			}

			// Set session cookie (simple implementation)
			cookies.set('admin-session', user.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 // 24 hours
			});

			// Redirect to dashboard
			throw redirect(302, '/admin');
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				error: 'Error interno del servidor',
				email
			});
		}
	}
};
