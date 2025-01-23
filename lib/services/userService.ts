import pool from '@/lib/db';
import { logger } from '@/lib/utils/logger';

interface User {
  id: number;
  email: string;
  created_at: Date;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  } catch (error) {
    logger.error('UserService', 'Error getting user by email', { error, email });
    throw error;
  }
} 