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