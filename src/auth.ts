import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { api } from "~/trpc/server";
import bcrypt from 'bcrypt';
// import { sql } from '@vercel/postgres';
// import type { User } from '@/app/lib/definitions';

type User = {
    id: string,
    name: string,
    email: string,
    password: string,
}

async function getUser(email: string): Promise<User | undefined> {
  const users = await api.users.getUsers();
  const user = users.find(user => user.email === email);
  return user;
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
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
});
