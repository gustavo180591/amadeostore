export const STORE_CONFIG = {
	name: 'AmadeoStore',
	whatsapp: '5491123456789', // Número de WhatsApp para pedidos
	email: 'contacto@amadeostore.com',
	phone: '+54 9 11 2345-6789',
	address: 'Buenos Aires, Argentina',
	currency: 'ARS',
	locale: 'es-AR'
};

export const WHATSAPP_CONFIG = {
	phone: STORE_CONFIG.whatsapp,
	generateOrderMessage: (items: Array<{
		name: string;
		quantity: number;
		price: number;
		variant?: {
			colorName?: string;
			storage?: string;
		};
	}>, total: number) => {
		const storeName = STORE_CONFIG.name;
		const greeting = `¡Hola! Quiero realizar el siguiente pedido en ${storeName}:`;
		
		const itemsList = items.map(item => {
			const variantInfo = item.variant 
				? ` (${item.variant.colorName}${item.variant.storage ? ` - ${item.variant.storage}` : ''})`
				: '';
			
			return `• ${item.name}${variantInfo} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}`;
		}).join('\n');

		const totalFormatted = `Total: $${total.toLocaleString('es-AR')}`;
		const closing = '\n\n¿Podrían confirmarme la disponibilidad y el tiempo de entrega? ¡Gracias!';

		return `${greeting}\n\n${itemsList}\n\n${totalFormatted}${closing}`;
	},
	createWhatsAppUrl: (message: string) => {
		const encodedMessage = encodeURIComponent(message);
		return `https://wa.me/${WHATSAPP_CONFIG.phone}?text=${encodedMessage}`;
	}
};
