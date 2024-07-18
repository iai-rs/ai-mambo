/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { setPassword } from "~/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";

export default function SetPasswordForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const setPasswordWithUrlData = async (
    prevState: { type: "success" | "error"; text: string } | null,
    formData: FormData,
  ) => {
    return setPassword(
      {
        changePasswordSecretKey: searchParams.get("tempkey"),
        email: searchParams.get("email"),
      },
      prevState,
      formData,
    );
  };
  const [formMessage, formAction] = useFormState(setPasswordWithUrlData, null);

  useEffect(() => {
    if (formMessage?.type === "error") {
      toast({
        variant: "destructive",
        title: "GREŠKA",
        description: formMessage.text,
      });
    }

    if (formMessage?.type === "success") {
      toast({
        title: "USPEH",
        description: formMessage.text,
      });
      router.push("/");
    }
  }, [formMessage, router, toast]);

  return (
    <form action={formAction} className="space-y-3 rounded-md border">
      <div className="flex-1 rounded-lg bg-background px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl text-foreground">{"Postavi lozinku"}</h1>
        <div className="w-full">
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {"Lozinka"}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirm-password"
            >
              {"Potvrdi lozinku"}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirm-password"
                type="password"
                name="confirm-password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>
        <SetPasswordButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
      </div>
    </form>
  );
}

function SetPasswordButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {"Postavi lozinku"}
    </Button>
  );
}
