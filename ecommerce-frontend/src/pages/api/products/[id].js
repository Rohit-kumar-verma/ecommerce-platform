// import pool from '../../../server/config/pool';

// import { verifyToken } from '../../../ecommerce-backend/middleware/authMiddleware.js';
import {verifyToken} from '../middleware/authMiddleware.js'
import {pool} from '../config/db.js'

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  } else if (req.method === 'PUT') {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const { role } = verifyToken(token);
    if (role !== 'admin') return res.status(403).json({ error: 'Not authorized' });

    const { name, category, description, price, discount } = req.body;
    try {
      await pool.query(
        'UPDATE products SET name = $1, category = $2, description = $3, price = $4, discount = $5 WHERE id = $6',
        [name, category, description, price, discount, id]
      );
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else if (req.method === 'DELETE') {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const { role } = verifyToken(token);
    console.log(role);
    if (role === 'buyer') return res.status(403).json({ error: 'Not authorized' });

    try {
      const value = await pool.query('DELETE FROM products WHERE id = $1', [id]);
      console.log(value);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
