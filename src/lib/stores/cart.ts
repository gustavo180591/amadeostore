import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface CartItem {
	id: string;
	name: string;
	price: number;
	imageUrl?: string;
	quantity: number;
	category?: string;
	sku?: string;
}

export interface CartState {
	items: CartItem[];
	total: number;
	count: number;
	isOpen: boolean;
}

// Constants
const WHATSAPP_NUMBER = '+5491112345678';
const STORAGE_KEY = 'amadeostore-cart';

function createCartStore() {
	// Load cart from localStorage on init
	const getInitialCart = (): CartState => {
		if (!browser) {
			return {
				items: [],
				total: 0,
				count: 0,
				isOpen: false
			};
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch (error) {
			console.error('Error loading cart from localStorage:', error);
		}

		return {
			items: [],
			total: 0,
			count: 0,
			isOpen: false
		};
	};

	const { subscribe, set, update } = writable<CartState>(getInitialCart());

	// Save to localStorage whenever cart changes
	const saveToStorage = (cart: CartState) => {
		if (browser) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
			} catch (error) {
				console.error('Error saving cart to localStorage:', error);
			}
		}
	};

	return {
		subscribe,
		set,
		update,

		// Add item to cart
		addItem: (product: {
			id: string;
			name: string;
			price: number;
			imageUrl?: string;
			category?: string;
			sku?: string;
		}, quantity: number = 1) => {
			update((cart) => {
				const existingItem = cart.items.find((item) => item.id === product.id);

				let newItems: CartItem[];
				let newCount: number;
				let newTotal: number;

				if (existingItem) {
					// Update quantity of existing item
					newItems = cart.items.map((item) =>
						item.id === product.id
							? { ...item, quantity: item.quantity + quantity }
							: item
					);
					newCount = cart.count + quantity;
					newTotal = cart.total + product.price * quantity;
				} else {
					// Add new item
					const newItem: CartItem = {
						...product,
						quantity
					};
					newItems = [...cart.items, newItem];
					newCount = cart.count + quantity;
					newTotal = cart.total + product.price * quantity;
				}

				const newCart = {
					...cart,
					items: newItems,
					count: newCount,
					total: newTotal
				};

				saveToStorage(newCart);
				return newCart;
			});
		},

		// Remove item from cart
		removeItem: (productId: string) => {
			update((cart) => {
				const item = cart.items.find((item) => item.id === productId);
				if (!item) return cart;

				const newItems = cart.items.filter((item) => item.id !== productId);
				const newCart = {
					...cart,
					items: newItems,
					count: cart.count - item.quantity,
					total: cart.total - item.price * item.quantity
				};

				saveToStorage(newCart);
				return newCart;
			});
		},

		// Update item quantity
		updateQuantity: (productId: string, quantity: number) => {
			if (quantity <= 0) {
				// Remove item if quantity is 0 or less
				return cart.removeItem(productId);
			}

			update((cart) => {
				const item = cart.items.find((item) => item.id === productId);
				if (!item) return cart;

				const quantityDiff = quantity - item.quantity;
				const newItems = cart.items.map((item) =>
					item.id === productId ? { ...item, quantity } : item
				);
				const newCart = {
					...cart,
					items: newItems,
					count: cart.count + quantityDiff,
					total: cart.total + item.price * quantityDiff
				};

				saveToStorage(newCart);
				return newCart;
			});
		},

		// Clear cart
		clear: () => {
			const newCart = {
				items: [],
				total: 0,
				count: 0,
				isOpen: false
			};
			set(newCart);
			saveToStorage(newCart);
		},

		// Toggle cart drawer
		toggle: () => {
			update((cart) => ({ ...cart, isOpen: !cart.isOpen }));
		},

		// Open cart drawer
		open: () => {
			update((cart) => ({ ...cart, isOpen: true }));
		},

		// Close cart drawer
		close: () => {
			update((cart) => ({ ...cart, isOpen: false }));
		},

		// Generate WhatsApp message
		generateWhatsAppMessage: (customerInfo?: {
			name?: string;
			email?: string;
			phone?: string;
			address?: string;
		}) => {
			return new Promise<string>((resolve) => {
				let message = 'Hola, quiero hacer el siguiente pedido en Amadeo Store:\n\n';
				
				// Get current cart state
				const unsubscribe = subscribe((currentCart) => {
					unsubscribe();

					if (currentCart.items.length === 0) {
						resolve(message + '(Carrito vacío)');
						return;
					}

					currentCart.items.forEach((item: CartItem, index: number) => {
						message += `${index + 1}. ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
					});

					message += `\nTotal: $${currentCart.total.toLocaleString('es-AR')}\n`;

					if (customerInfo) {
						message += '\n--- Datos del Cliente ---\n';
						if (customerInfo.name) message += `Nombre: ${customerInfo.name}\n`;
						if (customerInfo.email) message += `Email: ${customerInfo.email}\n`;
						if (customerInfo.phone) message += `Teléfono: ${customerInfo.phone}\n`;
						if (customerInfo.address) message += `Dirección: ${customerInfo.address}\n`;
					}

					message += '\n¿Me confirmás disponibilidad y forma de entrega?';

					resolve(message);
				});
			});
		},

		// Open WhatsApp with cart message
		sendWhatsApp: async (customerInfo?: {
			name?: string;
			email?: string;
			phone?: string;
			address?: string;
		}) => {
			const message = await cart.generateWhatsAppMessage(customerInfo);
			const encodedMessage = encodeURIComponent(message);
			const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
			
			if (browser) {
				window.open(whatsappUrl, '_blank');
			}
		},

		// Get WhatsApp URL (for sharing)
		getWhatsAppUrl: async (customerInfo?: {
			name?: string;
			email?: string;
			phone?: string;
			address?: string;
		}) => {
			const message = await cart.generateWhatsAppMessage(customerInfo);
			const encodedMessage = encodeURIComponent(message);
			return `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
		}
	};
}

export const cart = createCartStore();
