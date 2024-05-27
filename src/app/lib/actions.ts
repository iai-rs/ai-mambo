'use server';

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { api } from "~/trpc/server";
import { hash } from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { env } from "../../env";
 
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

const sendVerificationEmail = async(email: string, changePasswordSecretKey: string) => {
  // Configure your SMTP server credentials
  const MAIL_USER=env.MAIL_USER;
  const MAIL_PASSWORD=env.MAIL_PASSWORD;
  const MAIL_SENDER_EMAIL=env.MAIL_SENDER_EMAIL;

  const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io', // Use your email service
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  const setPasswordUrl = `http://localhost:3000/set_password?tempkey=${changePasswordSecretKey}&email=${email}`

  await transporter.sendMail({
    from: MAIL_SENDER_EMAIL,
    to: email, // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Set password url: ${setPasswordUrl}</b>`, // html body
  });
  console.log("EMAIL SENT");
};

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


export async function setPassword(
  changePasswordSecretKey: string,
  email: string,
  password: string,
) {
  const user = await api.users.getUserByEmail({email: email});
  if (user === null) {
    console.log("User with this email doesn't exists");
  } else {
    if (user.change_password_secret_key !== changePasswordSecretKey) {
      console.log("Change password secret key is wrong");
    } else {
      const hashedPassword = await hash(password, 10);
      const modifiedUser = await api.users.updateUserPassword({
        email: email,
        newPassword: hashedPassword
      });
    }
  }
}

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
      const changePasswordSecretKey = uuidv4();

      const addedUser = await api.users.addUser({
        id: id,
        name: name,
        email: email,
        password: hashedPassword,
        change_password_secret_key: changePasswordSecretKey,
      });
      console.log(addedUser);
      await sendVerificationEmail(env.MAIL_RECEIVER_EMAIL, changePasswordSecretKey);
      
    } else {
        console.log("User with this email already exists");
    }
}