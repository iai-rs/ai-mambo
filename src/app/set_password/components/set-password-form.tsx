"use client";

import { useSearchParams } from "next/navigation";
import { setPassword } from "~/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";

export default function SetPasswordForm() {
  const searchParams = useSearchParams();
  const setPasswordWithUrlData = setPassword.bind(null, {
    changePasswordSecretKey: searchParams.get("tempkey"),
    email: searchParams.get("email"),
  });
  const [errorMessage, formAction] = useFormState(setPasswordWithUrlData, null);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl">Set password:</h1>
        <div className="w-full">
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
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
              Confirm Password
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

function SetPasswordButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Set password
    </Button>
  );
}
