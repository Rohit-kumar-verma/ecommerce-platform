// import Pool from '../../../Pool';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {pool} from '../config/db.js'

export default async function handler(req, res) {
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
      expiresIn: '2h'
    });

    res.json({ token, user: user.rows[0] });
  } catch (err) {
    console.error('Error during login:', err);  // Log the error for debugging
    res.status(500).json({ error: 'User login failed' });
  }
};