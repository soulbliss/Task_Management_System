const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
  console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Successfully connected to database!');
    console.log('Current database time:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Failed to connect to database:');
    console.error(err);
  } finally {
    await pool.end();
  }
}

testConnection(); 