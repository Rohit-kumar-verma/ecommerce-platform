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
    const { productId, quantity } = req.body;
    // const user.userId = user.user.userId; // Assuming you have the user's ID from authentication

    try {
      // Check if the product is already in the cart
      const existingCartItem = await pool.query(
        'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
        [user.userId, productId]
      );

      if (existingCartItem.rows.length > 0) {
        // Product exists, so update the quantity
        await pool.query(
          'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
          [quantity, user.userId, productId]
        );
      } else {
        // Product does not exist, so insert a new row
        await pool.query(
          'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
          [user.userId, productId, quantity]
        );
      }
      res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product to cart' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
