import { cartService } from './cart.service';

describe('CartService', () => {
  const cartId = 'test-cart-1';

  beforeEach(() => {
    try {
      cartService.clearCart(cartId);
    } catch {
    }
  });

  describe('addItem', () => {
    it('should add a new item and calculate initial totals', () => {
      const cart = cartService.addItem(cartId, 1, 2); // Product 1 costs $25.00 (2500)
      
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.totalQuantity).toBe(2);
      expect(cart.cartTotal.amount).toBe(5000); // 2500 * 2
    });

    it('should upsert an existing item by incrementing quantity', () => {
      cartService.addItem(cartId, 1, 2);
      const cart = cartService.addItem(cartId, 1, 3);
      
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(5);
      expect(cart.totalQuantity).toBe(5);
      expect(cart.cartTotal.amount).toBe(12500); // 2500 * 5
    });

    it('should throw an error when adding quantity <= 0', () => {
      expect(() => cartService.addItem(cartId, 1, 0)).toThrow('Quantity must be greater than 0');
      expect(() => cartService.addItem(cartId, 1, -1)).toThrow('Quantity must be greater than 0');
    });

    it('should throw an error for a non-existent product', () => {
      expect(() => cartService.addItem(cartId, 999, 1)).toThrow('Product with ID 999 not found');
    });

    it('should store metadata with the item', () => {
      const metadata = { color: 'red' };
      const cart = cartService.addItem('metadata-cart', 1, 1, metadata);
      
      expect(cart.items[0].metadata).toMatchObject(metadata);
      expect(cart.items[0].metadata).toHaveProperty('addedAt');
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      cartService.addItem(cartId, 1, 2);
      cartService.addItem(cartId, 2, 1); // Product 2 costs 15000
    });

    it('should update the quantity and recalculate totals', () => {
      const cart = cartService.updateQuantity(cartId, 1, 5);
      
      expect(cart.items.find(i => i.productId === 1)?.quantity).toBe(5);
      expect(cart.totalQuantity).toBe(6); // 5 + 1
      expect(cart.cartTotal.amount).toBe(27500); // (2500 * 5) + 15000
    });

    it('should remove the item when quantity is set to 0', () => {
      const cart = cartService.updateQuantity(cartId, 1, 0);
      
      expect(cart.items.length).toBe(1);
      expect(cart.items.find(i => i.productId === 1)).toBeUndefined();
      expect(cart.totalQuantity).toBe(1);
    });

    it('should throw an error if updating a non-existent item', () => {
      expect(() => cartService.updateQuantity(cartId, 3, 5)).toThrow('Cart item with Product ID 3 not found in cart');
    });
  });

  describe('removeItem', () => {
    it('should throw an error when removing from a non-existent cart', () => {
      expect(() => cartService.removeItem('ghost-cart', 1)).toThrow('Cart with ID ghost-cart not found');
    });
  });

  describe('getCart', () => {
    it('should throw a 404-like error for a non-existent cart', () => {
      expect(() => cartService.getCart('missing-cart')).toThrow('Cart with ID missing-cart not found');
    });
  });
});
