import { writable } from 'svelte/store';

export interface CartItem {
	id: string;
	name: string;
	price: number;
	imageUrl?: string;
	quantity: number;
}

export interface CartState {
	items: CartItem[];
	total: number;
	count: number;
}

function createCartStore() {
	const { subscribe, set, update } = writable<CartState>({
		items: [],
		total: 0,
		count: 0
	});

	return {
		subscribe,
		set,
		update,

		// Add item to cart
		addItem: async (productId: string, quantity: number = 1) => {
			try {
				const response = await fetch('/api/cart', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ productId, quantity })
				});

				const result = await response.json();

				if (result.success) {
					// Show success message
					alert('Producto agregado al carrito exitosamente');

					// Update local cart state (simplified for now)
					update((cart) => {
						const existingItem = cart.items.find((item) => item.id === productId);

						if (existingItem) {
							// Update quantity
							return {
								...cart,
								items: cart.items.map((item) =>
									item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
								),
								count: cart.count + quantity,
								total: cart.total + result.product.price * quantity
							};
						} else {
							// Add new item
							const newItem: CartItem = {
								id: result.product.id,
								name: result.product.name,
								price: result.product.price,
								imageUrl: result.product.imageUrl,
								quantity: result.product.quantity
							};

							return {
								...cart,
								items: [...cart.items, newItem],
								count: cart.count + quantity,
								total: cart.total + result.product.price * quantity
							};
						}
					});
				} else {
					alert(result.error || 'Error al agregar al carrito');
				}
			} catch (error) {
				console.error('Error adding to cart:', error);
				alert('Error al agregar al carrito');
			}
		},

		// Remove item from cart
		removeItem: (productId: string) => {
			update((cart) => {
				const item = cart.items.find((item) => item.id === productId);
				if (!item) return cart;

				return {
					...cart,
					items: cart.items.filter((item) => item.id !== productId),
					count: cart.count - item.quantity,
					total: cart.total - item.price * item.quantity
				};
			});
		},

		// Update item quantity
		updateQuantity: (productId: string, quantity: number) => {
			if (quantity <= 0) {
				return; // Don't allow zero or negative quantities
			}

			update((cart) => {
				const item = cart.items.find((item) => item.id === productId);
				if (!item) return cart;

				const quantityDiff = quantity - item.quantity;

				return {
					...cart,
					items: cart.items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
					count: cart.count + quantityDiff,
					total: cart.total + item.price * quantityDiff
				};
			});
		},

		// Clear cart
		clear: () => {
			set({
				items: [],
				total: 0,
				count: 0
			});
		}
	};
}

export const cart = createCartStore();
