import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get users with pagination and filters
		const page = 1;
		const limit = 20;
		const skip = (page - 1) * limit;

		const [usersData, totalCount] = await Promise.all([
			prisma.user.findMany({
				include: {
					_count: {
						select: {
							orders: true,
							cartItems: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				},
				skip,
				take: limit
			}),
			prisma.user.count()
		]);

		// Calculate stats
		const stats = {
			totalUsers: totalCount,
			activeUsers: usersData.filter((u) => u.status === 'ACTIVE').length,
			inactiveUsers: usersData.filter((u) => u.status === 'INACTIVE').length,
			blockedUsers: usersData.filter((u) => u.status === 'BLOCKED').length,
			adminUsers: usersData.filter((u) => u.role === 'ADMIN').length,
			customerUsers: usersData.filter((u) => u.role === 'CUSTOMER').length,
			newUsersThisMonth: usersData.filter((u) => {
				const createdAt = new Date(u.createdAt);
				const now = new Date();
				return (
					createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
				);
			}).length
		};

		return {
			users: usersData,
			stats,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalCount / limit),
				totalCount,
				limit
			}
		};
	} catch (error) {
		console.error('Error loading users:', error);
		return {
			users: [],
			stats: {
				totalUsers: 0,
				activeUsers: 0,
				inactiveUsers: 0,
				blockedUsers: 0,
				adminUsers: 0,
				customerUsers: 0,
				newUsersThisMonth: 0
			},
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalCount: 0,
				limit: 20
			}
		};
	}
}
