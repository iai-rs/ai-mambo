"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "../../lib/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Spinner from "~/components/ui/Spinner";

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl">Forma za logovanje</h1>
        <div className="w-full">
          <div>
            <Label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Unesite vašu email adresu"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <Label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Lozinka
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Unesite lozinku"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>
        <LoginButton />
        <div
          className="space-x-1ž flex h-8 items-end"
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

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 flex w-full gap-4" aria-disabled={pending}>
      {"Logovanje"}
      {pending && <Spinner />}
    </Button>
  );
}
