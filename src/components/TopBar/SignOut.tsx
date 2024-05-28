import React from "react";
import { Button } from "../ui/button";
import { signOut } from "~/auth";

const SignOut = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="outline">Sign Out</Button>
    </form>
  );
};

export default SignOut;
