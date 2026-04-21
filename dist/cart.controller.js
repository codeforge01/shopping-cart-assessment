"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
class CartController {
    getCart = (req, res) => {
        const cartId = req.params.cartId;
        try {
            const cart = cart_service_1.cartService.getOrCreateCart(cartId);
            res.json(cart);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    addItem = (req, res) => {
        const cartId = req.params.cartId;
        const { productId, quantity, metadata } = req.body;
        if (!productId || typeof productId !== 'number') {
            return res.status(400).json({ error: 'Valid Product ID is required' });
        }
        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a number greater than 0' });
        }
        try {
            const updatedCart = cart_service_1.cartService.addItem(cartId, productId, quantity, metadata);
            res.status(201).json(updatedCart);
        }
        catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    };
    updateItemQuantity = (req, res) => {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const { quantity } = req.body;
        if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ error: 'Valid non-negative quantity is required' });
        }
        try {
            const updatedCart = cart_service_1.cartService.updateQuantity(cartId, Number(productId), quantity);
            res.json(updatedCart);
        }
        catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    };
    removeItem = (req, res) => {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        try {
            const updatedCart = cart_service_1.cartService.removeItem(cartId, Number(productId));
            res.json(updatedCart);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    clearCart = (req, res) => {
        const cartId = req.params.cartId;
        try {
            const updatedCart = cart_service_1.cartService.clearCart(cartId);
            res.json(updatedCart);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
exports.CartController = CartController;
exports.cartController = new CartController();
