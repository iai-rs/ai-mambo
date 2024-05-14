'use server';

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
      console.log("*************************************************************************************");
      console.log(formData);
      console.log("*************************************************************************************");
    await signIn('credentials', formData);
    // await signIn('credentials', { email: 'user@example.com', password: 'password' });
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
