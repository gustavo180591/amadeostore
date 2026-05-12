import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getAdminUserById } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const sessionId = cookies.get('admin-session');

	// If no session, redirect to login
	if (!sessionId) {
		if (url.pathname !== '/admin/login') {
			throw redirect(302, '/admin/login');
		}
		return { user: null };
	}

	// Get user from session
	const user = await getAdminUserById(sessionId);

	// If user not found or inactive, redirect to login
	if (!user || !user.isActive) {
		cookies.delete('admin-session', { path: '/' });
		throw redirect(302, '/admin/login');
	}

	// If accessing login page while logged in, redirect to dashboard
	if (url.pathname === '/admin/login') {
		throw redirect(302, '/admin');
	}

	return { user };
};
