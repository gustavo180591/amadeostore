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

	const user = await prisma.user.create({
		data: {
			email,
			passwordHash: hashedPassword,
			name: name || 'Admin',
			role: 'ADMIN',
			status: 'ACTIVE'
		},
		select: {
			id: true,
			email: true,
			name: true,
			status: true
		}
	});

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		isActive: user.status === 'ACTIVE'
	};
}

export async function authenticateAdmin(
	email: string,
	password: string
): Promise<AdminUser | null> {
	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			passwordHash: true,
			name: true,
			status: true,
			role: true
		}
	});

	if (!user || user.role !== 'ADMIN' || user.status !== 'ACTIVE') {
		return null;
	}

	const isValid = await verifyPassword(password, user.passwordHash);

	if (!isValid) {
		return null;
	}

	// Don't return password
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { passwordHash: _password, role: _role, ...userWithoutPassword } = user;

	return {
		id: userWithoutPassword.id,
		email: userWithoutPassword.email,
		name: userWithoutPassword.name,
		isActive: userWithoutPassword.status === 'ACTIVE'
	};
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			name: true,
			status: true,
			role: true
		}
	});

	if (!user || user.role !== 'ADMIN' || user.status !== 'ACTIVE') {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		isActive: user.status === 'ACTIVE'
	};
}
