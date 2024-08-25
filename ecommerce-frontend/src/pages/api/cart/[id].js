import { pool } from '../config/db.js';

export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM cart WHERE id = $1', [id]);
      res.status(200).json({ message: 'Removed from cart successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else if (req.method === 'PUT') {
    let { quantity } = req.body;

    // Set default quantity to 1 if not provided or if quantity is less than 1
    if (!quantity || quantity < 1) {
      quantity = 1;
    }

    try {
      await pool.query('UPDATE cart SET quantity = $1 WHERE id = $2', [quantity, id]);
      res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update quantity' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
