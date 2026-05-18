// Script para limpiar el estado del carrito en localStorage
console.log('Limpiando estado del carrito...');

// Eliminar el estado isOpen del carrito guardado
const cartKey = 'amadeostore-cart';
const stored = localStorage.getItem(cartKey);

if (stored) {
    try {
        const cart = JSON.parse(stored);
        const cleanedCart = {
            ...cart,
            isOpen: false
        };
        localStorage.setItem(cartKey, JSON.stringify(cleanedCart));
        console.log('Estado del carrito limpiado. Ahora siempre comenzará cerrado.');
    } catch (error) {
        console.error('Error al limpiar el carrito:', error);
        // Si hay error, eliminar completamente el carrito
        localStorage.removeItem(cartKey);
        console.log('Carrito eliminado por error. Se creará uno nuevo limpio.');
    }
} else {
    console.log('No hay carrito guardado. Todo está limpio.');
}

console.log('¡Listo! El carrito ahora solo se abrirá cuando presiones el botón del carrito.');
