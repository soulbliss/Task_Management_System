import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { logger } from "@/lib/utils/logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        logger.debug('Auth', 'Attempting to authorize user', { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          logger.warn('Auth', 'Missing credentials');
          throw new Error('Email and password are required');
        }

        try {
          // Find user by email
          const result = await pool.query(
            'SELECT id, email, password_hash FROM users WHERE email = $1',
            [credentials.email]
          );

          const user = result.rows[0];

          if (!user) {
            logger.warn('Auth', 'User not found', { email: credentials.email });
            throw new Error('No user found with this email');
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password_hash);

          if (!isValid) {
            logger.warn('Auth', 'Invalid password', { email: credentials.email });
            throw new Error('Invalid password');
          }

          logger.info('Auth', 'User authenticated successfully', { userId: user.id });

          // Return user object (without password)
          return {
            id: user.id.toString(),
            email: user.email,
          };
        } catch (error) {
          logger.error('Auth', 'Authentication error', {
            error: error instanceof Error ? error.message : 'Unknown error',
            email: credentials.email
          });
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        logger.debug('Auth', 'Creating JWT token', { userId: user.id });
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        logger.debug('Auth', 'Creating user session', { userId: token.id });
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    }
  }
}; 