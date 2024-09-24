"use server";

import { signIn } from "../../auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { api } from "~/trpc/server";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { type Role } from "@prisma/client";
import { hash } from "bcrypt";

const createResponse = (type: "success" | "error", text: string) => {
  return { type, text };
};

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
    invalid_type_error: "Unesite vaše ime.",
  }),
  email: z.string({
    invalid_type_error: "Unesite adresu elektronske pošte.",
  }),
});

const SetPassword = z.object({
  password: z.string({
    invalid_type_error: "Unesite lozinku.",
  }),
  confirmPassword: z.string({
    invalid_type_error: "Unesite potvrdu lozinke.",
  }),
});

export async function register(prevState: string | null, formData: FormData) {
  const validatedFields = RegisterUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return createResponse(
      "error",
      "Nedostaju polja. Neuspešno kreiranje naloga.",
    );
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
    return createResponse("success", "Korisnik je dodat.");
  } else {
    return createResponse(
      "error",
      "Korisnik sa ovom email adresom već postoji.",
    );
  }
}

export async function changeUserRole(userId: string, newRole: Role) {
  const user = await api.users.getUserById({ id: userId });
  if (!user) return null;
  const updatedUser = await api.users.updateUserRole({
    id: user.id,
    role: newRole,
  });
  return updatedUser;
}

export async function deleteUser(userId: string) {
  const deletedUser = await api.users.deleteUserById({ id: userId });
  return deletedUser;
}

export async function setPassword(
  urlData: { changePasswordSecretKey: string | null; email: string | null },
  prevState: { type: "success" | "error"; text: string } | null,
  formData: FormData,
) {
  const validatedFields = SetPassword.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
  });

  if (!validatedFields.success) {
    return createResponse(
      "error",
      "Nedostaju polja. Neuspešno postavljanje lozinke.",
    );
  }

  const { password, confirmPassword } = validatedFields.data;
  const { changePasswordSecretKey, email } = urlData;

  if (
    typeof changePasswordSecretKey !== "string" ||
    typeof email !== "string"
  ) {
    return createResponse(
      "error",
      "Nešto nije u redu sa URL-om. Proverite vaš email.",
    );
  }

  if (password !== confirmPassword) {
    return createResponse(
      "error",
      "Lozinka i potvrda lozinke se ne podudaraju.",
    );
  }

  const user = await api.users.getUserByEmail({ email: email });
  if (!user) {
    console.log("Korisnik sa ovom email adresom ne postoji.");
    return createResponse("error", "Došlo je do greške.");
  }
  if (user.change_password_secret_key !== changePasswordSecretKey) {
    console.log("Tajni ključ za promenu lozinke je pogrešan.");
    return createResponse("error", "Došlo je do greške.");
  }

  const hashedPassword = await hash(password, 10);
  const modifiedUser = await api.users.updateUserPassword({
    email: email,
    newPassword: hashedPassword,
  });

  return createResponse("success", "Lozinka uspešno postavljena");
}
