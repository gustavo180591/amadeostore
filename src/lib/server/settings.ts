import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface StoreSettings {
	storeName: string;
	whatsappNumber: string;
	logoUrl: string | null;
	welcomeMessage: string;
}

export async function getSettings(): Promise<StoreSettings> {
	const settings = await prisma.settings.findFirst({
		where: { id: 'default' }
	});

	if (!settings) {
		return {
			storeName: 'AMADEO STORE',
			whatsappNumber: '',
			logoUrl: '/logo.png',
			welcomeMessage: 'Hola, quiero realizar el siguiente pedido:'
		};
	}

	return settings;
}

export async function updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
	const settings = await prisma.settings.upsert({
		where: { id: 'default' },
		update: data,
		create: {
			id: 'default',
			storeName: data.storeName ?? 'AMADEO STORE',
			whatsappNumber: data.whatsappNumber ?? '',
			logoUrl: data.logoUrl ?? '/logo.png',
			welcomeMessage: data.welcomeMessage ?? 'Hola, quiero realizar el siguiente pedido:'
		}
	});

	return settings;
}
