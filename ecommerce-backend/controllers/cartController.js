import { pool } from "../config/db";

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  try {
    const cartItem = await pool.query(
      "INSERT INTO cart (user_id, product_id) VALUES ($1, $2) RETURNING *",
      [userId, productId]
    );
    res.json(cartItem.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM cart WHERE id = $1", [id]);
    res.json({ message: 'Removed from cart successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

export const getCartItems = async (req, res) => {
  const userId = req.userId;

  try {
    const cartItems = await pool.query(
      "SELECT cart.id, products.name, products.price, products.discount FROM cart INNER JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1",
      [userId]
    );
    res.json(cartItems.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};
