'use server';

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { api } from "~/trpc/server";
import { hash } from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const RegisterUser = z.object({
  name: z.string({
    invalid_type_error: 'Please enter your name.',
  }),
  email: z.string({
    invalid_type_error: 'Please enter an email address.',
  }),
  password: z.string({
    invalid_type_error: 'Please enter a password.',
  }),
  confirmPassword: z.string({
    invalid_type_error: 'Please confirm your password.',
  }),
})


export async function register(
  prevState: string | null,
  formData: FormData,
) {

  const validatedFields = RegisterUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return "Missing Fields. Failed to Create Account."
  }

  const { name, email, password, confirmPassword } = validatedFields.data

  // Check if passwords match
  if (password !== confirmPassword) {
    return "Passwords don't match."
  }

  // const hashedPassword = await bcrypt.hash(password, 10)

    const users = await api.users.getUsers();
    const user = await api.users.getUserByEmail({email: email});
    if (user === null) {
      const id = uuidv4()
      const hashedPassword = await hash(password, 10);

      const addedUser = await api.users.addUser({
        id: id,
        name: name,
        email: email,
        password: hashedPassword,
      });
      console.log("***********************************")
      console.log(addedUser);
      console.log("***********************************")
    } else {
        console.log("User with this email already exists");
    }
}