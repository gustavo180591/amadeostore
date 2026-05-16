import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	try {
		// Get orders with pagination and filters
		const page = 1;
		const limit = 20;
		const skip = (page - 1) * limit;

		const [ordersData, totalCount] = await Promise.all([
			prisma.order.findMany({
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true
						}
					},
					orderItems: {
						include: {
							product: {
								select: {
									id: true,
									name: true,
									imageUrl: true
								}
							}
						}
					},
					_count: {
						select: {
							orderItems: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				},
				skip,
				take: limit
			}),
			prisma.order.count()
		]);

		// Calculate stats
		const stats = {
			totalOrders: totalCount,
			pendingOrders: ordersData.filter((o) => o.status === 'PENDING').length,
			confirmedOrders: ordersData.filter((o) => o.status === 'CONFIRMED').length,
			preparingOrders: ordersData.filter((o) => o.status === 'PREPARING').length,
			shippedOrders: ordersData.filter((o) => o.status === 'SHIPPED').length,
			deliveredOrders: ordersData.filter((o) => o.status === 'DELIVERED').length,
			cancelledOrders: ordersData.filter((o) => o.status === 'CANCELLED').length,
			totalRevenue: ordersData.reduce((sum, order) => {
				return (
					sum +
					order.orderItems.reduce((itemSum, item) => {
						return itemSum + Number(item.price) * item.quantity;
					}, 0)
				);
			}, 0),
			averageOrderValue:
				totalCount > 0
					? ordersData.reduce((sum, order) => {
							return (
								sum +
								order.orderItems.reduce((itemSum, item) => {
									return itemSum + Number(item.price) * item.quantity;
								}, 0)
							);
						}, 0) / totalCount
					: 0
		};

		return {
			orders: ordersData,
			stats,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalCount / limit),
				totalCount,
				limit
			}
		};
	} catch (error) {
		console.error('Error loading orders:', error);
		return {
			orders: [],
			stats: {
				totalOrders: 0,
				pendingOrders: 0,
				confirmedOrders: 0,
				preparingOrders: 0,
				shippedOrders: 0,
				deliveredOrders: 0,
				cancelledOrders: 0,
				totalRevenue: 0,
				averageOrderValue: 0
			},
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalCount: 0,
				limit: 20
			}
		};
	}
};
