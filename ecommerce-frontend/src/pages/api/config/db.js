
import pg from 'pg';
const { Pool } = pg

// PostgreSQL Pool
export const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
  