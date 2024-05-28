import { type Metadata } from "next";
import Link from "next/link";
import SetPasswordForm from "./components/set-password-form";

export const metadata: Metadata = {
  title: "Set password",
};

export default function SetPassword() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Link href="/">logo</Link>
          </div>
        </div>

        <SetPasswordForm />
      </div>
    </main>
  );
}
