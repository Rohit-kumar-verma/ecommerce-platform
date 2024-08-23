// import Pool from '../../../Pool';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {pool} from '../../../../../ecommerce-backend/config/db.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Find the user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
