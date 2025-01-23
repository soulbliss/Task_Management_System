import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { logger } from '@/lib/utils/logger';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    logger.debug('Registration', 'Processing registration request', { email });

    // Validate input
    if (!email || !password) {
      logger.warn('Registration', 'Missing required fields', {
        email: !!email,
        password: !!password
      });
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      logger.warn('Registration', 'User already exists', { email });
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    const newUser = result.rows[0];
    logger.info('Registration', 'User registered successfully', { userId: newUser.id });

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
      }
    }, { status: 201 });

  } catch (error) {
    logger.error('Registration', 'Registration error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 