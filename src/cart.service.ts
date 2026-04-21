import { Cart, CartItem, Product } from './types';
import { ProductRepository } from './product.repository';

// In-memory data store for carts
const carts = new Map<string, Cart>();

export class CartService {
  /**
   * Retrieves a cart by ID. If it doesn't exist, initializes an empty cart.
   */
  public getOrCreateCart(cartId: string): Cart {
    if (!carts.has(cartId)) {
      carts.set(cartId, {
        id: cartId,
        items: [],
        cartTotal: { amount: 0, currency: 'USD' },
        totalQuantity: 0
      });
    }
    return carts.get(cartId)!;
  }

  /**
   * Adds an item to the cart. Aggregates quantity if the product is already in the cart.
   */
  public addItem(cartId: string, productId: number, quantity: number, metadata: Record<string, unknown> = {}): Cart {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const product = ProductRepository.getById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const cart = this.getOrCreateCart(cartId);
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      // Re-calculate the total price for this line item based on new quantity
      existingItem.pricing.totalPrice.amount = existingItem.pricing.unitPrice.amount * existingItem.quantity;
    } else {
      const newItem: CartItem = {
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
  public removeItem(cartId: string, productId: number): Cart {
    const cart = this.getOrCreateCart(cartId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    return this.recalculateTotals(cart);
  }

  /**
   * Formally updates the quantity of a specific cart item.
   */
  public updateQuantity(cartId: string, productId: number, quantity: number): Cart {
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
  public clearCart(cartId: string): Cart {
    const cart = this.getOrCreateCart(cartId);
    cart.items = [];
    return this.recalculateTotals(cart);
  }

  /**
   * Internal helper to calculate cart totals based on its items.
   */
  private recalculateTotals(cart: Cart): Cart {
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

export const cartService = new CartService();
