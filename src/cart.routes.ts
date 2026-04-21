import { Router } from 'express';
import { cartController } from './cart.controller';

const router = Router();

router.get('/:cartId', cartController.getCart);

router.post('/:cartId/items', cartController.addItem);

router.put('/:cartId/items/:productId', cartController.updateItemQuantity);

router.delete('/:cartId/items/:productId', cartController.removeItem);

router.delete('/:cartId', cartController.clearCart);

export default router;
