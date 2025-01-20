import { Pool } from 'pg';
import { logger } from '@/lib/utils/logger';

// Database configuration with SSL settings for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    logger.error('Error acquiring client', err);
    return;
  }
  if (!client) {
    logger.error('No client available');
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      logger.error('Error executing query', err);
      return;
    }
    logger.info('Connected to PostgreSQL database at', result.rows[0].now);
  });
});

export default pool; 