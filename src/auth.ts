import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import type { User } from '@/app/lib/definitions';

type User = {
    id: string,
    name: string,
    email: string,
    password: string,
}

const users: User[] = [
    { id: "1", name: "Alice", email: "admin@example.com", password: "admin1" },
    { id: "2", name: "Bob", email: "bob@example.com", password: "pass456" }
];

async function getUser(email: string): Promise<User | undefined> {
    return users.find(user => user.email === email);
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
            if (!user) return null;
            // check password
            if (password === user.password) {
                return user;
            } else {
                return null;
            }
        }

        return null;
      },
    }),
  ],
});
