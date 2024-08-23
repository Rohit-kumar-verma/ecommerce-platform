import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'User registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'User login failed' });
  }
};
