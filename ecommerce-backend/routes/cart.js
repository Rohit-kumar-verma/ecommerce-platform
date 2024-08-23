import express from 'express';
import { addToCart, removeFromCart, getCartItems } from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authenticate, addToCart);
router.delete('/:id', authenticate, removeFromCart);
router.get('/', authenticate, getCartItems);

export default router;
