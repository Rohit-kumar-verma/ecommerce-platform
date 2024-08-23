import { pool } from "../config/db";


export const addProduct = async (req, res) => {
  const { name, category, description, price, discount } = req.body;
  const sellerId = req.userId;

  try {
    const newProduct = await pool.query(
      "INSERT INTO products (name, category, description, price, discount, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, category, description, price, discount, sellerId]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

export const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, discount } = req.body;

  try {
    const updatedProduct = await pool.query(
      "UPDATE products SET name = $1, category = $2, description = $3, price = $4, discount = $5 WHERE id = $6 RETURNING *",
      [name, category, description, price, discount, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit product' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getProducts = async (req, res) => {
  const { name, category } = req.query;

  try {
    const products = await pool.query(
      "SELECT * FROM products WHERE ($1::text IS NULL OR name ILIKE $1) AND ($2::text IS NULL OR category = $2)",
      [name ? `%${name}%` : null, category]
    );
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
