import { Request, Response } from 'express';
import { cartService } from './cart.service';

export class CartController {
  
  public getCart = (req: Request, res: Response) => {
    const cartId = req.params.cartId as string;
    try {
      const cart = cartService.getOrCreateCart(cartId);
      res.json(cart);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public addItem = (req: Request, res: Response) => {
    const cartId = req.params.cartId as string;
    const { productId, quantity, metadata } = req.body;

    if (!productId || typeof productId !== 'number') {
      return res.status(400).json({ error: 'Valid Product ID is required' });
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a number greater than 0' });
    }

    try {
      const updatedCart = cartService.addItem(cartId, productId, quantity, metadata);
      res.status(201).json(updatedCart);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  };

  public updateItemQuantity = (req: Request, res: Response) => {
    const cartId = req.params.cartId as string;
    const productId = req.params.productId as string;
    const { quantity } = req.body;

    if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Valid non-negative quantity is required' });
    }

    try {
      const updatedCart = cartService.updateQuantity(cartId, Number(productId), quantity);
      res.json(updatedCart);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  };

  public removeItem = (req: Request, res: Response) => {
    const cartId = req.params.cartId as string;
    const productId = req.params.productId as string;

    try {
      const updatedCart = cartService.removeItem(cartId, Number(productId));
      res.json(updatedCart);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public clearCart = (req: Request, res: Response) => {
    const cartId = req.params.cartId as string;
    
    try {
      const updatedCart = cartService.clearCart(cartId);
      res.json(updatedCart);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

export const cartController = new CartController();
