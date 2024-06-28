"use server";

import { signIn } from "../../auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { api } from "~/trpc/server";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { env } from "../../env";
import { redirect } from "next/dist/server/api-utils";
import { Role } from "@prisma/client";
import { hash } from "bcrypt";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const sendVerificationEmail = async (
  email: string,
  changePasswordSecretKey: string,
) => {
  // Configure your SMTP server credentials
  const MAIL_USER = env.MAIL_USER;
  const MAIL_PASSWORD = env.MAIL_PASSWORD;
  const MAIL_SENDER_EMAIL = env.MAIL_SENDER_EMAIL;

  const transporter = nodemailer.createTransport({
    host: "sendmail.gov.rs", // Use your email service
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
  });

  const setPasswordUrl = `http://server.institutonline.ai:55614/set_password?tempkey=${changePasswordSecretKey}&email=${email}`;

  await transporter.sendMail({
    from: "obavestenja@ivi.ac.rs",
    to: email, // list of receivers
    subject: "Pozivnica za Mamografija projekat", // Subject line
    text: `Pozvani ste da učestvujete u projektu Mamografija. Potrebno je postavite svoju lozinku odlaskom na stranicu: ${setPasswordUrl}`, // plain text body
    html: `<h3>Pozvani ste da učestvujete u projektu Mamografija.</h3><div>Potrebno je da postavite svoju lozinku odlaskom na stranicu:<br/>${setPasswordUrl}</div>`, // html body
  });
  console.log("EMAIL SENT");
};

const RegisterUser = z.object({
  name: z.string({
    invalid_type_error: "Please enter your name.",
  }),
  email: z.string({
    invalid_type_error: "Please enter an email address.",
  }),
});

const SetPassword = z.object({
  password: z.string({
    invalid_type_error: "Please enter password.",
  }),
  confirmPassword: z.string({
    invalid_type_error: "Please enter confirm passwor.",
  }),
});

export async function register(prevState: string | null, formData: FormData) {
  const validatedFields = RegisterUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return "Missing Fields. Failed to Create Account." as string;
  }

  const { name, email } = validatedFields.data;

  const user = await api.users.getUserByEmail({ email: email });
  if (user === null) {
    const id = uuidv4();
    const changePasswordSecretKey = uuidv4();

    const addedUser = await api.users.addUser({
      id: id,
      name: name,
      email: email,
      change_password_secret_key: changePasswordSecretKey,
    });
    console.log(addedUser);
    console.log("Sending an email...");
    await sendVerificationEmail(email, changePasswordSecretKey);
    return "User added" as string;
  } else {
    return "User with this email already exists";
  }
}

export async function changeUserRole(userId: string, newRole: Role) {
  const user = await api.users.getUserById({ id: userId });
  if (!user) return null;
  const updatedUser = await api.users.updateUserRole({
    id: user.id,
    role: newRole,
  });
}

export async function deleteUser(userId: string) {
  const deletedUser = await api.users.deleteUserById({ id: userId });
  return deleteUser;
}

export async function setPassword(
  urlData: { changePasswordSecretKey: string | null; email: string | null },
  prevState: string | null,
  formData: FormData,
) {
  const validatedFields = SetPassword.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
  });

  if (!validatedFields.success) {
    return "Missing Fields. Failed to set password.";
  }

  const { password, confirmPassword } = validatedFields.data;
  const { changePasswordSecretKey, email } = urlData;

  if (
    typeof changePasswordSecretKey !== "string" ||
    typeof email !== "string"
  ) {
    return "Something is wrong with url. Please check your email";
  }

  if (password !== confirmPassword) {
    return "Password and confirm password fields doesn't match";
  }

  const user = await api.users.getUserByEmail({ email: email });
  if (!user) {
    console.log("User with this email doesn't exists");
    return "Something went wrong";
  }
  if (user.change_password_secret_key !== changePasswordSecretKey) {
    console.log("Change password secret key is wrong");
    return "Something went wrong";
  }

  const hashedPassword = await hash(password, 10);
  const modifiedUser = await api.users.updateUserPassword({
    email: email,
    newPassword: hashedPassword,
  });
  return "Password set";
}
