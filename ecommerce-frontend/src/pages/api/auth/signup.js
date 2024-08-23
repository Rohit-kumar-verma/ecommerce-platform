// import Pool from '../../../Pool';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import pg from 'pg';

const { Pool } = pg

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await Pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, hashedPassword, role]);

    // Create JWT token
    const token = jwt.sign({ userId: newUserId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
