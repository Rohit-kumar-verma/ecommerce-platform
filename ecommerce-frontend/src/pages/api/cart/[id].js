import {verifyToken} from '../middleware/authMiddleware.js'
import {pool} from '../config/db.js'

export default async function handler(req, res) {
  const { id } = req.query;
    if (req.method === 'DELETE') {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const { role } = verifyToken(token);

    try {
      const value = await pool.query('DELETE FROM cart WHERE id = $1', [id]);
      console.log(value);
      res.status(200).json({ message: 'Remove from cart successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
