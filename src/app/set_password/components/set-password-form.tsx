"use client";

import { useSearchParams } from "next/navigation";
import { setPassword } from "~/app/lib/actions";

export default function SetPasswordForm() {
  const searchParams = useSearchParams();
  const tempKey = searchParams.get("tempkey");
  const email = searchParams.get("email");

  const setPasswordF = () => {
    const newPassword = "password"; // TODO: grab value from useState
    void setPassword(tempKey ? tempKey : "", email ? email : "", newPassword);
  };

  return (
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
      <button onClick={setPasswordF} className="mt-4 w-full">
        Set password
      </button>
    </div>
  );
}
