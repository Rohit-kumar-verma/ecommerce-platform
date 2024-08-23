import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js'
import productsRouter from './routes/products.js'
import cartRouter from './routes/cart.js'
import dotenv from 'dotenv';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// // PostgreSQL Pool
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
// });

app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

// Routes
app.use('api/auth', authRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
