import { type Metadata } from "next";
import SetPasswordForm from "./components/set-password-form";

export const metadata: Metadata = {
  title: "Set password",
};

export default function SetPassword() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <SetPasswordForm />
      </div>
    </main>
  );
}
