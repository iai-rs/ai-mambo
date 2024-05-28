import React from "react";
import IorsLogo from "../../../public/iors_logo.png";
import Image from "next/image";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "../ui/button";
import { signOut } from "~/auth";
import { api } from "~/trpc/server";
import SignOut from "./SignOut";
import SignedUser from "./SignedUser";

const TopBar = () => {
  // const user = api.users.getUserByEmail()
  return (
    <div className="fixed w-full bg-muted p-2">
      <div className="flex items-center justify-between">
        <Image src={IorsLogo} alt="iors" />
        <div className="flex gap-2">
          <SignOut />
          <SignedUser />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
