"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.CartService = void 0;
const product_repository_1 = require("./product.repository");
// In-memory data store for carts
const carts = new Map();
class CartService {
    /**
     * Retrieves a cart by ID. If it doesn't exist, initializes an empty cart.
     */
    getOrCreateCart(cartId) {
        if (!carts.has(cartId)) {
            carts.set(cartId, {
                id: cartId,
                items: [],
                cartTotal: { amount: 0, currency: 'USD' },
                totalQuantity: 0
            });
        }
        return carts.get(cartId);
    }
    /**
     * Adds an item to the cart. Aggregates quantity if the product is already in the cart.
     */
    addItem(cartId, productId, quantity, metadata = {}) {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        const product = product_repository_1.ProductRepository.getById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }
        const cart = this.getOrCreateCart(cartId);
        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
            // Re-calculate the total price for this line item based on new quantity
            existingItem.pricing.totalPrice.amount = existingItem.pricing.unitPrice.amount * existingItem.quantity;
            // Optionally merge/update metadata if needed, here we just keep the initial metadata or overwrite.
            // Easiest is just keep the existing item.
        }
        else {
            const newItem = {
                productId: product.id,
                quantity,
                pricing: {
                    unitPrice: { amount: product.price.amount, currency: product.price.currency },
                    totalPrice: { amount: product.price.amount * quantity, currency: product.price.currency }
                },
                metadata: {
                    addedAt: new Date(),
                    ...metadata
                }
            };
            cart.items.push(newItem);
        }
        return this.recalculateTotals(cart);
    }
    /**
     * Removes a product entirely from the cart.
     */
    removeItem(cartId, productId) {
        const cart = this.getOrCreateCart(cartId);
        cart.items = cart.items.filter(item => item.productId !== productId);
        return this.recalculateTotals(cart);
    }
    /**
     * Formally updates the quantity of a specific cart item.
     */
    updateQuantity(cartId, productId, quantity) {
        if (quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }
        if (quantity === 0) {
            return this.removeItem(cartId, productId);
        }
        const cart = this.getOrCreateCart(cartId);
        const existingItem = cart.items.find(item => item.productId === productId);
        if (!existingItem) {
            throw new Error(`Cart item with Product ID ${productId} not found in cart`);
        }
        existingItem.quantity = quantity;
        existingItem.pricing.totalPrice.amount = existingItem.pricing.unitPrice.amount * quantity;
        return this.recalculateTotals(cart);
    }
    /**
     * Clears all items in the cart.
     */
    clearCart(cartId) {
        const cart = this.getOrCreateCart(cartId);
        cart.items = [];
        return this.recalculateTotals(cart);
    }
    /**
     * Internal helper to calculate cart totals based on its items.
     */
    recalculateTotals(cart) {
        // Note: Assuming all currencies are USD for simplicity. 
        // In a real app, we'd group totals by currency or convert them.
        let totalAmount = 0;
        let totalQuantity = 0;
        for (const item of cart.items) {
            totalAmount += item.pricing.totalPrice.amount;
            totalQuantity += item.quantity;
        }
        cart.cartTotal.amount = totalAmount;
        cart.totalQuantity = totalQuantity;
        // Update the store
        carts.set(cart.id, cart);
        return cart;
    }
}
exports.CartService = CartService;
exports.cartService = new CartService();
