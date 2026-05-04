import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export interface AdminUser {
	id: string;
	email: string;
	name: string | null;
	isActive: boolean;
}

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function createAdminUser(
	email: string,
	password: string,
	name?: string
): Promise<AdminUser> {
	const hashedPassword = await hashPassword(password);

	const user = await prisma.adminUser.create({
		data: {
			email,
			password: hashedPassword,
			name,
			isActive: true
		},
		select: {
			id: true,
			email: true,
			name: true,
			isActive: true
		}
	});

	return user;
}

export async function authenticateAdmin(
	email: string,
	password: string
): Promise<AdminUser | null> {
	const user = await prisma.adminUser.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			password: true,
			name: true,
			isActive: true
		}
	});

	if (!user || !user.isActive) {
		return null;
	}

	const isValid = await verifyPassword(password, user.password);

	if (!isValid) {
		return null;
	}

	// Don't return password
	const { password: _, ...userWithoutPassword } = user;
	return userWithoutPassword;
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
	const user = await prisma.adminUser.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			name: true,
			isActive: true
		}
	});

	return user;
}
