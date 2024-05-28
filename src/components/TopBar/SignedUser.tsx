"use client";

import React from "react";
import { useSession, getSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "../ui/avatar";

const SignedUser = () => {
  const { data, status, update } = useSession();
  console.log("sess", { data, status, update });

  return (
    <div>
      <Avatar>
        <AvatarFallback className="bg-red-300">AS</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default SignedUser;
