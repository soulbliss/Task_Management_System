import NextAuth from "next-auth/next"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import pool from "@/lib/db"
import { logger } from "@/lib/utils/logger"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    }
  }

  interface User {
    id: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
  }
}

const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        logger.debug('Attempting to authorize user', { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          logger.warn('Missing credentials');
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
            logger.warn('User not found', { email: credentials.email });
            throw new Error('No user found with this email');
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password_hash);

          if (!isValid) {
            logger.warn('Invalid password', { email: credentials.email });
            throw new Error('Invalid password');
          }

          logger.info('User authenticated successfully', { userId: user.id });

          // Return user object (without password)
          return {
            id: user.id.toString(),
            email: user.email,
          };
        } catch (error) {
          logger.error('Authentication error', {
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
    strategy: "jwt" as "jwt" | "database"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        logger.debug('Creating JWT token', { userId: user.id });
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        logger.debug('Creating user session', { userId: token.id });
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    }
  }
};

export const auth = NextAuth(authConfig);
export const authOptions = authConfig;

export const handlers = auth;

export const signIn = handlers.POST;
export const signOut = handlers.GET;

export default authOptions; 