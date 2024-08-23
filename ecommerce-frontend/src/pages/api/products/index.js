// import pool from '../../../server/config/pool';

// import { verifyToken } from '../../../ecommerce-backend/middleware/authMiddleware';
import {verifyToken} from '../../../../../ecommerce-backend/middleware/authMiddleware.js'
import {pool} from '../../../../../ecommerce-backend/config/db.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM products');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const { user } = verifyToken(token);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Not authorized' });

    const { name, category, description, price, discount } = req.body;
    try {
      await pool.query(
        'INSERT INTO products (name, category, description, price, discount) VALUES ($1, $2, $3, $4, $5)',
        [name, category, description, price, discount]
      );
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
