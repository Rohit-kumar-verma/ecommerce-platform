import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export default async function handler(req, res) {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error('Error during signup:', err);  // Log the error for debugging
    res.status(500).json({ error: 'User registration failed' });
  }
};
