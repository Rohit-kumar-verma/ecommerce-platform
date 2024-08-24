// import pool from '../../../server/config/pool';
// import { verifyToken } from '../../../ecommerce-backend/middleware/authMiddleware.js';
import {verifyToken} from '../middleware/authMiddleware.js'
import {pool} from '../config/db.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const user = verifyToken(token);
    try {
      const result = await pool.query(
        'SELECT cart.id, products.name, products.category, products.price, products.discount FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1',
        [user.userId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart items' });
    }
  } else if (req.method === 'POST') {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const user = verifyToken(token);
    console.log(user);
    const { productId } = req.body;

    try {
      await pool.query(
        'INSERT INTO cart (user_id, product_id) VALUES ($1, $2)',
        [user.userId, productId]
      );
      res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product to cart' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
