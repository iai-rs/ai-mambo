// import RegisterForm from '../ui/register-form';
import { type Metadata } from "next";
import Link from "next/link";
import InviteUserForm from "./components/invite-user-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <InviteUserForm />
      </div>
    </main>
  );
}
