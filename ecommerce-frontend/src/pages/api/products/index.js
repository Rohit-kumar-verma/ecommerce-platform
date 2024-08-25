import {verifyToken} from '../middleware/authMiddleware.js'
import {pool} from '../config/db.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM products');
      console.log(result);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const user = verifyToken(token);
    if (user.role === 'buyer') return res.status(403).json({ error: 'Not authorized' });

    const { name, category, description, price, discount } = req.body;
    try {
      await pool.query(
        'INSERT INTO products (seller_id, name, category, description, price, discount) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.userId, name, category, description, price, discount]
      );
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
