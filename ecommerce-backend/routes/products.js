import express from 'express';
import { addProduct, editProduct, deleteProduct, getProducts } from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authenticate, authorize('admin', 'seller'), addProduct);
router.put('/:id', authenticate, authorize('admin', 'seller'), editProduct);
router.delete('/:id', authenticate, authorize('admin', 'seller'), deleteProduct);
router.get('/', getProducts);

export default router;