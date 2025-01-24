import pool from "@/lib/db"
import { logger } from "@/lib/utils/logger"
import bcrypt from "bcryptjs"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

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

const config = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        logger.debug('Attempting to authorize user', { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          logger.warn('Missing credentials');
          return null;
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
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password_hash);

          if (!isValid) {
            logger.warn('Invalid password', { email: credentials.email });
            return null;
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
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
  },
  // debug: process.env.NODE_ENV === 'development',
  trustHost: true
} as const;

export const authOptions = config;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const auth = NextAuth(config);
export const handlers = auth;
export const signIn = handlers.POST;
export const signOut = handlers.GET;

export default authOptions; 