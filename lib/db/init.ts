import pkg from 'pg';
const { Pool } = pkg;
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await pool.query(sqlContent);
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Error initializing database', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase().catch(error => {
    logger.error('Failed to initialize database', error);
    process.exit(1);
  });
}

export default initializeDatabase; 