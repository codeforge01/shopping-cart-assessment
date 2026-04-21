"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const router = (0, express_1.Router)();
// Retrieve cart details
router.get('/:cartId', cart_controller_1.cartController.getCart);
// Add an item to the cart
router.post('/:cartId/items', cart_controller_1.cartController.addItem);
// Update quantity of an existing item in the cart
router.put('/:cartId/items/:productId', cart_controller_1.cartController.updateItemQuantity);
// Remove an item entirely from the cart
router.delete('/:cartId/items/:productId', cart_controller_1.cartController.removeItem);
// Clear the entire cart
router.delete('/:cartId', cart_controller_1.cartController.clearCart);
exports.default = router;
