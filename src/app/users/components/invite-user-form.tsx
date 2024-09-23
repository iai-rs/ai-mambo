"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { register } from "~/app/lib/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Spinner from "~/components/ui/Spinner";
import { useToast } from "~/components/ui/use-toast";

// Wrapper function to match the expected signature of useFormState
const registerWrapper = async (
  state: { type: "success" | "error"; text: string } | null,
  formData: FormData,
) => {
  return await register(null, formData);
};

export default function InviteUserForm() {
  const { toast } = useToast();
  const [formMessage, formAction] = useFormState(registerWrapper, null);

  useEffect(() => {
    if (formMessage?.type === "success") {
      toast({
        title: "USPEH",
        description: formMessage.text,
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    }

    if (formMessage?.type === "error") {
      toast({
        variant: "destructive",
        title: "GREŠKA",
        description: formMessage.text,
      });
    }
  }, [formMessage, toast]);

  return (
    <form action={formAction} className="w-[400px] space-y-3">
      <div className="flex-1 rounded-lg border bg-background p-4">
        <h1 className="mb-6 text-2xl font-semibold">{"Pošalji pozivnicu"}</h1>
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{"Ime i prezime"}</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Unesite vaše puno ime"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{"Email"}</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Unesite vašu email adresu"
              required
            />
          </div>
        </div>
        <InviteUserButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* {formMessage && (
            <>
              <p className="text-sm text-red-500">{formMessage.text}</p>
            </>
          )} */}
        </div>
      </div>
    </form>
  );
}

function InviteUserButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 flex w-full gap-2" aria-disabled={pending}>
      <span>{"Pozovi korisnika"}</span>
      {pending && <Spinner />}
    </Button>
  );
}
