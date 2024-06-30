"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { register } from "~/app/lib/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Spinner from "~/components/ui/Spinner";

export default function InviteUserForm() {
  const [errorMessage, formAction] = useFormState(register, null);

  useEffect(() => {
    if (errorMessage === "User added") {
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }, [errorMessage]);

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
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{"Email"}</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
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
          {errorMessage && (
            <>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
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
